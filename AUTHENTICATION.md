# Authentication & Token Management Guide

## Overview

The StudiWelt frontend uses **JWT-based authentication** with automatic token management. Both access and refresh tokens live in HttpOnly cookies, so authenticated requests work as long as the browser sends cookies with each call.

## How It Works

### Token Flow

1. **Login** → User enters credentials
2. **Backend Response** → Returns session metadata and sets HttpOnly cookies for access (15 min) and refresh (7 days) tokens
3. **Token Storage** → Cookies are managed by the browser; JavaScript never sees the raw tokens
4. **API Requests** → `fetch` calls include cookies automatically (`credentials: 'include'`)
5. **Token Refresh** → Automatic refresh before expiration

### Token Storage

| Token Type | Storage | Duration | Purpose |
|------------|---------|----------|---------|
| Access Token | HttpOnly Cookie (`accessToken`) | 15 minutes | API authentication |
| Refresh Token | HttpOnly Cookie (`refreshToken`) | 7 days | Refresh access token |
| User Data | LocalStorage (Zustand) | Persistent | UI state |

## Usage Examples

### Making Authenticated Requests

All API calls through `fetchApi()` automatically include authentication cookies:

```typescript
import { protectedApi } from '@/lib/api/client';

// ✅ Automatically includes authentication cookies
const profile = await protectedApi.getUserProfile();

// ✅ Works for all HTTP methods
await protectedApi.updateUserProfile({ name: 'John' });
```

### Using Auth Store

```typescript
import { useAuthStore } from '@/lib/stores/auth-store';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Check if user is logged in
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  // Access user data
  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Creating Protected API Endpoints

Add your API endpoints to `lib/api/client.ts`:

```typescript
export const yourApi = {
  // Protected endpoint - token auto-included
  async getData(): Promise<ApiResponse<YourType>> {
    return fetchApi('/your/endpoint', {
      method: 'GET',
    });
  },

  // Public endpoint - skip auth
  async getPublicData(): Promise<ApiResponse<YourType>> {
    return fetchApi('/public/endpoint', {
      method: 'GET',
    }, true); // true = skip auth
  },
};
```

## API Client Details

### fetchApi Function

The `fetchApi` function automatically:
- ✅ Includes credentials for cookies
- ✅ Handles 401 Unauthorized errors
- ✅ Parses JSON responses
- ✅ Throws typed errors

### Parameters

```typescript
fetchApi<T>(
  endpoint: string,      // e.g., '/user/profile'
  options: RequestInit,  // fetch options
  skipAuth?: boolean     // true = avoid triggering refresh logic
)
```

### Error Handling

```typescript
import { ApiError } from '@/lib/api/client';

try {
  await protectedApi.getData();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Token expired - user will be logged out
      console.log('Session expired');
    } else {
      console.log(error.message);
    }
  }
}
```

## Token Refresh

### Automatic Refresh

The `AuthProvider` component handles automatic token refresh:

- ✅ Attempts a refresh on initial load if cookies exist
- ✅ Schedules proactive refresh ~1 minute before access token expiry
- ✅ Clears client state if refresh fails (cookies are already invalidated server-side)

### Manual Refresh

```typescript
const { refreshToken } = useAuthStore();

try {
  await refreshToken();
  console.log('Token refreshed');
} catch (error) {
  console.log('Refresh failed - user logged out');
}
```

## Protected Routes

Create a protected page that handles direct access correctly:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, user, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <div>Protected content</div>;
}
```

**Why this pattern?**
- ✅ Waits for initial session check before redirecting
- ✅ Respects automatic cookie-based authentication
- ✅ Shows loading spinner during bootstrapping
- ✅ Works with browser refresh and direct navigation

## Security Best Practices

### ✅ What We Do

1. **HttpOnly Cookies** - Refresh tokens in HttpOnly cookies (XSS protection)
2. **Short-lived Tokens** - Access tokens expire in 15 minutes
3. **Cookie Credentials** - Auth cookies sent only on same-site requests with `credentials: 'include'`
4. **CORS** - Backend validates origin
5. **Token Rotation** - New tokens on refresh

### ⚠️ Important Notes

- **Never log tokens** in production
- **Never store tokens** in localStorage (we use cookies)
- **Always use HTTPS** in production
- **Validate tokens** on backend for every request

## Common Issues & Solutions

### Issue: API returns 401 Unauthorized

**Cause:** Token expired or invalid

**Solution:** Token refresh will happen automatically. If refresh fails, user is logged out.

```typescript
// This is handled automatically by the auth system
// User will be redirected to /auth/login
```

### Issue: Token not included in request

**Cause:** Using `skipAuth = true` or cookie not set

**Solution:**
```typescript
// Don't skip auth for protected endpoints
await fetchApi('/protected', { method: 'GET' }); // ✅ Correct

// Only skip for public endpoints
await fetchApi('/public', { method: 'GET' }, true); // ✅ For public only
```

### Issue: User stays logged in after closing browser

**Cause:** Zustand persists user data in localStorage

**Solution:** This is intentional. User can manually logout or wait for token expiration.

## Testing Authentication

### Test Login Flow

```bash
# 1. Start backend
cd backend && mvn spring-boot:run

# 2. Start frontend
cd frontend-next && npm run dev

# 3. Register user at http://localhost:3000/auth/register

# 4. Verify email (check console logs for link)

# 5. Login at http://localhost:3000/auth/login

# 6. Check Application > Cookies in DevTools:
#    - Should see: accessToken (15min)
#    - Should see: refreshToken (7days, HttpOnly)
```

### Test Token in Requests

Open DevTools > Network > Select any API request > Headers. Under *Request Headers* you should see a `Cookie` entry containing `accessToken=<...>` and `refreshToken=<...>` values (flagged as HttpOnly).

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Component → useAuthStore()                     │
│                    ↓                            │
│              fetchApi()                         │
│                    ↓                            │
│          Send with credentials: 'include'       │
│                    ↓                            │
│            fetch(API_URL)                       │
│                                                 │
└─────────────────────┬───────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│                   Backend                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  JwtAuthenticationFilter → Validate Token       │
│                    ↓                            │
│          Extract User from Token                │
│                    ↓                            │
│           Process Request                       │
│                    ↓                            │
│          Return Response                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Next Steps

1. **Add your protected endpoints** to `lib/api/client.ts`
2. **Create protected pages** that use `useAuthStore()`
3. **Handle 401 errors** in your components (auto-handled by default)
4. **Test token refresh** by waiting 15 minutes

---

For more details, see:
- `lib/api/client.ts` - API client implementation
- `lib/stores/auth-store.ts` - Auth state management
- `components/providers/AuthProvider.tsx` - Auth initialization

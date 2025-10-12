# Authentication & Token Management Guide

## Overview

The StudiWelt frontend uses **JWT-based authentication** with automatic token management. All authenticated requests automatically include the `Authorization: Bearer <token>` header.

## How It Works

### Token Flow

1. **Login** → User enters credentials
2. **Backend Response** → Returns access token (15 min) and sets HttpOnly refresh token cookie (7 days)
3. **Token Storage** → Access token stored in cookie for automatic inclusion
4. **API Requests** → All protected endpoints automatically include `Authorization` header
5. **Token Refresh** → Automatic refresh before expiration

### Token Storage

| Token Type | Storage | Duration | Purpose |
|------------|---------|----------|---------|
| Access Token | Cookie (`accessToken`) | 15 minutes | API authentication |
| Refresh Token | HttpOnly Cookie (backend) | 7 days | Refresh access token |
| User Data | LocalStorage (Zustand) | Persistent | UI state |

## Usage Examples

### Making Authenticated Requests

All API calls through `fetchApi()` automatically include the auth token:

```typescript
import { protectedApi } from '@/lib/api/client';

// ✅ Automatically includes Authorization header
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
- ✅ Adds `Authorization: Bearer <token>` header
- ✅ Includes credentials for cookies
- ✅ Handles 401 Unauthorized errors
- ✅ Parses JSON responses
- ✅ Throws typed errors

### Parameters

```typescript
fetchApi<T>(
  endpoint: string,      // e.g., '/user/profile'
  options: RequestInit,  // fetch options
  skipAuth?: boolean     // true = don't add Authorization header
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

- ✅ Checks every 5 minutes
- ✅ Refreshes token if expired
- ✅ Logs out user if refresh fails

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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import Cookies from 'js-cookie';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, user, setAccessToken } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we have a valid token in cookies
    const token = Cookies.get('accessToken');

    if (token && !isAuthenticated) {
      // We have a token but auth state not loaded yet
      // Restore the token to auth store
      setAccessToken(token);
      setIsChecking(false);
    } else if (!token && !isAuthenticated) {
      // No token and not authenticated - redirect to login
      router.push('/auth/login');
    } else {
      // Already authenticated
      setIsChecking(false);
    }
  }, [isAuthenticated, router, setAccessToken]);

  // Show loading while checking authentication
  if (isChecking) {
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
- ✅ Checks for token in cookies before redirecting
- ✅ Restores token to auth store if found
- ✅ Shows loading spinner during auth check
- ✅ Prevents premature redirects on direct access
- ✅ Works with browser refresh and direct navigation

## Security Best Practices

### ✅ What We Do

1. **HttpOnly Cookies** - Refresh tokens in HttpOnly cookies (XSS protection)
2. **Short-lived Tokens** - Access tokens expire in 15 minutes
3. **Secure Headers** - Authorization header only on authenticated requests
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

Open DevTools > Network > Select any API request > Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

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
│        Add Authorization: Bearer <token>        │
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

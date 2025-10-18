// API Response Types matching Spring Boot backend

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: Record<string, string>;
}

// Auth DTOs
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

// User Models
export interface UserDto {
  id: number; // Long in Java
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean; // boolean in Java
  roles: string[]; // Set<String> in Java, serialized as array
}

export interface AuthResponse {
  accessToken: string;
  // Note: refreshToken is NOT included in JSON response - it's HttpOnly cookie only
  tokenType: string;
  expiresIn: number; // in seconds (Long in Java)
  user: UserDto;
}

export interface PreRegistrationData {
  email: string;
  passwordToken: string;
}

export interface LoginResponse {
  userExists: boolean;
  authData?: AuthResponse;
  preRegistrationData?: PreRegistrationData;
}

// Client-side auth state
export interface AuthState {
  user: UserDto | null;
  accessTokenExpiresAt: number | null;
  initialized: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterRequest, passwordToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: UserDto | null) => void;
}

// Theme types
export type Theme = 'light' | 'dark';

// Language types
export type Language = 'en' | 'de' | 'ru';

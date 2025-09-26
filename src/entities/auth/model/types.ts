export interface AuthenticationResponse {
  userId: string;
  email: string;
  fullName: string;
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
  roles: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
  device?: string;
  ipAddress?: string;
}

export interface RegisterPayload extends LoginPayload {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
}

export interface ForgotPasswordPayload {
  email: string;
  clientBaseUrl?: string;
}

export interface ResetPasswordPayload {
  userId: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}
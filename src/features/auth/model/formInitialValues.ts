import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  ResetPasswordFormValues,
} from './formSchemas';

export const createLoginInitialValues = (): LoginFormValues => ({
  email: '',
  password: '',
  device: 'web',
});

export const createRegisterInitialValues = (): RegisterFormValues => ({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Customer',
  device: 'web',
});

export const createForgotPasswordInitialValues = (clientBaseUrl?: string): ForgotPasswordFormValues => ({
  email: '',
  clientBaseUrl,
});

export const createResetPasswordInitialValues = (): ResetPasswordFormValues => ({
  newPassword: '',
  confirmPassword: '',
});

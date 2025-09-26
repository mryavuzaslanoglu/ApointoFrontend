import * as Yup from 'yup';
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
} from '@/entities/auth/model/types';
import { authMessageCatalog } from './messages';

export type LoginFormValues = LoginPayload;
export type ForgotPasswordFormValues = ForgotPasswordPayload;

export interface RegisterFormValues extends RegisterPayload {
  confirmPassword: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const validation = authMessageCatalog.validation;

export const loginValidationSchema = Yup.object({
  email: Yup.string().email(validation.emailInvalid).required(validation.emailRequired),
  password: Yup.string().required(validation.passwordRequired),
});

export const registerValidationSchema = Yup.object({
  firstName: Yup.string().required(validation.firstNameRequired),
  lastName: Yup.string().required(validation.lastNameRequired),
  email: Yup.string().email(validation.emailInvalid).required(validation.emailRequired),
  password: Yup.string().min(8, validation.passwordMin).required(validation.passwordRequired),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], validation.passwordsMismatch)
    .required(validation.confirmPasswordRequired),
});

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().email(validation.emailInvalid).required(validation.emailRequired),
});

export const resetPasswordValidationSchema = Yup.object({
  newPassword: Yup.string().min(8, validation.passwordMin).required(validation.passwordRequired),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], validation.passwordsMismatch)
    .required(validation.confirmPasswordRequired),
});



import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '@/entities/auth/model/types';
import { useAuthStore } from '@/entities/auth/model/authStore';
import { getErrorMessage } from '@/shared/lib/error';
import { useAuthMessages } from './messages';

export function useAuthActions() {
  const navigate = useNavigate();
  const { toast: toastMessages, errors } = useAuthMessages();

  const setCredentials = useAuthStore((state) => state.setCredentials);
  const logoutStore = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        const { data } = await authApi.login(payload);
        setCredentials(data);
        toast.success(toastMessages.loginSuccess);
        navigate('/', { replace: true });
      } catch (error) {
        toast.error(getErrorMessage(error, errors.loginFailed));
        throw error;
      }
    },
    [errors.loginFailed, navigate, setCredentials, toastMessages.loginSuccess]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      try {
        const { data } = await authApi.register(payload);
        setCredentials(data);
        toast.success(toastMessages.registerSuccess);
        navigate('/', { replace: true });
      } catch (error) {
        toast.error(getErrorMessage(error, errors.registerFailed));
        throw error;
      }
    },
    [errors.registerFailed, navigate, setCredentials, toastMessages.registerSuccess]
  );

  const forgotPassword = useCallback(
    async (payload: ForgotPasswordPayload) => {
      try {
        await authApi.forgotPassword(payload);
        toast.success(toastMessages.forgotPasswordSuccess);
      } catch (error) {
        toast.error(getErrorMessage(error, errors.forgotPasswordFailed));
        throw error;
      }
    },
    [errors.forgotPasswordFailed, toastMessages.forgotPasswordSuccess]
  );

  const resetPassword = useCallback(
    async (payload: ResetPasswordPayload) => {
      try {
        await authApi.resetPassword(payload);
        toast.success(toastMessages.resetPasswordSuccess);
        navigate('/auth/login', { replace: true });
      } catch (error) {
        toast.error(getErrorMessage(error, errors.resetPasswordFailed));
        throw error;
      }
    },
    [errors.resetPasswordFailed, navigate, toastMessages.resetPasswordSuccess]
  );

  const logout = useCallback(
    async () => {
      try {
        if (user && refreshToken) {
          await authApi.logout(user.id, refreshToken);
        }
      } catch (error) {
        console.error(errors.logout, error);
      } finally {
        logoutStore();
        navigate('/auth/login', { replace: true });
      }
    },
    [errors.logout, logoutStore, navigate, refreshToken, user]
  );

  return {
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };
}

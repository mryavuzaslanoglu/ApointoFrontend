import { ForgotPasswordForm } from '@/features/auth/ui';
import { useAuthMessages } from '@/features/auth/model/messages';

export function ForgotPasswordPage() {
  const { forms } = useAuthMessages();
  const messages = forms.forgotPassword;

  return (
    <div className="auth-page">
      <h1>{messages.title}</h1>
      <p className="form-subtitle">{messages.subtitle}</p>
      <ForgotPasswordForm />
    </div>
  );
}

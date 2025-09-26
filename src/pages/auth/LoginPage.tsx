import { useAuthMessages } from '@/features/auth/model/messages';
import { LoginForm } from '@/features/auth/ui';

export function LoginPage() {
  const { forms } = useAuthMessages();
  const messages = forms.login;

  return (
    <div className="auth-page">
      <h1>{messages.title}</h1>
      <LoginForm />
    </div>
  );
}

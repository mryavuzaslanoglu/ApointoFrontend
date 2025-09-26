import { useAuthMessages } from '@/features/auth/model/messages';
import { RegisterForm } from '@/features/auth/ui';

export function RegisterPage() {
  const { forms } = useAuthMessages();
  const messages = forms.register;

  return (
    <div className="auth-page">
      <h1>{messages.title}</h1>
      <RegisterForm />
    </div>
  );
}

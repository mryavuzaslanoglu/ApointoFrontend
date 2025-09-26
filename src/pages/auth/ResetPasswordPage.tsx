import { Link, useSearchParams } from 'react-router-dom';
import { ResetPasswordForm } from '@/features/auth/ui';
import { useAuthMessages } from '@/features/auth/model/messages';

export function ResetPasswordPage() {
  const { forms } = useAuthMessages();
  const messages = forms.resetPassword;
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId');
  const token = searchParams.get('token');

  if (!userId || !token) {
    return (
      <div className="auth-page">
        <h1>{messages.invalidToken.title}</h1>
        <p>{messages.invalidToken.description}</p>
        <div className="form-links single">
          <Link to="/auth/forgot-password">{messages.links.requestNew}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <h1>{messages.title}</h1>
      <ResetPasswordForm userId={userId} token={token} />
    </div>
  );
}

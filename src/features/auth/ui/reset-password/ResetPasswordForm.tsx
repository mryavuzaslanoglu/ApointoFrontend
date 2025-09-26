import { useCallback, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { PasswordInput } from '@/shared/ui/form';
import { useAuthActions } from '@/features/auth/model/useAuthActions';
import { useAuthMessages } from '@/features/auth/model/messages';
import { createResetPasswordInitialValues } from '@/features/auth/model/formInitialValues';
import { resetPasswordValidationSchema } from '@/features/auth/model/formSchemas';
import type { ResetPasswordFormValues } from '@/features/auth/model/formSchemas';
import type { ResetPasswordPayload } from '@/entities/auth/model/types';

interface ResetPasswordFormProps {
  userId: string;
  token: string;
}

export function ResetPasswordForm({ userId, token }: ResetPasswordFormProps) {
  const { resetPassword } = useAuthActions();
  const { forms } = useAuthMessages();
  const messages = forms.resetPassword;

  const initialValues = useMemo<ResetPasswordFormValues>(() => createResetPasswordInitialValues(), []);

  const handleSubmit = useCallback(
    async (
      values: ResetPasswordFormValues,
      { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
      const payload: ResetPasswordPayload = {
        userId,
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      try {
        await resetPassword(payload);
      } finally {
        setSubmitting(false);
      }
    },
    [resetPassword, token, userId]
  );

  return (
    <Formik<ResetPasswordFormValues>
      initialValues={initialValues}
      validationSchema={resetPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <PasswordInput
            name="newPassword"
            label={messages.fields.newPassword.label}
            placeholder={messages.fields.newPassword.placeholder}
          />
          <PasswordInput
            name="confirmPassword"
            label={messages.fields.confirmPassword.label}
            placeholder={messages.fields.confirmPassword.placeholder}
          />
          <Button type="submit" isLoading={isSubmitting}>
            {messages.submit}
          </Button>
          <div className="form-links single">
            <Link to="/auth/login">{messages.links.backToLogin}</Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}

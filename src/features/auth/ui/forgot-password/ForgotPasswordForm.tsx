import { useCallback, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { TextInput } from '@/shared/ui/form';
import { useAuthActions } from '@/features/auth/model/useAuthActions';
import { useAuthMessages } from '@/features/auth/model/messages';
import { createForgotPasswordInitialValues } from '@/features/auth/model/formInitialValues';
import { forgotPasswordValidationSchema } from '@/features/auth/model/formSchemas';
import type { ForgotPasswordFormValues } from '@/features/auth/model/formSchemas';

interface ForgotPasswordFormProps {
  clientBaseUrl?: string;
}

export function ForgotPasswordForm({ clientBaseUrl }: ForgotPasswordFormProps) {
  const { forgotPassword } = useAuthActions();
  const { forms } = useAuthMessages();
  const messages = forms.forgotPassword;

  const resolvedBaseUrl = useMemo(() => {
    if (clientBaseUrl) {
      return clientBaseUrl;
    }

    if (typeof window !== 'undefined') {
      return window.location.origin;
    }

    return undefined;
  }, [clientBaseUrl]);

  const initialValues = useMemo<ForgotPasswordFormValues>(
    () => createForgotPasswordInitialValues(resolvedBaseUrl),
    [resolvedBaseUrl]
  );

  const handleSubmit = useCallback(
    async (
      values: ForgotPasswordFormValues,
      { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
      try {
        await forgotPassword(values);
      } finally {
        setSubmitting(false);
      }
    },
    [forgotPassword]
  );

  return (
    <Formik<ForgotPasswordFormValues>
      initialValues={initialValues}
      enableReinitialize
      validationSchema={forgotPasswordValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="form">
          <TextInput
            name="email"
            label={messages.fields.email.label}
            placeholder={messages.fields.email.placeholder}
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

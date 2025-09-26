import { useCallback, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { PasswordInput, TextInput } from '@/shared/ui/form';
import { useAuthActions } from '@/features/auth/model/useAuthActions';
import { useAuthMessages } from '@/features/auth/model/messages';
import { createLoginInitialValues } from '@/features/auth/model/formInitialValues';
import { loginValidationSchema } from '@/features/auth/model/formSchemas';
import type { LoginFormValues } from '@/features/auth/model/formSchemas';

export function LoginForm() {
  const { login } = useAuthActions();
  const { forms } = useAuthMessages();
  const messages = forms.login;

  const initialValues = useMemo<LoginFormValues>(() => createLoginInitialValues(), []);

  const handleSubmit = useCallback(
    async (values: LoginFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
      try {
        await login(values);
      } finally {
        setSubmitting(false);
      }
    },
    [login]
  );

  return (
    <Formik<LoginFormValues> initialValues={initialValues} validationSchema={loginValidationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="form">
          <TextInput name="email" label={messages.fields.email.label} placeholder={messages.fields.email.placeholder} />
          <PasswordInput
            name="password"
            label={messages.fields.password.label}
            placeholder={messages.fields.password.placeholder}
          />
          <Button type="submit" isLoading={isSubmitting}>
            {messages.submit}
          </Button>
          <div className="form-links">
            <Link to="/auth/forgot-password">{messages.links.forgotPassword}</Link>
            <Link to="/auth/register">{messages.links.register}</Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}

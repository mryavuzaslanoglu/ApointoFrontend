import { useCallback, useMemo } from 'react';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { PasswordInput, TextInput } from '@/shared/ui/form';
import { useAuthActions } from '@/features/auth/model/useAuthActions';
import { useAuthMessages } from '@/features/auth/model/messages';
import { createRegisterInitialValues } from '@/features/auth/model/formInitialValues';
import { registerValidationSchema } from '@/features/auth/model/formSchemas';
import type { RegisterFormValues } from '@/features/auth/model/formSchemas';

export function RegisterForm() {
  const { register } = useAuthActions();
  const { forms } = useAuthMessages();
  const messages = forms.register;

  const initialValues = useMemo<RegisterFormValues>(() => createRegisterInitialValues(), []);

  const handleSubmit = useCallback(
    async (values: RegisterFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
      const { confirmPassword: _ignored, ...payload } = values;
      void _ignored;

      try {
        await register(payload);
      } finally {
        setSubmitting(false);
      }
    },
    [register]
  );

  return (
    <Formik<RegisterFormValues> initialValues={initialValues} validationSchema={registerValidationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form className="form">
          <TextInput
            name="firstName"
            label={messages.fields.firstName.label}
            placeholder={messages.fields.firstName.placeholder}
          />
          <TextInput
            name="lastName"
            label={messages.fields.lastName.label}
            placeholder={messages.fields.lastName.placeholder}
          />
          <TextInput name="email" label={messages.fields.email.label} placeholder={messages.fields.email.placeholder} />
          <PasswordInput
            name="password"
            label={messages.fields.password.label}
            placeholder={messages.fields.password.placeholder}
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
            <Link to="/auth/login">{messages.links.login}</Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}

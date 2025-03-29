import { Body, Container, Head, Heading, Html, Preview, Tailwind, Text, Section } from '@react-email/components';
import tailwindConfig from './email.tailwind.config';

interface ResetPasswordEmailProps {
  firstName: string;
}

const PasswordResetConfirmation = ({ firstName }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans">
          <Preview>If you did not reset your password, please contact our support team immediately.</Preview>

          <Container className="mx-auto py-20 px-2">
            <Section className="p-8" style={{ boxShadow: '0 0 0 1px #e2e8f0', borderRadius: '6px' }}>
              {/* Logo/Header Section */}
              <Heading className="text-2xl mb-4 text-center">🔑 Password Reset Successful</Heading>

              {/* Main Content */}
              <Text className="text-muted-foreground mb-4 text-center">Hi {firstName},</Text>

              <Text className="text-muted-foreground mb-6 text-center">
                Your password has been successfully reset. You can now sign in to your account with your new password.
              </Text>

              {/* Footer */}
              <Text className="text-sm text-muted-foreground mt-8 text-center">
                If you did not reset your password, please contact our support team immediately.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

PasswordResetConfirmation.PreviewProps = {
  firstName: 'Matthew',
} as ResetPasswordEmailProps;

export default PasswordResetConfirmation;

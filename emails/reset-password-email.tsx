import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
  Button,
  Section,
} from '@react-email/components';
import tailwindConfig from './email.tailwind.config';

interface ResetPasswordEmailProps {
  otp: string;
  verifyUrl: string;
}

const ResetPasswordEmail = ({ otp, verifyUrl }: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans">
          <Preview>Verify your email address to get started</Preview>

          <Container className="mx-auto py-20 px-2">
            <Section className="p-8" style={{ boxShadow: '0 0 0 1px #e2e8f0', borderRadius: '6px' }}>
              {/* Logo/Header Section */}
              <Heading className="text-2xl mb-4 text-center">Reset your password</Heading>

              {/* Main Content */}
              <Text className="text-muted-foreground mb-6 text-center">
                You are receiving this email because you requested a password reset. You can either:
              </Text>

              {/* Primary CTA Button */}
              <Section className="text-center mb-8">
                <Text className="text-muted-foreground mb-4">
                  1. Click the button below if you&apos;re on the same device:
                </Text>
                <Button
                  href={verifyUrl}
                  className="bg-primary text-primary-foreground font-medium rounded-md px-6 py-3"
                >
                  Reset Password
                </Button>
              </Section>

              {/* Verification Code Section */}
              <Section className="text-center">
                <Text className="text-muted-foreground mb-2">
                  2. Or enter this verification code on the reset page:
                </Text>
                <Text
                  className="text-2xl text-foreground font-medium inline-block px-4 py-2"
                  style={{
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                  }}
                >
                  {otp}
                </Text>
              </Section>

              {/* Footer */}
              <Text className="text-sm text-muted-foreground mt-8 text-center">
                If you didn&apos;t request this password reset, you can safely ignore it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ResetPasswordEmail.PreviewProps = {
  otp: '1RDPK4',
  verifyUrl: 'http://localhost:3000/verify?type=sign-up&target=matt.millard@gmail.com&code=1RDPK4',
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;

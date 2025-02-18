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

interface VerifyEmailProps {
  otp: string;
  verifyUrl: string;
}

const VerifyEmail = ({ otp, verifyUrl }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Tailwind config={tailwindConfig}>
        <Body className="bg-white font-sans">
          <Preview>Verify your email address to get started</Preview>

          <Container className="mx-auto py-20 px-2">
            <Section className="p-8" style={{ boxShadow: '0 0 0 1px #e2e8f0', borderRadius: '6px' }}>
              {/* Logo/Header Section */}
              <Heading className="text-2xl mb-4 text-center">Welcome to Notely! 👋</Heading>

              {/* Main Content */}
              <Text className="text-muted-foreground mb-6 text-center">
                Thanks for signing up. Please verify your email address by clicking the button below or using the
                verification code.
              </Text>

              {/* Primary CTA Button */}
              <Section className="text-center mb-8">
                <Button
                  href={verifyUrl}
                  className="bg-primary text-primary-foreground font-medium rounded-md px-6 py-3"
                >
                  Verify Email Address
                </Button>
              </Section>

              {/* Verification Code Section */}
              <Section className="text-center">
                <Text className="text-muted-foreground mb-2">Or enter this verification code:</Text>
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
                If you didn&apos;t request this email, you can safely ignore it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

VerifyEmail.PreviewProps = {
  otp: '1RDPK4',
  verifyUrl: 'http://localhost:3000/verify?type=sign-up&target=matt.millard@gmail.com&code=1RDPK4',
} as VerifyEmailProps;

export default VerifyEmail;

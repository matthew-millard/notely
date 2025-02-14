import { Body, Container, Head, Heading, Html, Link, Preview, Tailwind, Text } from '@react-email/components';
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
        <Body className="bg-background">
          <Preview>Verify email with this magic link</Preview>
          <Container>
            <Heading className="text-primary">Verify email</Heading>
            <Text>{otp}</Text>
            <Link href={verifyUrl}>Click the magic link to verify your email</Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;

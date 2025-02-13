import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components';

interface VerifyEmailProps {
  otp: string;
  verifyUrl: string;
  title: string;
  description: string;
}

export default function VerifyEmail({ otp, verifyUrl, title, description }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email with this magic link</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Link
            href={verifyUrl}
            target="_blank"
            style={{
              ...link,
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Verify your email address with this magic link
          </Link>
          <Text style={{ ...text, marginBottom: '14px' }}>Or, copy and paste this temporary one-time passcode:</Text>
          <code style={code}>{otp}</code>
          <Text
            style={{
              ...text,
              color: '#3a3d4a',
              marginTop: '12px',
              marginBottom: '38px',
            }}
          >
            (This verification link will expire in 15 minutes.)
          </Text>
          <Text
            style={{
              ...text,
              color: '#3a3d4a',
              marginTop: '14px',
              marginBottom: '16px',
            }}
          >
            {description}
          </Text>

          <h2 style={h2}>Notely</h2>
          <Text style={footer}>
            <Link href="https://notely.ca" target="_blank" style={{ ...link, color: 'blue' }}>
              Notely
            </Link>
            , your cloud-based digital notebook that keeps your notes safe, secure, and at your fingertips—completely
            free. Proudly 🇨🇦.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
};

const h1 = {
  color: '#000',
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const h2 = {
  color: '#000',
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji",
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const link = {
  color: 'blue',
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji",
  fontSize: '14px',
  textDecoration: 'underline',
};

const text = {
  color: '#000',
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji",
  fontSize: '14px',
  margin: '24px 0',
};

const footer = {
  color: '#898989',
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji",
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};

const code = {
  display: 'inline-block',
  padding: '16px 4.5%',
  width: '90.5%',
  backgroundColor: '#f4f4f4',
  borderRadius: '5px',
  border: '1px solid #eee',
  color: '#000',
};

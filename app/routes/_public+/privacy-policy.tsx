import { H1, H2, ListItem, P, UnorderedList } from '~/components/typography';

export default function PrivacyPolicyRoute() {
  return (
    <div className="container max-w-4xl my-6 space-y-12">
      <H1>Privacy Policy</H1>

      <section>
        <H2>1. Information I Collect</H2>
        <P>When you use Notely, I collect:</P>
        <UnorderedList>
          <ListItem>
            For standard email/password registration: Your name, email address, and securely hashed password
          </ListItem>
          <ListItem>
            For Facebook authentication: Your public profile information from Facebook, including name, email address,
            and Facebook ID
          </ListItem>
          <ListItem>
            For Google authentication: Your basic profile information from Google, including name, email address, and
            Google ID
          </ListItem>
          <ListItem>Usage data and interaction with our services</ListItem>
        </UnorderedList>
      </section>

      <section>
        <H2>2. How I Use Your Information</H2>
        <P>I use the collected information to:</P>
        <UnorderedList>
          <ListItem>Authenticate your identity when you log in to your account</ListItem>
          <ListItem>Store and manage your personal notes</ListItem>
          <ListItem>Maintain the security of your account</ListItem>
        </UnorderedList>
      </section>

      <section>
        <H2>3. Third-Party Authentication</H2>
        <P>When you choose to log in using third-party services (Facebook or Google):</P>
        <UnorderedList>
          <ListItem>I only request necessary permissions to authenticate you and create/access your account</ListItem>
          <ListItem>
            I do not post to your social media accounts or access additional information beyond what is required for
            authentication
          </ListItem>
          <ListItem>
            Your use of these third-party services is subject to their respective privacy policies and terms of service
          </ListItem>
        </UnorderedList>
      </section>

      <section>
        <H2>4. Data Security</H2>
        <P>I implement appropriate security measures to protect your personal information, including:</P>
        <UnorderedList>
          <ListItem>Encryption of sensitive data in transit and at rest</ListItem>
          <ListItem>Secure password hashing for standard authentication</ListItem>
          <ListItem>However, please note that no method of transmission over the internet is 100% secure</ListItem>
        </UnorderedList>
      </section>

      <section id="data-deletion">
        <H2>5. Data Deletion</H2>
        <P>How to delete your personal data:</P>
        <UnorderedList>
          <ListItem>
            By deleting your account through the edit profile in the application, which will automatically remove all
            your personal data and notes
          </ListItem>
        </UnorderedList>
      </section>

      <section>
        <H2>6. Contact Me</H2>
        <P>
          If you have any questions about this Privacy Policy or how I handle your authentication data, please contact
          me:{' '}
          <a href="mailto:matt@notely.ca" className="text-primary underline">
            matt@notely.ca
          </a>
        </P>
      </section>
    </div>
  );
}

export const meta = () => {
  const siteName = 'Notely';
  const pageName = 'Privacy Policy';
  const author = 'Matt Millard';
  const description =
    "Learn about Notely's privacy policy, how your information is collected, used, and how to delete your data.";
  const ogImage =
    'https://res.cloudinary.com/hospohub/image/upload/v1743782436/screen_shot_1024x1024_icon-1_iiipmf.png';
  const ogAltText = 'Notley logo.';

  return [
    // Basic Metadata
    {
      title: `${pageName} | ${siteName}`,
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'author',
      content: author,
    },

    // Open Graph Metadata
    {
      name: 'og:title',
      content: `${pageName} | ${siteName}`,
    },
    {
      name: 'og:description',
      content: description,
    },
    {
      name: 'og:image',
      content: ogImage,
    },
    {
      name: 'og:image:alt',
      content: ogAltText,
    },
    {
      name: 'og:site_name',
      content: siteName,
    },
    {
      name: 'og:type',
      content: 'website',
    },
  ];
};

export default function PrivacyPolicyRoute() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
        <p className="mb-3">When you use Notely, we collect:</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Information you provide during account creation (name, email)</li>
          <li>Information from Facebook when you choose to login with Facebook</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
        <p className="mb-3">We use the collected information to:</p>
        <ul className="list-disc ml-6 mb-3">
          <li>Provide and maintain our service</li>
          <li>Authenticate your identity</li>
          <li>Communicate with you about your account</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. However, no method of
          transmission over the internet is 100% secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:{' '}
          <a href="mailto:your-email@example.com" className="text-blue-600 hover:underline">
            your-email@example.com
          </a>
        </p>
      </section>
    </div>
  );
}

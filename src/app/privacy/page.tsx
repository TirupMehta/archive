import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Archive handles your data — simple, transparent, and secure.',
};

export default function PrivacyPage() {
  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      backgroundColor: '#171717',
      color: '#ededed',
      fontFamily: 'Inter, -apple-system, sans-serif',
    }}>
      {/* Nav */}
      <nav style={{
        padding: '20px 40px',
        borderBottom: '1px solid #262626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ color: '#ededed', textDecoration: 'none', fontWeight: 600, fontSize: '16px' }}>
          Archive
        </Link>
        <Link href="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to editor
        </Link>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 40px 120px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#71717a', fontSize: '14px', marginBottom: '48px' }}>
          Last updated: May 2025
        </p>

        <Section title="The short version">
          <p>
            Archive stores your writing securely in Google Firestore, protected by Firebase Authentication.
            Only you can read or write your own data. We don&apos;t sell your data, we don&apos;t read your documents,
            and we don&apos;t share anything with third parties.
          </p>
        </Section>

        <Section title="What we collect">
          <p>When you sign in with Google, we receive:</p>
          <ul>
            <li>Your Google account email address</li>
            <li>Your display name</li>
            <li>A unique user ID from Google</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            This is used solely to identify your account and store your projects under your own user ID.
            We don&apos;t collect passwords — authentication is handled entirely by Google.
          </p>
        </Section>

        <Section title="Your writing data">
          <p>
            Everything you write is stored in Cloud Firestore under your unique user ID. The Firestore
            security rules enforce that <strong>only your authenticated account</strong> can access your documents —
            no one else, including us.
          </p>
          <p style={{ marginTop: '12px' }}>
            If you use Archive without signing in, your writing is stored locally in your browser
            (<code style={{ backgroundColor: 'rgba(255,255,255,0.07)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>localStorage</code>)
            and never sent to any server.
          </p>
        </Section>

        <Section title="AI formatting">
          <p>
            When you use the AI format button, your document text is sent to Google&apos;s Gemini API via
            Firebase AI SDK to generate formatting suggestions. This is processed by Google and subject to
            their standard API data handling policies. We don&apos;t store or log the content sent to Gemini.
          </p>
        </Section>

        <Section title="Data security">
          <ul>
            <li>All data in transit is encrypted via HTTPS/TLS</li>
            <li>Firestore security rules prevent any cross-user data access</li>
            <li>Firebase Authentication handles all login flows — we never see your password</li>
            <li>Your data is stored in Google Cloud infrastructure</li>
          </ul>
        </Section>

        <Section title="Data deletion">
          <p>
            You can delete your account and all associated data at any time by contacting us at{' '}
            <a href="mailto:contact@tirup.in" style={{ color: '#ededed' }}>contact@tirup.in</a>.
            We will permanently delete your Firestore documents within 7 days of the request.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>Archive uses the following services:</p>
          <ul>
            <li><strong>Firebase / Google Cloud</strong> — Authentication and database</li>
            <li><strong>Gemini API</strong> — AI text formatting</li>
            <li><strong>Vercel</strong> — Hosting and CDN</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            Each service is governed by their own privacy policies. We only use them in ways necessary
            to provide Archive&apos;s core functionality.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email{' '}
            <a href="mailto:contact@tirup.in" style={{ color: '#ededed' }}>contact@tirup.in</a>.
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '40px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#ededed' }}>
        {title}
      </h2>
      <div style={{ color: '#a1a1aa', lineHeight: '1.75', fontSize: '15px' }}>
        {children}
      </div>
    </section>
  );
}

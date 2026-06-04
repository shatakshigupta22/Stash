export const metadata = {
  title: "Privacy Policy – Stash",
}

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: June 3, 2026</p>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">What is Stash?</h2>
        <p>
          Stash is a personal video library that lets you browse, organize, and
          categorize your YouTube liked videos in one place.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">Information we collect</h2>
        <p className="mb-3">When you sign in with Google, we receive:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Your name and email address</li>
          <li>Your Google profile picture</li>
          <li>A read-only access token to fetch your YouTube liked videos</li>
        </ul>
        <p className="mt-3">
          We only request <strong>read-only</strong> access to YouTube data. We
          never modify, delete, or post anything on your behalf.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">How we use your information</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>To identify your account and display your profile</li>
          <li>To import and display your YouTube liked videos</li>
          <li>To save your categories, notes, and watch-later preferences</li>
        </ul>
        <p className="mt-3">
          We do not sell, share, or use your data for advertising.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">Data storage</h2>
        <p>
          Your data is stored in a secure PostgreSQL database hosted by{" "}
          <a
            href="https://neon.tech"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Neon
          </a>
          . We retain your data as long as your account is active. You can
          request deletion at any time by contacting us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">Third-party services</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>
            <strong>Google / YouTube API</strong> — used for authentication and
            fetching liked videos. Governed by{" "}
            <a
              href="https://policies.google.com/privacy"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Neon</strong> — database hosting.
          </li>
          <li>
            <strong>Vercel</strong> — application hosting.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data at any time by emailing us at{" "}
          <a href="mailto:shatakshimgupta@gmail.com" className="underline">
            shatakshimgupta@gmail.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-base mb-2">Contact</h2>
        <p>
          Questions? Reach out at{" "}
          <a href="mailto:shatakshimgupta@gmail.com" className="underline">
            shatakshimgupta@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}

export const metadata = {
  title: "Terms of Service – Stash",
}

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-2">Terms of Service</h1>
      <p className="text-gray-500 mb-8">Last updated: June 3, 2026</p>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">1. Acceptance of terms</h2>
        <p>
          By using Stash, you agree to these Terms of Service. If you do not
          agree, please do not use the app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">2. What Stash does</h2>
        <p>
          Stash is a personal video library that imports your YouTube liked
          videos and lets you organize them with categories and notes. It only
          reads your YouTube data — it never posts, deletes, or modifies anything
          on your behalf.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">3. Your account</h2>
        <p>
          You sign in using your Google account. You are responsible for
          maintaining the security of your account. We are not liable for any
          loss resulting from unauthorized access.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">4. Acceptable use</h2>
        <p className="mb-3">You agree not to:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Use Stash for any unlawful purpose</li>
          <li>Attempt to reverse-engineer or exploit the service</li>
          <li>Interfere with or disrupt the service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">5. Data and privacy</h2>
        <p>
          Your use of Stash is also governed by our{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">6. Disclaimer</h2>
        <p>
          Stash is provided &quot;as is&quot; without warranties of any kind. We do not
          guarantee uninterrupted or error-free service and are not liable for
          any damages arising from your use of the app.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-base mb-2">7. Changes to these terms</h2>
        <p>
          We may update these terms at any time. Continued use of Stash after
          changes means you accept the updated terms.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-base mb-2">8. Contact</h2>
        <p>
          Questions? Email us at{" "}
          <a href="mailto:shatakshimgupta@gmail.com" className="underline">
            shatakshimgupta@gmail.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}

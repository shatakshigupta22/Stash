import Link from "next/link"
import StashLogo from "@/app/components/StashLogo"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center max-w-lg px-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <StashLogo className="w-10 h-10 text-gray-900" />
          <h1 className="text-5xl font-semibold text-gray-900">Stash</h1>
        </div>
        <p className="text-xl text-gray-500 mb-10">
          Your YouTube library, finally organized.
        </p>
        <Link
          href="/api/auth/signin"
          className="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-700 transition"
        >
          Sign in with Google
        </Link>
      </div>
    </main>
  )
}
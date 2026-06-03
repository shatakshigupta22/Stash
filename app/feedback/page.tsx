import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import ThemeToggle from "@/app/components/ThemeToggle"
import Image from "next/image"
import FeedbackForm from "./FeedbackForm"

export default async function FeedbackPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/")

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <header className="sticky top-0 z-10 border-b border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight text-gray-900 dark:text-neutral-100 hover:opacity-70 transition-opacity">
            stash
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-neutral-500 hidden sm:block">{session.user.email}</span>
          {session.user.image && (
            <Image src={session.user.image} alt={session.user.name ?? "Profile"} width={24} height={24} className="rounded-full" />
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">Feedback</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">Report a bug, request a feature, or just say hi.</p>
        </div>
        <FeedbackForm />
      </main>
    </div>
  )
}

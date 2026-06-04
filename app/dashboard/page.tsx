import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import VideoGrid from "./VideoGrid"
import ThemeToggle from "@/app/components/ThemeToggle"
import StashLogo from "@/app/components/StashLogo"
import Image from "next/image"
import Link from "next/link"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { videos: { orderBy: { likedAt: "desc" } } },
  })

  const videos = user?.videos ?? []

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors">
      <header className="sticky top-0 z-10 border-b border-gray-100 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900 dark:text-neutral-100">
          <StashLogo className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-tight">stash</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/feedback" className="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors hidden sm:block">
            Feedback
          </Link>
          <span className="text-xs text-gray-400 dark:text-neutral-500 hidden sm:block">{session.user.email}</span>
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "Profile"}
              width={24}
              height={24}
              className="rounded-full"
            />
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100">Library</h1>
          <p className="text-sm text-gray-400 dark:text-neutral-500 mt-1">{videos.length} saved videos</p>
        </div>
        <VideoGrid videos={videos} />
      </main>
    </div>
  )
}

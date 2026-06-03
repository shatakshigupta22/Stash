import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorizeVideos } from "@/lib/categorize"

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  // Reset all videos to Uncategorized
  await prisma.video.updateMany({
    where: { userId: user.id },
    data: { category: "Uncategorized" },
  })

  const videos = await prisma.video.findMany({
    where: { userId: user.id },
    select: { youtubeId: true, title: true, channel: true },
  })

  const BATCH = 50
  const errors: string[] = []

  for (let i = 0; i < videos.length; i += BATCH) {
    const batch = videos.slice(i, i + BATCH)
    const { map, error } = await categorizeVideos(batch)

    if (error) errors.push(error)

    for (const [youtubeId, category] of Object.entries(map)) {
      await prisma.video.updateMany({
        where: { youtubeId, userId: user.id },
        data: { category },
      })
    }
  }

  return NextResponse.json({
    count: videos.length,
    ...(errors.length > 0 && { categorizationError: errors[0] }),
  })
}

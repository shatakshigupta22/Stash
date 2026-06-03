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

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: { where: { provider: "google" } } },
  })

  const accessToken = user?.accounts?.[0]?.access_token ?? user?.accessToken

  if (!user || !accessToken) {
    return NextResponse.json({ error: "No access token" }, { status: 401 })
  }

  const videos: { youtubeId: string; title: string; channel: string; thumbnail: string; userId: string; likedAt: Date }[] = []
  let nextPageToken = ""

  do {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&myRating=like&maxResults=50&pageToken=${nextPageToken}&access_token=${accessToken}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.items) {
      for (const item of data.items) {
        videos.push({
          youtubeId: item.id,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.medium?.url || "",
          userId: user.id,
          likedAt: new Date(item.snippet.publishedAt),
        })
      }
    }

    nextPageToken = data.nextPageToken || ""
  } while (nextPageToken)

  // Upsert all videos, preserving existing categories
  for (const video of videos) {
    await prisma.video.upsert({
      where: { youtubeId_userId: { youtubeId: video.youtubeId, userId: user.id } },
      update: { likedAt: video.likedAt },
      create: video,
    })
  }

  // Categorize only videos that are still "Uncategorized"
  const uncategorized = await prisma.video.findMany({
    where: { userId: user.id, category: "Uncategorized" },
    select: { youtubeId: true, title: true, channel: true },
  })

  // Process in batches of 50 to stay within Groq token limits
  const BATCH = 50
  const categorizationErrors: string[] = []

  for (let i = 0; i < uncategorized.length; i += BATCH) {
    const batch = uncategorized.slice(i, i + BATCH)
    const { map, error } = await categorizeVideos(batch)

    if (error) categorizationErrors.push(error)

    for (const [youtubeId, category] of Object.entries(map)) {
      await prisma.video.updateMany({
        where: { youtubeId, userId: user.id },
        data: { category },
      })
    }
  }

  return NextResponse.json({
    count: videos.length,
    ...(categorizationErrors.length > 0 && { categorizationError: categorizationErrors[0] }),
  })
}

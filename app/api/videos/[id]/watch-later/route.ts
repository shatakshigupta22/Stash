import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params

  const video = await prisma.video.findFirst({
    where: { id, user: { email: session.user.email } },
  })

  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.video.update({
    where: { id },
    data: { watchLater: !video.watchLater },
  })

  return NextResponse.json({ watchLater: updated.watchLater })
}

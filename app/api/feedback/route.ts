import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const TYPE_LABELS: Record<string, string> = {
  general: "General feedback",
  bug: "Bug report",
  feature: "Feature request",
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { message, type } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  await prisma.feedback.create({
    data: {
      message: message.trim(),
      type: type ?? "general",
      userId: user.id,
    },
  })

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const typeLabel = TYPE_LABELS[type] ?? "Feedback"
    await resend.emails.send({
      from: "Stash <onboarding@resend.dev>",
      to: "shatakshimgupta@gmail.com",
      subject: `[Stash] ${typeLabel} from ${session.user.email}`,
      html: `
        <p><strong>From:</strong> ${session.user.name ?? "Unknown"} (${session.user.email})</p>
        <p><strong>Type:</strong> ${typeLabel}</p>
        <hr />
        <p>${message.trim().replace(/\n/g, "<br/>")}</p>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}

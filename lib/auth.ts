import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database" as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.access_token && user?.id) {
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { accessToken: account.access_token },
          })
        } catch (e) {
          console.error("Failed to save access token:", e)
        }
      }
      return true
    },
    async session({ session, user }: any) {
      session.user.id = user.id
      session.user.accessToken = user.accessToken
      return session
    },
    async redirect({ baseUrl }: { url: string; baseUrl: string }) {
      return baseUrl + "/dashboard"
    },
  },
}

import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        const streamLabsToken = await prisma.streamLabsToken.findUnique({
          where: {
            userId: session.user.id,
          },
        });

        session.user.streamLabsToken = streamLabsToken;

        const time = await prisma.user.findFirst({
          where: {
            id: user.id,
          },
          select: {
            time: true,
            timeState: true,
            timerSettings: true,
          },
        });

        session.user.timerSettings = time?.timerSettings;
        session.user.time = time?.time;
        session.user.timeState = time?.timeState;
      }
      return session;
    },
    async redirect() {
      return "/me";
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);

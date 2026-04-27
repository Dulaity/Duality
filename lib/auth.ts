import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { signInRequestSchema } from "@/lib/validations/auth";

export function getEnabledSocialProviders() {
  return [
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? { id: "google", name: "Google" }
      : null,
    process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
      ? { id: "azure-ad", name: "Microsoft" }
      : null,
  ].filter((provider): provider is { id: string; name: string } => Boolean(provider));
}

const providers = [
  CredentialsProvider({
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = signInRequestSchema.safeParse(credentials);

      if (!parsed.success) {
        return null;
      }

      const email = parsed.data.email.trim().toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.passwordHash || !user.email) {
        return null;
      }

      const isValidPassword = await verifyPassword(
        parsed.data.password,
        user.passwordHash,
      );

      if (!isValidPassword) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      };
    },
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
  ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
    ? [
        AzureADProvider({
          clientId: process.env.AZURE_AD_CLIENT_ID,
          clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
          tenantId: process.env.AZURE_AD_TENANT_ID || undefined,
        }),
      ]
    : []),
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async jwt({ token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
          select: {
            role: true,
          },
        });

        token.role = user?.role ?? "CUSTOMER";
      }

      return token;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const emailVerified =
          typeof profile === "object" &&
          profile &&
          "email_verified" in profile &&
          profile.email_verified;

        return Boolean(emailVerified);
      }

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "CUSTOMER";
      }

      return session;
    },
  },
};

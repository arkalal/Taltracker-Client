import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./lib/mongodb";
import User from "./models/User";
import bcrypt from "bcryptjs";
import { authorizeUser } from "./server/auth-actions";

// Add debug logs to help troubleshoot issues
console.log("Auth setup starting...");
console.log("AUTH_SECRET exists:", !!process.env.AUTH_SECRET);

// Check for required environment variables
if (!process.env.AUTH_SECRET) {
  throw new Error("Please provide AUTH_SECRET env variable.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.DEBUG === "true", // Enable debug mode based on env var
  trustHost: true, // Trust the host header for callbacks
  providers: [
    CredentialsProvider({
      id: "company-login",
      name: "Company Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call the server-side authorize function
        return await authorizeUser(credentials);
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.companyName = user.companyName;
        token.role = user.role;
        token.isCompanyAccount = user.isCompanyAccount;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.companyName = token.companyName;
        session.user.role = token.role;
        session.user.isCompanyAccount = token.isCompanyAccount;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

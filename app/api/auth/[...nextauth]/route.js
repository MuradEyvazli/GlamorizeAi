import { connectDB } from "@/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import User from "@/models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your-email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        
        try {
          await connectDB();
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found with this email");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            throw new Error("Password does not match");
          }
          
          return user;
        } catch (error) {
          throw new Error(`Authorization failed: ${error.message}`);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id; // Set user ID in the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id; // Set ID in token on login
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

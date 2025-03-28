// app/api/auth/[...nextauth]/route.js

import connectDB from '@/lib/db';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from "@/models/user";

export const authOptions = {
  providers: [
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
          // Update last login time
          user.lastLogin = new Date();
          await user.save();
          
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image
          };
        } catch (error) {
          throw new Error(`Authorization failed: ${error.message}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        
        // Enrich session with additional user data from database
        try {
          await connectDB();
          const dbUser = await User.findById(token.id);
          
          if (dbUser) {
            session.user.balance = dbUser.balance;
            session.user.subscriptionStatus = dbUser.subscriptionStatus;
            session.user.remainingRequests = dbUser.remainingRequests;
            session.user.image = dbUser.image;
          }
        } catch (error) {
          console.error("Error enriching session with user data:", error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/",
    error: "/",  // Error page if authentication fails
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
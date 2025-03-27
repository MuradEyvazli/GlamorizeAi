// app/api/auth/[...nextauth]/route.js

import connectDB from '@/lib/db';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from 'bcryptjs';
import User from "@/models/user";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
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
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        console.log("Google sign in detected: ",profile.email);
        try {
          await connectDB();
          
          // Check if user already exists
          const existingUser = await User.findOne({ email: profile.email });
          
          if (existingUser) {
            // Update last login time
            existingUser.lastLogin = new Date();
            await existingUser.save();
            
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
            return true;
          } else {
            // Create new user with Google info
            const newUser = await User.create({
              name: profile.name,
              email: profile.email,
              // Create a random secure password since Google users don't need one
              password: await bcrypt.hash(Math.random().toString(36).slice(-8) + Date.now().toString(), 10),
              image: profile.picture || '/default-avatar.png',
              lastLogin: new Date()
            });
            
            user.id = newUser._id.toString();
            user.role = newUser.role;
            return true;
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        
        // If it's a Google login, we need to enhance the token with our database user data
        if (account?.provider === 'google') {
          try {
            await connectDB();
            const dbUser = await User.findOne({ email: profile.email });
            if (dbUser) {
              token.id = dbUser._id.toString();
              token.role = dbUser.role;
              token.subscriptionStatus = dbUser.subscriptionStatus;
              token.balance = dbUser.balance;
              token.remainingRequests = dbUser.remainingRequests;
            }
          } catch (error) {
            console.error("Error fetching user data for token:", error);
          }
        }
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
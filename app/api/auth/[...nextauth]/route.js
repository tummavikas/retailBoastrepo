import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Admin from "@/models/admin";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { email, password } = credentials;
        const isAdmin = email.endsWith('@admin.com');
        try {
          await connectMongoDB();
          let user;
          if(isAdmin){
            user = await Admin.findOne({ email });
          }
          else{
            user = await User.findOne({ email });
          }

          if (!user) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            return null;
          }

          const userData = {
            id: user._id,
            userId: user.userId || user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
          
          if (isAdmin) {
            userData.adminId = user.adminId;
          }
          
          return userData;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.userId;
        if (user.adminId) {
          token.adminId = user.adminId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.userId = token.userId;
        if (token.adminId) {
          session.user.adminId = token.adminId;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

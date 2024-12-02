import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Handle redirection after a successful login
    async redirect({ url, baseUrl }) {
      console.log("Redirecting to:", url);
      // return url.startsWith(baseUrl) ? url : baseUrl;
      return `${baseUrl}/dashboard`;
    },
    // Optional: Log user data on sign-in
    async signIn({ user, account, profile }) {
      console.log("Sign-in details:", { user, account, profile });
      return true; // Allow sign-in
    },
  },
  // Optional: Define the default pages
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);

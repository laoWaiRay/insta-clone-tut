import NextAuth from "next-auth/next";
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Phone number, username, or email",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Phone number, username, or email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.dir(credentials)
        const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
        // const user = null;

        if (user) {
          return user
        } else {
          return null
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
   
  ],
  pages: {
    signIn: '/auth/signin'
  },
  // session: {
  //   strategy: "jwt"
  // },
  // jwt: {
  //   maxAge: 60 * 60 * 24 * 30,
  // }
}

export default NextAuth(authOptions)
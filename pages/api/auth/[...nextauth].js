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
        let user = { id: 1, name: "J Smith", email: "jsmith@example.com" }
        // const res = await fetch('/api/auth/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(credentials),
        // });

        // const json = await res.json();
        // console.log('JSON: ', json)

        
        if (req.query.username != 'user')
          user = null;

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
  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;
      console.log('Token: ', token)
      return session;
    }
  }
  // session: {
  //   strategy: "jwt"
  // },
  // jwt: {
  //   maxAge: 60 * 60 * 24 * 30,
  // }
}

export default NextAuth(authOptions)
import NextAuth from "next-auth/next";
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref } from "firebase/storage";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Phone number, username, or email",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Phone number, username, or email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
          let user = null
          const username = credentials.username
          const password = credentials.password
          const querySnapshot = await getDocs(query(collection(db, 'users'), 
            where("username", "==", username), 
            where("password", "==", password)))
          
          if(querySnapshot.size === 1)
          {
            user = {
              id: querySnapshot.docs[0].id,
              name: querySnapshot.docs[0].data().username,
              image: querySnapshot.docs[0].data().image
            }
          }


          if (user) {
            return user
          } else {
            throw new Error('Incorrect username or password')
          }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
   
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async session({ session, token }) {
      console.log("SESSION: ", session)
      console.log("TOKEN: ", token)

      session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLocaleLowerCase();

      session.user.uid = token.sub;

      const querySnapshot = await getDocs(query(collection(db, 'users'), 
        where("username", "==", session.user.name)))

      if (querySnapshot.size === 0)
      {
        const imageRef = ref(storage, 'default_avatar.jpg')
        const downloadURL = await getDownloadURL(imageRef);

        addDoc(collection(db, 'users'), {
          username: session.user.name,
          image: session.user.image
        })
      }

      return session;
    }
  },
}

export default NextAuth(authOptions)
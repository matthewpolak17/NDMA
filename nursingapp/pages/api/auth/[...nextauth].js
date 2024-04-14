import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";


const prisma = new PrismaClient();

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,

    providers: [
        CredentialsProvider({
            //the name to display on the sign in form
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            
            //runs the info through the database
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                //finds it and returns a user or not
                if (user && bcrypt.compareSync(credentials.password, user.password_hash)) {
                    return { // adjust according to schema
                        id: user.id, 
                        name: user.username, 
                        email: '', 
                        role: user.role 
                    }; 
                } else {
                    throw new Error('Invalid username or password');
                }
            }
        })
    ],

    callbacks: {
        async jwt(token, user) {
          // user parameter is the user object returned from the authorize method
          // token parameter is the previous contents of the JWT
          if (user) {
            token.id = user.id;
            token.name = user.name;
            token.email = user.email;
            token.role = user.role; 
          }
          return token;
        },
        async session(session, token) {
          // token parameter is the contents of the JWT
          // session parameter is the current session object
          session.user = token;  // Assign the user's info from the JWT to the session
          return session;
        }
      },

      session: {
        jwt: true,
      },

    database: process.env.DATABASE_URL,
})
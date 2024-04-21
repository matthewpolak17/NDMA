import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";


const prisma = new PrismaClient();

export const authOptions = {
    //secret
    secret: process.env.NEXTAUTH_SECRET,
    //providers
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
                        email: user.email, 
                        role: user.role,
                        first_name: user.first_name,
                        last_name: user.last_name,
                    };
                } else {
                    throw new Error('Invalid username or password');
                }
            }
        })
    ],
    //callbacks
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = user.role;
                token.email = user.email;
                token.first_name = user.first_name;
                token.last_name = user.last_name;
            }
            return token;
        },
        async session({ session, token }) {
            session.userId = token.id;
            session.user.name = token.name;
            session.user.role = token.role;
            session.user.email = token.email;
            session.user.first_name = token.first_name;
            session.user.last_name = token.last_name;
            return session;
        }
        },
    //database
    database: process.env.DATABASE_URL,
    session: {
        jwt: true, // Use JWT for session instead of database sessions
      },
}

export default NextAuth(authOptions);
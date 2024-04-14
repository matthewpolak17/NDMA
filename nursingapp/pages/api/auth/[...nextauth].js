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
                        email: '', 
                        role: user.role,
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
            }
            return token;
        },
        async session({ session, token }) {
            session.user.name = token.name;
            session.user.role = token.role;
            return session;
        }
        },
    //database
    database: process.env.DATABASE_URL,
}

export default NextAuth(authOptions);
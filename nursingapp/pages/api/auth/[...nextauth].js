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
                    return { id: user.id, name: user.username, email: '', role: user.role }; // adjust according to schema
                } else {
                    throw new Error('Invalid username or password');
                }
            }
        })
    ],
    database: process.env.DATABASE_URL,
})
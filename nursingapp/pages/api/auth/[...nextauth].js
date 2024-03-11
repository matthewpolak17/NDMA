import NextAuth from 'next-auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import CredentialsProvider from "next-auth/providers/credentials";


const prisma = new PrismaClient();

export default NextAuth({
    providers: [
        CredentialsProvider({
            //the name to display on the sign in form
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (user && bcrypt.compareSync(credentials.password, user.password_hash)) {
                    return { id: user.id, name: user.username, email: '' }; // Adjust according to your schema
                } else {
                    throw new Error('Invalid username or password');
                }
            }
        })
    ],
    database: process.env.DATABASE_URL,
})
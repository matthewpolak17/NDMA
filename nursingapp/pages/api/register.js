import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

//package to simplify database transactions
const prisma = new PrismaClient();

export default async function handler(req, res) {

    if (req.method === 'POST') {
        //gather user info
        const { username, password, email, first_name, last_name } = req.body;
        const passwordHash = bcrypt.hashSync(password, 10);
        
        //user creation process
        try {
            const newUser = await prisma.user.create({
                data: {
                    username,
                    password_hash: passwordHash,
                    email,
                    first_name: first_name,
                    last_name: last_name,
                },
            });
            res.status(200).json({ message: 'User created successfully', newUser });
        } catch (error) {
            res.status(500).json({ message: 'Error creating user', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
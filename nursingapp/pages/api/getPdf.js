import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const prisma = new PrismaClient();
        const userIdString = req.headers['authorization'];
        const userId = parseInt(userIdString, 10);
        
        try {
            const retrievePdf = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    pdf: true,
                }
            });
            res.status(200).json({ pdf: retrievePdf.pdf });
            console.log("PDF retrieved successfully");
        } catch (error) {
            console.error('Failed to find PDF:', error);
            res.status(500).json({ message: 'Failed to find PDF' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
    
}





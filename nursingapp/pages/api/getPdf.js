import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const prisma = new PrismaClient();
        const userIdString = req.headers['authorization'];
        const userId = parseInt(userIdString, 10);
        
        try {
            // Query the database for a unique user based on the user ID
            const retrievePdf = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    pdf: true,
                    pdf2: true,
                    pdf3: true,
                    pdf4: true,
                    pdf5: true,
                    pdf6: true,
                    pdf7: true,
                }
            });
            res.status(200).json({ pdfs: retrievePdf });
            console.log("PDF retrieved successfully");
        } catch (error) {
            console.error('Failed to find PDF:', error);
            res.status(500).json({ message: 'Failed to find PDF' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
    
}





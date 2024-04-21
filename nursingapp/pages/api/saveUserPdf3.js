import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const prisma = new PrismaClient();
        const { pdfData } = req.body;  // Receiving the base64 encoded PDF data
        const nPdfData = pdfData.substring(28); // there's a header at the beginning of the data that we don't need, this removes it
        const userIdString = req.headers['authorization'];
        const userId = parseInt(userIdString, 10);
        
        try {
            const updatePDF = await prisma.user.update({
                where: {
                    id: userId,
                },
                data: { 
                    pdf3: nPdfData,
                }
            });
            res.status(200).json({ message: 'PDF saved successfully' });
        } catch (error) {
            console.error('Failed to save PDF:', error);
            res.status(500).json({ message: 'Failed to save PDF' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
    
}





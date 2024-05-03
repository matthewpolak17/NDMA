import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const prisma = new PrismaClient();
        const userIdString = req.headers['authorization'];
        const userId = parseInt(userIdString, 10);
        
        try {
            // Retrieves the user along with specified PDF fields from the database
            const pdfs = await prisma.user.findUnique({
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

            var num = 0;
            pdfs.forEach(pdf => {
                if (pdf != null) {
                    current.append(num, true);
                } else {
                    current.append(num, false);
                }
                num++;
            })
            console.log(current);
            res.status(200).json({ current });
        } catch (error) {
            console.error('Failed to get PDFs:', error);
            res.status(500).json({ message: 'Failed to find PDF' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
    
}





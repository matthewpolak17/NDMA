import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const prisma = new PrismaClient();
  const { userId, docId } = req.body;

  // Document submission
  try {
    const document = await prisma.document.update({
      where: { id: docId },
      data: {
        status: 'completed',
        submittedAt: new Date()
      }
    });

    await prisma.$disconnect();

    res.status(200).json({ success: true, document });
  } catch (error) {
    await prisma.$disconnect();
    res.status(400).json({ success: false, message: error.message });
  }
}

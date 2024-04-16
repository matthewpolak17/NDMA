/*
import nextConnect from 'next-connect';
import multer from 'multer';

// Configure multer to save files in the public/uploads directory
const upload = multer({ dest: 'public/uploads/' });

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
});

//gathers the file
apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
    console.log(req.file); // Logs uploaded file details
    res.status(200).json({ message: 'File uploaded successfully' });
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, // necessary for multer to process file uploads
    },
};
*/
// pages/api/savePdf.js

import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';


export default async function handler(req, res) {
    console.log("saveUserPdf.js handler ran");
    if (req.method === 'POST') {
        const db = new PrismaClient();
        const { pdfData } = req.body;
        const session = await getSession({ req });

        // Assuming you have a users table with a pdf column
        try {
            const updateResponse = await db.user.update({
                where: {
                  id: session.user.id, // Make sure this is the correct identifier for your user model
                },
                data: {
                  pdf: pdfData, // This assumes 'pdf' is the name of the field in your database model
                },
              });
        } catch (error) {
            console.error('Failed to save PDF:', error);
            res.status(500).json({ message: 'Failed to save PDF' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}






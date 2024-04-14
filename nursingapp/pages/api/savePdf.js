// pages/api/savePdf.js
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

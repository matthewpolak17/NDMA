import React, { useState, useEffect } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { getSession } from 'next-auth/react';

const DisplayPdf = ({number}) => {

    const num = parseInt(number);
    const [pdfBase64, setPdfBase64] = useState(null);  // state to store the base64 PDF data

    useEffect(() => {
        retrievePdf();
    }, []);

    const retrievePdf = async () => {
        try {
            const session = await getSession();
            const userId = session.userId;
            const response = await fetch('/api/getPdf', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userId,
                },
                credentials: 'include',
            });
            if (response.ok) {
                const result = await response.json();
                let pdfArray = Object.values(result.pdfs);
                setPdfBase64(pdfArray[num-1]);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error retrieving PDF:', error);
        }
    };

    //displays the information
    return (
        <div>
            {pdfBase64 ? (
                <iframe
                    src={`data:application/pdf;base64,${pdfBase64}`}
                    width="100%"
                    height="600px"
                    style={{ border: 'none' }}
                    title="PDF Content"
                ></iframe>
            ) : (
                <p>No PDF content available.</p>
            )}
        </div>
    );
};

export default DisplayPdf;



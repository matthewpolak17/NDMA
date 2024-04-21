import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { getSession } from 'next-auth/react';
import styles from '../styles/doc1style.module.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfEditor = ({ pdfFileUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [pdfFormFields, setPdfFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState([]);


    // Effect to load PDF from URL and extract form fields
    useEffect(() => {
        if (pdfFileUrl) {
            loadPdfFromFileUrl(pdfFileUrl);
        }
    }, [pdfFileUrl]);

    //loads pdf fom the url provided as a parameter
    const loadPdfFromFileUrl = async (fileUrl) => {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        extractFormFields(pdfDoc);
    };

    //checks for available form fields
    const extractFormFields = (pdfDoc) => {
        const form = pdfDoc.getForm();
        const num = 0;
        const fields = form.getFields();
        const fieldNames = fields.map((field, num) => {
            const name = field.getName();
            let type = field.constructor.name === 'PDFCheckBox' ? 'checkbox' : 'text';
            let id = num++;
            let left = 0;
            let top = 0;
            return { name, type, id, left, top};
        });

        //adds them for later
        setPdfFormFields(fieldNames);
        console.log("Detected fields:", fieldNames);
        setFormData({});
        setFormErrors([]);

        //Styles each input field
        fieldNames.forEach(field => {
            if (field.id == 0) {
                field.top = "50px";
                field.left = "40px";
            }

            const input = document.createElement('input');
            input.type = field.type;
            input.style.position = 'absolute';
            input.style.marginLeft = field.left;
            input.style.marginTop = field.top;

        });
    };

    //changes the form data
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    //processes the information
    const handleSubmit = async () => {
        const errors = pdfFormFields
            .filter(({ name, type }) => type === 'text' && !formData[name])
            .map(({ name }) => name);
        //checks for errors
        if (errors.length > 0) {
            setFormErrors(errors);
            alert('Please fill out all text fields.');
            return;
        }

        const originalPdfBytes = await fetch(pdfFileUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const form = pdfDoc.getForm();

        //goes through each check box or text field entered
        pdfFormFields.forEach(({ name, type }) => {
            const field = form.getField(name);
            if (type === 'checkbox') {
                formData[name] ? field.check() : field.uncheck();
            } else if (type === 'text') {
                field.setText(formData[name]);
            }
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onloadend = function() {
            const base64data = reader.result;
            savePdfToUserProfile(base64data);
        };
        reader.readAsDataURL(blob);
    };

    const savePdfToUserProfile = async (base64data) => {
        try {
            const session = await getSession();
            const userId = session.userId;
            const response = await fetch('/api/saveUserPdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': userId,
                },
                body: JSON.stringify({ pdfData: base64data }),
                credentials: 'include',
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error saving PDF:', error);
        }
    };

    //displays the information
    return (
        <div>
            {pdfFormFields.map(({ name, type }, index) => (
                <div key={index}>
                    <input
                        type={type}
                        name={name}
                        value={type === 'text' ? formData[name] || '' : undefined}
                        checked={type === 'checkbox' ? !!formData[name] : undefined}
                        onChange={handleInputChange}
                        
                    />
                </div>
            ))}
            <button onClick={handleSubmit}>Save to profile</button>

            {formErrors.length > 0 && (
                <div>
                    <p>Please fill out all required fields:</p>
                    <ul>
                        {formErrors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PdfEditor;




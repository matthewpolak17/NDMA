import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Ensure styles for text layers and annotations are imported

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfEditor = () => {
    const [pdfFile, setPdfFile] = useState('');
    const [numPages, setNumPages] = useState(null); // Track the number of pages
    const [pdfFormFields, setPdfFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState([]);

    const onFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdfFile(URL.createObjectURL(file));
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const form = pdfDoc.getForm();
            const fields = form.getFields();
            const fieldNames = fields.map(field => {
                const name = field.getName();
                let type = field.constructor.name === 'PDFCheckBox' ? 'checkbox' : 'text';
                return { name, type };
            });

            setPdfFormFields(fieldNames);
            console.log("Detected fields:", fieldNames);
            setFormData({});
            setFormErrors([]);
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        // Validating text fields only
        const errors = pdfFormFields
            .filter(({ name, type }) => type === 'text' && !formData[name])
            .map(({ name }) => name);

        if (errors.length > 0) {
            setFormErrors(errors);
            alert('Please fill out all text fields.');
            return;
        }

        const originalPdfBytes = await fetch(pdfFile).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const form = pdfDoc.getForm();

        // Handle field filling based on their types
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
        const downloadUrl = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = 'filled-pdf.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Reset form for next use
        setFormErrors([]);
        setFormData({});
        setPdfFormFields([]);
        setPdfFile('');
        setNumPages(null);
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            {pdfFormFields.map(({ name, type }, index) => (
                <div key={index}>
                    <label>{name}: </label>
                    <input
                        type={type}
                        name={name}
                        value={type === 'text' ? formData[name] || '' : undefined}
                        checked={type === 'checkbox' ? !!formData[name] : undefined}
                        onChange={handleInputChange}
                    />
                </div>
            ))}
            <button onClick={handleSubmit}>Submit & Download PDF</button>
            {formErrors.length > 0 && (
                <div>
                    <p>Please fill out all required fields:</p>
                    <ul>
                        {formErrors.map((error, i) => <li key={i}>{error}</li>)}
                    </ul>
                </div>
            )}
            
            {pdfFile && (
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                    ))}
                </Document>
            )}
        </div>
    );
};

export default PdfEditor;


import styles from '../../styles/doc1style.module.css';
import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Doc1Page = () => {

    const pdfURL = "/documents/2022 COVID Care Volunteer Form WKU Feedback.pdf"
    const [pdfFormFields, setPdfFormFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [formErrors, setFormErrors] = useState([]);
    const router = useRouter();


    // Effect to load PDF from URL and extract form fields
    useEffect(() => {
            loadPdfFromFileUrl(pdfURL);
    }, [pdfURL]);

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
            return { name, type, id};
        });

        //adds them for later
        setPdfFormFields(fieldNames);
        console.log("Detected fields:", fieldNames);
        setFormData({});
        setFormErrors([]);
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
    const handleSubmit = async (event) => {

        event.preventDefault();

        const originalPdfBytes = await fetch(pdfURL).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(originalPdfBytes);
        const form = pdfDoc.getForm();
        var incomplete = false;

        //goes through each check box or text field entered
        pdfFormFields.forEach(({ name, type }) => {
            const field = form.getField(name);
            if (type === 'checkbox') {
                formData[name] ? field.check() : field.uncheck();
            } else if (type === 'text') {
                if (formData[name] == undefined || formData[name] == "") {
                    incomplete = true;
                } else {
                    field.setText(formData[name]);
                }
            }
        });
        
        if (incomplete) {
            alert("Please fill out all fields");
            return;
        }

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
            router.push("/view/viewdoc1");
        } catch (error) {
            console.error('Error saving PDF:', error);
        }
    };

    const goBack = () => {
        router.push("/user/user_dashboard");
    }
    
    return (
        <div>
            <div>
                <button onClick={goBack} className={styles.button}>Back</button>
                <div style={{position: "absolute", left: "250px"}}>
                <img src="/docimages/doc1image.jpg" className={styles.docimage}></img>
                    <form>
                        <input 
                            type="checkbox" 
                            className={styles.input1} 
                            onChange={handleInputChange}
                            name="checkbox_1jkzv"
                            value={formData["checkbox_1jkzv"]}
                            checked={!!formData["checkbox_1jkzv"]}>
                        </input>

                        <input 
                            type="checkbox" 
                            className={styles.input0} 
                            onChange={handleInputChange}
                            name="checkbox_2xfve"
                            value={formData["checkbox_2xfve"]}
                            checked={!!formData["checkbox_2xfve"]}>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input2} 
                            onChange={handleInputChange}
                            name="text_3rwka"
                            value={formData["text_3rwka"]}
                            checked={!!formData["text_3rwka"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input3} 
                            onChange={handleInputChange}
                            name="text_4vhhd"
                            value={formData["text_4vhhd"]}
                            checked={!!formData["text_4vhhd"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input4} 
                            onChange={handleInputChange}
                            name="text_5gqjr"
                            value={formData["text_5gqjr"]}
                            checked={!!formData["text_5gqjr"]} required>
                        </input>
                        <button onClick={handleSubmit} className={styles.submit}>Save to Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Doc1Page;

/*
                        type={type}
                        name={name}
                        value={type === 'text' ? formData[name] || '' : undefined}
                        checked={type === 'checkbox' ? !!formData[name] : undefined}
                        onChange={handleInputChange}

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
*/
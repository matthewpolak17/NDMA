import styles from '../../styles/doc2style.module.css';
import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Doc1Page = () => {

    const pdfURL = "/documents/Consent form Release of Information - Spring 2024.pdf";
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
            const response = await fetch('/api/saveUserPdf2', {
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
            router.push("/view/viewdoc2");
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
                <img src="/docimages/doc2image.jpg" className={styles.docimage}></img>
                    <form>

                        <input 
                            type="text" 
                            className={styles.input0} 
                            onChange={handleInputChange}
                            name="text_8kmoh"
                            value={formData["text_8kmoh"]}
                            checked={!!formData["text_8kmoh"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input1} 
                            onChange={handleInputChange}
                            name="text_9axbd"
                            value={formData["text_9axbd"]}
                            checked={!!formData["text_9axbd"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input2} 
                            onChange={handleInputChange}
                            name="text_10sqmz"
                            value={formData["text_10sqmz"]}
                            checked={!!formData["text_10sqmz"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input3} 
                            onChange={handleInputChange}
                            name="text_11qvrb"
                            value={formData["text_11qvrb"]}
                            checked={!!formData["text_11qvrb"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input4} 
                            onChange={handleInputChange}
                            name="text_12eepd"
                            value={formData["text_12eepd"]}
                            checked={!!formData["text_12eepd"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input5} 
                            onChange={handleInputChange}
                            name="text_13emti"
                            value={formData["text_13emti"]}
                            checked={!!formData["text_13emti"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input6} 
                            onChange={handleInputChange}
                            name="text_14insp"
                            value={formData["text_14insp"]}
                            checked={!!formData["text_14insp"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input7} 
                            onChange={handleInputChange}
                            name="text_15ywih"
                            value={formData["text_15ywih"]}
                            checked={!!formData["text_15ywih"]} required>
                        </input>

                        <input 
                            type="text" 
                            className={styles.input8} 
                            onChange={handleInputChange}
                            name="text_16tbsy"
                            value={formData["text_16tbsy"]}
                            checked={!!formData["text_16tbsy"]} required>
                        </input>
                        <button onClick={handleSubmit} className={styles.submit}>Save to Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Doc1Page;

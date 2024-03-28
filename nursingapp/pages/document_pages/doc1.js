import PdfEditor from "../../components/PDFEditor";

const Doc1Page = () => {

    const pdfURL = "/documents/2022 COVID Care Volunteer Form WKU Feedback.pdf"
    return (
        <PdfEditor pdfFileUrl={pdfURL} />
    );
};

export default Doc1Page;
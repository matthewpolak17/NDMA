import PdfEditor from "../../components/PDFEditor";

const Doc2Page = () => {

    const pdfURL = "/documents/Consent form Release of Information - Spring 2024.pdf"
    return (
        <PdfEditor pdfFileUrl={pdfURL} />
    );
};

export default Doc2Page;
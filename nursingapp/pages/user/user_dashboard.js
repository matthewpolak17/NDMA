import { useSession, getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/dashboardstyle.module.css';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

export async function getServerSideProps(context) {

    // User Dashboard layout
    try {
        const session = await getSession(context);
        const userId = session.userId;
        const { req } = context;
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host; // Gets the host and port from the request headers
        const absoluteUrl = `${protocol}://${host}/api/getPdf`;

        const response = await fetch(absoluteUrl, {
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
            //finds the indexes of the completed documents
            const completedIndexes = pdfArray.map((pdf, index) => pdf != null ? index + 1 : null).filter(index => index !== null);
            return {
                props: {
                    completedIndexes,
                },
            };
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error retrieving PDF:', error);
        return {
            props: {
                completedIndexes: [],
            }
        }
    }
}

export default function Profile({ completedIndexes }) {

console.log(completedIndexes);

    const { data: session, status } =  useSession();
    const router = useRouter();
    const documents = [
        { title: '2022 COVID Care Volunteer Form WKU Feedback', linkC: '../view/viewdoc1', linkR: '../document_pages/doc1' },
        { title: 'Consent form Release of Information - Spring 2024', linkC: '../view/viewdoc2', linkR: '../document_pages/doc2' },
        { title: 'LPN to ASN Online Acceptance Form - Spring 2024', linkC: '../view/viewdoc3', linkR: '../document_pages/doc3' },
        { title: 'LPN to ASN Student Handbook Acknowledgement', linkC: '../view/viewdoc4', linkR: '../document_pages/doc4' },
        { title: 'Release and Waiver of Liability', linkC: '../view/viewdoc5', linkR: '../document_pages/doc5' },
        { title: 'Skills Pack and Equipment Use Agreement', linkC: '../view/viewdoc6', linkR: '../document_pages/doc6' },
        { title: 'WKU COVID 19 Assumption of Risk', linkC: '../view/viewdoc7', linkR: '../document_pages/doc7' },
    ];

    const getCardContentC = (doc) => (
            <>
            <Link href={doc.linkC} style={{ textDecoration: "none", color: "black" }}>
            {doc.title}
            </Link>
            </>
    );

    const getCardContentR = (doc) => (
        <>
        <Link href={doc.linkR} style={{ textDecoration: "none", color: "black" }}>
        {doc.title}
        </Link>
        </>
);
    const remainingIndexes = documents
    .map((_, index) => index + 1) // create an array of indexes
    .filter(index => !completedIndexes.includes(index)); // exclude completed indexes

    useEffect(() => {
        // Redirect to sign-in page if not authenticated
        if (status === 'unauthenticated') {
            router.push("/");
            console.log("You have been signed out");
        } else if (session && session.user.role == 'admin') {
            router.push("/admin/dashboard");
            console.log("Redirecting to admin view...");
        }
    }, [status, router, session]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }
    
    //code for the logout button
    const handleLogout = async () => {
        const data = await signOut({ redirect: false, callbackUrl: "/" });
        // 'data' will contain the URL you need to redirect to
        if (data.url) {
          window.location = data.url;
        }
      };

      

    //displays the main document page
    return (
        <div>
            <header className={styles.header}>
                <div className={styles.logoGroup}>
                    <img src="/wku_w.png" className={styles.logo}/>
                    <h1 className={styles.centerText}>Document Submission Portal</h1>
                </div>
                <div className={styles.name}>
                    {session ? (
                            <p className={styles.addressUser} style={{display: "inline-block"}}>Welcome, {session.user.first_name}!</p>
                    ) : (
                        <p className={styles.addressUser} style={{display: "inline-block"}}>You are not signed in.</p>
                    )}
                    <button className={styles.logout} style={{display: "inline-block"}} onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <div className={styles.groupCards}>
                <div className={styles.cardContainer}>
                    <h2 style={{width: "fit-content", marginLeft: "auto", marginRight:"auto"}}>Completed</h2>
                    {documents.map((doc, index) =>
                        completedIndexes.includes(index + 1) ? (
                        <div key={`completed${index + 1}`} className={styles.cardL}>
                            {getCardContentC(doc)}
                        </div>
                        ) : null
                    )}
                </div>

                <div className={styles.verticalLine}>
                </div>

                
                <div className={styles.cardContainer}>
                    <h2 style={{width: "fit-content", marginLeft: "auto", marginRight:"auto"}}>Remaining</h2>
                    {documents.map((doc, index) =>
                        remainingIndexes.includes(index + 1) ? (
                        <div key={`remaining${index + 1}`} className={styles.card}>
                            {getCardContentR(doc)}
                        </div>
                        ) : null
                    )}
                </div>

            </div>
            <br/>

        {/* Render the footer */}
        <footer className={styles.footer_place}></footer>
        <footer className={styles.footer}><p style={{marginTop: "10px", marginBottom: "10px"}}>Associate of Science in Nursing Program</p></footer>

        <script src="../api/isPdf.js">
    
        </script>
        </div>
    );
}

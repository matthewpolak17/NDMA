import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/profilestyle.module.css';
import PdfEditor from '../../components/PDFEditor';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';

function ClickableCard({ title, href }) {
    return (
        <Link href={href}>
            <div className={styles.card} style={{ textDecoration: 'none'}}>{title}</div>
        </Link>
    );
}

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    //ensures that the user is signed in
    console.log(session);

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

    const footerContent = (
        <footer className={styles.footer}>
            <p>WKU</p>
        </footer>
    );

    //displays the main document page
    return (
        <div>
            <h1 className={styles.centerText}>Nursing Document Submission Portal</h1>
            {session ? (
                <div>
                    <p className={styles.addressUser}>Welcome, {session.user.name}!</p>
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
            <hr/>
            <p>Please fill out the following forms</p><br/>
            <div className={styles.cardContainer}>
                <ClickableCard title="2022 COVID Care Volunteer Form WKU Feedback" href="/document_pages/doc1" />
                <ClickableCard title="Consent form Release of Information - Spring 2024" href="" />
                <ClickableCard title="LPN to ASN Online Acceptance Form - Spring 2024" href="" />
                <ClickableCard title="LPN to ASN Student Handbook Acknowledgement" href="" />
                <ClickableCard title="Release and Waiver of Liability" href="" />
                <ClickableCard title="Skills Pack and Equipment Use Agreement" href="" />
                <ClickableCard title="WKU COVID 19 Assumption of Risk" href="" />
            </div><br/>
            <p>View submitted docs</p>
                <Link href="../viewdoc1">2022 COVID Care Volunteer Form WKU Feedback</Link><br/>
            <LogoutButton />

        {/* Render the footer */}
        {footerContent}
        </div>
    );
}

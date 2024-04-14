import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/profilestyle.module.css';
import PdfEditor from '../components/PDFEditor';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

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
        }
    }, [status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    //displays the main document page
    return (
        <div>
            <h1 className={styles.centerText}>Nursing Document Submission Portal</h1>
            {session ? (
                <div>
                    {/* Ensure the correct property is used to display the user's name */}
                    <p className={styles.addressUser}>Welcome, {session.user.name}!</p>
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
            <hr/>
            <p>Please fill out the following forms</p><br/>
            <ul>
                <li><Link href="\document_pages\doc1">2022 COVID Care Volunteer Form WKU Feedback</Link></li>
                <li><Link href="">Consent form Release of Information - Spring 2024</Link></li>
                <li><Link href="">LPN to ASN Online Acceptance Form - Spring 2024</Link></li>
                <li><Link href="">LPN to ASN Student Handbook Acknowledgement</Link></li>
                <li><Link href="">Release and Waiver of Liability</Link></li>
                <li><Link href="">Skills Pack and Equipment Use Agreement</Link></li>
                <li><Link href="">WKU COVID 19 Assumption of Risk</Link></li>
            </ul><br/>
            <LogoutButton />

        </div>
    );
}

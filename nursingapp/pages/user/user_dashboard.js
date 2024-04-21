import { useSession, getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/dashboardstyle.module.css';
import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';

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

            <div className={styles.groupCards}>
                <div className={styles.cardContainer}>
                <h2 style={{marginLeft: "20%"}}>Completed</h2>
                    <div id="completed1" className={styles.cardL}><Link href="../viewdoc1" style={{textDecoration: "none", color: "black"}}>2022 COVID Care Volunteer Form WKU Feedback</Link></div>
                    <div id="completed2" className={styles.cardL}>Consent form Release of Information - Spring 2024</div>
                    <div id="completed3" className={styles.cardL}>LPN to ASN Online Acceptance Form - Spring 2024</div>
                    <div id="completed4" className={styles.cardL}>LPN to ASN Student Handbook Acknowledgement</div>
                    <div id="completed5" className={styles.cardL}>Release and Waiver of Liability</div>
                    <div id="completed6" className={styles.cardL}>Skills Pack and Equipment Use Agreement</div>
                    <div id="completed7" className={styles.cardL}>WKU COVID 19 Assumption of Risk</div>
                </div>

                <div className={styles.verticalLine}>
                </div>

                
                <div className={styles.cardContainer}>
                <h2 style={{marginLeft: "41%"}}>Remaining</h2>
                    <div id="remaining1" className={styles.card}><Link href="../document_pages/doc1" style={{textDecoration: "none", color: "black"}}>2022 COVID Care Volunteer Form WKU Feedback</Link></div>
                    <div id="remaining2" className={styles.card}>Consent form Release of Information - Spring 2024</div>
                    <div id="remaining3" className={styles.card}>LPN to ASN Online Acceptance Form - Spring 2024</div>
                    <div id="remaining4" className={styles.card}>LPN to ASN Student Handbook Acknowledgement</div>
                    <div id="remaining5" className={styles.card}>Release and Waiver of Liability</div>
                    <div id="remaining6" className={styles.card}>Skills Pack and Equipment Use Agreement</div>
                    <div id="remaining7" className={styles.card}>WKU COVID 19 Assumption of Risk</div>
                </div>
            </div>
            <br/>

        {/* Render the footer */}
        <footer className={styles.footer_place}></footer>
        <footer className={styles.footer}><p>WKU ASN Program</p></footer>

        <script src="../api/isPdf.js">
    
        </script>
        </div>
    );
}

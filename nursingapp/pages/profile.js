import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/profilestyle.module.css';
import PdfEditor from './PDFEditor'; // Corrected import statement

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

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

    return (
        <div>
            <h1 className={styles.centerText}>Nursing Document Submission Portal</h1>
            {session ? (
                <div>
                    {/* Ensure the correct property is used to display the user's name */}
                    <p className={styles.addressUser}>Welcome, {session.user.name}!</p>
                    <PdfEditor /> {/* Include the PdfEditor component */}
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
        </div>
    );
}

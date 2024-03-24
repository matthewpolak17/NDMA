import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LogoutButton from '../components/Logout';

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
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
            <h1>Home Page</h1>
            {session ? (
                <div>
                    <p>Welcome, {session.user.name}!</p>
                    <form>
                        <ul>
                            <li><a href="/document_views/doc1">2022 COVID Care Volunteer Form WKU Feedback</a></li><input type="checkbox" disabled checked value="1"></input><br/>
                            <li><a href="/document_views/doc2">Consent Form Release of Information Spring 2024</a></li><input type="checkbox" disabled checked value="1"></input><br/>
                            <li><a href="/document_views/doc3">LPN to ASN Online Acceptance Form Spring 2024</a></li><input type="checkbox" disabled checked value="1"></input><br/>
                            <li><a href="/document_views/doc4">LPN to ASN Student Handbook Acknowledgement</a></li><input type="checkbox" disabled value="1"></input><br/>
                            <li><a href="/document_views/doc5">Release and Waiver of Liability</a></li><input type="checkbox" disabled value="1"></input><br/>
                            <li><a href="/document_views/doc6">Skills Pack and Equipment Use Agreement</a></li><input type="checkbox" disabled value="1"></input><br/>
                            <li><a href="/document_views/doc7">WKU COVID-19 Assumption of Risk</a></li><input type="checkbox" disabled value="1"></input><br/>
                        </ul>
                    </form><br/>
                    <LogoutButton />
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
        </div>
    );
}

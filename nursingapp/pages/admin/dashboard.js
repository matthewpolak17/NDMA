import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '/styles/dashboardstyle.module.css';
import Link from 'next/link';
import { getSession } from 'next-auth/react';
import LogoutButton from '../../components/LogoutButton';

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to sign-in page if not authenticated
        if (status === 'unauthenticated') {
            router.push("/");
            console.log("You have been signed out");
        } else if (session && session.user.role == "USER") {
            router.push("/user/user_dashboard");
            console.log("Redirecting to user view...");
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
                    <p className={styles.addressUser}>Welcome, {session.user.name}!</p>
                    <p>This is an admin view</p>
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

//this function ensures that non-admins are redirected
//before the page is loaded
export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });
  
    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  
    if (session.user.role !== "ADMIN") {
      return {
        redirect: {
          destination: '/', 
          permanent: false,
        },
      };
    }
    
    console.log("You don't have access to this page");
    return {
      props: { session },
    };
}
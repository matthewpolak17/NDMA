import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import BackButton from '../../components/BackButton';

export default function Doc1() {
    console.time('docTimer');
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
    console.timeEnd('docTimer');

    return(
        <div>
            <p>2022 COVID Care Volunteer Form WKU Feedback</p>
            <embed src="\documents\2022 COVID Care Volunteer Form WKU Feedback.pdf" width="700" height="700"></embed><br/><br/>
            <BackButton /><br/><br/>
        </div>
    );
    
}
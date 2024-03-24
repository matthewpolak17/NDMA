import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import BackButton from '../../components/BackButton';

export default function Doc7() {
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

    return(
        <div>
            <p>WKU COVID-19 Assumption of Risk</p>
            <embed src="\documents\WKU COVID 19 Assumption of Risk 2020.06.25 updated_8.2.22.pdf" width="700" height="700"></embed><br/><br/>
            <BackButton /><br/><br/>
        </div>
    );
}
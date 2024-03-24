import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Doc5() {
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
            <p>Release and Waiver of Liability</p>
            <embed src="\documents\Release and Waiver of Liability.pdf" width="700" height="700"></embed><br/><br/>
            <BackButton /><br/><br/>
        </div>
    );
}
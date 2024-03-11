import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Redirect to sign-in page if not authenticated
        if (status === 'unauthenticated') {
            signIn();
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
                    {/* Ensure the correct property is used to display the user's name */}
                    <p>Welcome, {session.user.name}!</p>
                </div>
            ) : (
                <p>You are not signed in.</p>
            )}
        </div>
    );
}

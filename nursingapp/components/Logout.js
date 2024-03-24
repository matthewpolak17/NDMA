import React from 'react';
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
    return (
        <button onClick={() => signOut({ callbackUrl: '/' })}>
            Log Out
        </button>
    );
};

export default LogoutButton;
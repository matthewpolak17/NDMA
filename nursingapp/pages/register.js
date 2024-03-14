import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import styles from '../styles/loginstyle.module.css';

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        //implement register function here
        const response = await fetch('/api/register', { //fetches data from api/register.js
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            //sign them in after registering
            const status = await signIn('credentials', {
                redirect: false,
                username,
                password,
              });

              if (!status.error) {
                router.push('/profile');
              } else {
                console.log("Error Signing In After Registering");
              }
        } else {
            console.log("Error Registering");
        }
    }

    return (
        <div>
            <h1>Gold Scar!</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.loginLabel} htmlFor="username">Username</label>
                    <input id="username" className={styles.inputField} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.loginLabel} htmlFor="password">Password</label>
                    <input id="password" className={styles.inputField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className={styles.button} type="submit">Register</button>
            </form>
        </div>
    );
}
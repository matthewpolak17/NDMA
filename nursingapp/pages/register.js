import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import styles from '../styles/registerstyle.module.css';

export default function Register() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [first_name, setF_name] = useState('');
    const [last_name, setL_name] = useState('');

    //handles the submission of the registration from
    const handleSubmit = async (event) => {
        event.preventDefault();
        //implement register function here
        const response = await fetch('/api/register', { //fetches data from api/register.js
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name, last_name, username, password, email }),
        });

        //makes sure there are no errors
        if (response.ok) {
            //sign them in after registering
            const status = await signIn('credentials', {
                redirect: false,
                username,
                password,
              });

              if (!status.error) {
                router.push('/user/user_dashboard');
              } else {
                console.log("Error Signing In After Registering");
              }
        } else {
            alert("Error");
        }
    }

    const goBack = () => {
        router.push('/');
    }

    //displays the register page
    return (
        <div>
            <img src="/wkucuplong.jpg" alt="WKU Logo" className={styles.wkulogo}/>
            <hr/>
            <button className={styles.back} onClick={goBack}>Back</button>
            <h1 className={styles.centerText}>Create an Account</h1>
            <div className={styles.registerContainer}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.registerLabel} htmlFor="first_name">First Name</label>
                        <input id="first_name" className={styles.inputField} type="text" value={first_name} onChange={(e) => setF_name(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.registerLabel} htmlFor="last_name">Last Name</label>
                        <input id="last_name" className={styles.inputField} type="text" value={last_name} onChange={(e) => setL_name(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.registerLabel} htmlFor="username">Username</label>
                        <input id="username" className={styles.inputField} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.registerLabel} htmlFor="password">Password</label>
                        <input id="password" className={styles.inputField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.registerLabel} htmlFor="email">WKU Email</label>
                        <input id="email" className={styles.inputField} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button className={styles.button} type="submit">Register</button>
                </form><br/>
            </div>
        </div>
    );
}
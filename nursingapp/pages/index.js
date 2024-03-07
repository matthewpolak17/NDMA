import { useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from '../styles/loginstyle.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (!status.error) {
      // Handle success
    } else {
      // Handle error
    }
  };

  return (
    <div>
      <img src="/WKU School Of Nursing Logo.jpg" alt="WKU Nursing Logo" className="NursingLogo" />
      <h1>Welcome to the Nursing Documentation Management Portal</h1>
      <div className={styles.loginContainer}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.loginLabel} htmlFor="username">Username</label>
            <input id="username" className={styles.inputField} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.loginLabel} htmlFor="password">Password</label>
            <input id="password" className={styles.inputField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className={styles.button} type="submit">Sign In</button>
        </form>
      </div>
      <p>Welcome to the Nursing Documentation Management Portal!</p>
    </div>
  );
}

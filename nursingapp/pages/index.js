import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import styles from '../styles/loginstyle.module.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  //handles the login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    //checks for errors after login is processed
    if (status.error) {
      console.log("Error");
      alert("The Username or Password is incorrect.");
    } else {
      console.log("Sign-in successful, redirecting...");
      const session = await getSession();
      if (session.user.role == "ADMIN") {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/user_dashboard');
      }
    }

  };

  //displays the login page
  return (
      <div>
      <img src="/wkucuplong.jpg" alt="WKU Logo" className={styles.wkulogo}/>
      <hr />
      <h1 className={styles.centerText}>Welcome to the ASN Document Submission Portal</h1>

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

      <p className={styles.centerText}>Don't have an account? Register <a href="/register">here</a></p>

      </div>
  );
}

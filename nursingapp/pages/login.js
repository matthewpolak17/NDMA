import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const status = await signIn('credentials', {
            redirect: false,
            username,
            password,
        })

        if (!status.error) {
            //Handle success
        } else {
            //Handle error
        }

        return (
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button type="submit">Sign In</button>
            </form>
        )
    }
}
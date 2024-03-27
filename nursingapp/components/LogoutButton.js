import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const handleLogout = async () => {
    // Calls NextAuth signOut method
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    // 'data' will contain the URL you need to redirect to
    if (data.url) {
      window.location = data.url;
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;

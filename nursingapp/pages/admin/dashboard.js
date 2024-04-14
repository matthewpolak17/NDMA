import { getSession } from "next-auth/react";

export default function AdminDashboard({ session }) {
    //content
    return (
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, Admin!</p>
      </div>
    );
  }
  
  export async function getServerSideProps(context) {
    const session = await getSession(context);
  
    if (!session || session.user.role !== 'admin') {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  
    return {
      props: { session },
    };
  }
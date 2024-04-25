// pages/admin/dashboard.js
import { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from '../../styles/admindashboard.module.css';
import LogoutButton from '../../components/LogoutButton';
import { PrismaClient } from '@prisma/client';

export default function Dashboard({ users }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/");
    } else if (session && session.user.role === "USER") {
      router.push("/user/user_dashboard");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className={styles.centerText}>Nursing Document Submission Portal</h1>
      {session ? (
        <div>
          <p className={styles.addressUser}>Welcome, {session.user.name}!</p>
          <p>This is an admin view</p>
          <div className={styles.folderContainer}>
            {users.length > 0 ? (
              users.map(user => (
                <div key={user.id} className={styles.userFolder} onClick={() => router.push(`/admin/documents/${user.id}`)}>
                  <h2>{user.name} ({user.email})</h2>
                </div>
              ))
            ) : (
              <p>No submissions available.</p>
            )}
          </div>
        </div>
      ) : (
        <p>You are not signed in.</p>
      )}
      <LogoutButton />
    </div>
  );
}

export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== "ADMIN") {
    await prisma.$disconnect();
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { pdf: { not: null } },
        { pdf2: { not: null } },
        { pdf3: { not: null } },
        { pdf4: { not: null } },
        { pdf5: { not: null } },
        { pdf6: { not: null } },
        { pdf7: { not: null } },
      ],
    },
  });

  await prisma.$disconnect();

  return {
    props: { users },
  };
}

import React, { useState } from 'react';
import { useSession, getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import styles from '../../styles/admindashboard.module.css';
import LogoutButton from '../../components/LogoutButton';

// Displays the admin dashboard
export default function Dashboard({ users }) {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState(null);

  if (!session || session.user.role !== "ADMIN") {
    return <p className={styles.accessDenied}>Access Denied</p>;
  }

  const handleBackClick = () => setSelectedUser(null);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.centerText}>Admin Dashboard</h1>
        <LogoutButton className={styles.logoutButton} />
      </header>

      <main className={styles.mainContent}>
        {selectedUser ? (
          <div>
            <button onClick={handleBackClick} className={styles.backButton}>
              Back to User List
            </button>
            <div className={styles.documentsContainer}>
              <h2 className={styles.documentsHeading}>{selectedUser.username}'s Documents</h2>
              {selectedUser.documents.map((doc, index) => (
                <a
                  key={index}
                  className={styles.documentLink}
                  href={`data:application/pdf;base64,${doc.content}`}
                  download={`Document-${index + 1}.pdf`}
                >
                  Download Document {index + 1}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.usersContainer}>
            {users.length > 0 ? (
              users.map(user => (
                <div key={user.id} className={styles.userFolder}>
                  <h2>{user.first_name} {user.last_name} ({user.email})</h2>
                  <button onClick={() => setSelectedUser(user)} className={styles.viewButton}>
                    View Documents
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.noDocuments}>No users with submitted documents.</p>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Associate of Science in Nursing Program</p>
      </footer>
    </div>
  );
}

export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const session = await getSession(context);

  // Redirects if not admin
  if (!session || session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const users = await prisma.user.findMany();

    const usersWithDocuments = users.map(user => {
      const documents = [];

      // Check for the first PDF stored under 'pdf'
      if (user.pdf) {
        documents.push({ content: user.pdf });
      }

      // Check for the rest under 'pdf1', 'pdf2', etc.
      for (let i = 1; i <= 7; i++) {
        const pdfField = `pdf${i}`;
        if (user[pdfField]) {
          documents.push({ content: user[pdfField] });
        }
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        documents,
      };
    }).filter(user => user.documents.length > 0); // Ensure we only include users with documents

    return {
      props: { users: usersWithDocuments }
    };
  } catch (error) {
    console.error('Error during database query:', error);
    return {
      props: { users: [] }
    };
  } finally {
    await prisma.$disconnect();
  }
}

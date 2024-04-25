// pages/admin/documents/[userId].js
import { useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';

const UserDocuments = ({ user, documents }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect if not admin
  if (!session || session.user.role !== "ADMIN") {
    router.push('/admin');
    return null;
  }

  // Render documents or a message if there are none
  const renderDocuments = () => {
    if (documents.length === 0) {
      return <p>No documents have been submitted by this user.</p>;
    }
    
    return (
      <ul>
        {documents.map((doc, index) => (
          <li key={index}>
            <a href={`data:application/pdf;base64,${doc}`} download={`Document-${index + 1}.pdf`}>
              Document {index + 1}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  // Include checks to handle the case where user might be null
  return (
    <div>
      <h1>Documents for {user?.name ?? 'N/A'} ({user?.email ?? 'N/A'})</h1>
      {renderDocuments()}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { userId } = context.params;
  const prisma = new PrismaClient();
  let user = null;
  let documents = [];

  try {
    user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (user) {
      for (let i = 1; i <= 7; i++) {
        const pdfField = user[`pdf${i}`];
        if (pdfField) {
          documents.push(pdfField);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching user or documents: ", error);
  } finally {
    await prisma.$disconnect();
  }

  // If the user is null, then there will be no user.name or user.email, so we don't send them as props
  const props = user
    ? {
        user: {
          name: user.name,
          email: user.email,
        },
        documents,
      }
    : { notFound: true };

  return { props };
}

export default UserDocuments;

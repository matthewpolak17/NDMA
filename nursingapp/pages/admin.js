// pages/admin.js
import { PrismaClient } from '@prisma/client';
import AdminDashboard from '../components/AdminDashboard'; // Adjust path as necessary

export async function getServerSideProps(context) {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    include: {
      documents: true,
    }
  });

  await prisma.$disconnect();

  return {
    props: { users },
  };
}

export default function AdminPage({ users }) {
  return <AdminDashboard users={users} />;
}

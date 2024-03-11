const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const password = '6075904879'; // Replace with the desired password
    const passwordHash = await bcrypt.hash(password, 10); // Hash the password

    // Add a new user to the database
    const newUser = await prisma.user.create({
      data: {
        username: 'matthew_polak', // Replace with the desired username
        password_hash: passwordHash,
      },
    });

    console.log(`User created:`, newUser);
  } catch (e) {
    console.error("Error creating user:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();

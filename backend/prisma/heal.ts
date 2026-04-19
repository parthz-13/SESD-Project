import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Healing existing users...');
  
  const users = await prisma.user.findMany({
    include: { member: true, librarian: true }
  });

  for (const user of users) {
    if (user.role === 'MEMBER' && !user.member) {
      console.log(`Healing missing Member record for user ${user.id} (${user.email})...`);
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      await prisma.member.create({
        data: {
          userId: user.id,
          membershipNumber: `MEM-${Date.now()}-${user.id}`,
          membershipExpiry: expiry,
        }
      });
      console.log(`Created Member record for user ${user.id}`);
    } else if (user.role === 'LIBRARIAN' && !user.librarian) {
      console.log(`Healing missing Librarian record for user ${user.id} (${user.email})...`);
      await prisma.librarian.create({
        data: {
          userId: user.id,
          employeeCode: `LIB-${Date.now()}-${user.id}`,
        }
      });
      console.log(`Created Librarian record for user ${user.id}`);
    }
  }

  console.log('Healing complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

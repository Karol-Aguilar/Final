import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPasswords() {
  const users = await prisma.login.findMany(); // Cambia a tu tabla real

  for (const user of users) {
    if (!user.password.startsWith('$2b$')) { // Evita rehashear
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.login.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      console.log(`Contraseña encriptada para ${user.email}`);
    }
  }

  await prisma.$disconnect();
}

hashPasswords().catch(console.error);


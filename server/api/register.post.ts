import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Email y contraseña son obligatorios' });
  }

  // Verificar si el usuario ya existe
  const existingUser = await prisma.login.findUnique({ where: { email } }); // Cambiado a login
  if (existingUser) {
    throw createError({ statusCode: 400, message: 'El usuario ya existe' });
  }

  // Hashear la contraseña
  const hashedPassword = await hash(password, 10);

  // Crear el usuario
  const newUser = await prisma.login.create({  // Cambiado a login
    data: { email, password: hashedPassword },
  });

  // Generar token
  const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return { token, user: { id: newUser.id, email: newUser.email } };
});

import { defineEventHandler, readBody, createError, H3Error } from 'h3';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/server/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({ statusCode: 400, statusMessage: 'Email y contraseña son obligatorios' });
    }

    // Buscar usuario en la tabla login
    const user = await prisma.login.findUnique({ where: { email } });
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw createError({ statusCode: 401, statusMessage: 'Credenciales inválidas' });
    }

    // Verificar que JWT_SECRET está definido
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw createError({ statusCode: 500, statusMessage: 'Error del servidor: JWT_SECRET no configurado' });
    }

    // Generar token
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    return { token, user: { id: user.id, email: user.email } };
  } catch (error) {
    console.error('Error en login:', error);

    // Verificamos si error es de tipo H3Error (usado en createError)
    if (error instanceof H3Error) {
      throw error;
    }

    // Si el error no es de H3Error, devolvemos un error 500
    throw createError({ statusCode: 500, statusMessage: 'Error interno del servidor' });
  }
});

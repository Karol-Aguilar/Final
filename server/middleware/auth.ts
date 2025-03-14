import { defineEventHandler, getHeader, createError } from 'h3';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  try {
    // Obtener la URL de la petición
    const url = event.node.req.url;

    // Excluir rutas públicas (NO requieren autenticación)
    const rutasPublicas = ['/api/login', '/', '/login'];
    if (rutasPublicas.some(ruta => url?.startsWith(ruta))) {
      return;
    }

    // Obtener el token del encabezado Authorization
    const authHeader = getHeader(event, 'authorization');
    if (!authHeader) {
      throw createError({ statusCode: 401, message: 'No autorizado: Token no proporcionado' });
    }

    // Validar formato "Bearer TOKEN"
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createError({ statusCode: 401, message: 'No autorizado: Formato de token inválido' });
    }

    // Verificar que JWT_SECRET esté definido
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw createError({ statusCode: 500, message: 'Error del servidor: JWT_SECRET no configurado' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, secret);
    event.context.auth = decoded;
  } catch (error) {
    console.error('Error en autenticación:', error);
    throw createError({ statusCode: 401, message: 'No autorizado: Token inválido o expirado' });
  }
});


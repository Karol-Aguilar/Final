export default defineEventHandler(async (event) => {
    if (!event.context.auth) {
      throw createError({ statusCode: 401, message: 'No autorizado' });
    }
  
    return { message: 'Acceso permitido', user: event.context.auth };
  });
  
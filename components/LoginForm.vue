<template>
    <div class="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
        <h2 class="text-center mb-4">Iniciar Sesión</h2>
  
        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label">Correo Electrónico</label>
            <input v-model="email" type="email" class="form-control" required />
          </div>
  
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input v-model="password" type="password" class="form-control" required />
          </div>
  
          <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
  
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-center">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const login = async () => {
    errorMessage.value = '';
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
  
      localStorage.setItem('token', data.token);
      router.push('./dashboard'); // Redirigir tras login
    } catch (error) {
      errorMessage.value = error.message;
    }
  };
  </script>
  
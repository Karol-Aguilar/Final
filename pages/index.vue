<template>
    <div class="d-flex vh-100 justify-content-center align-items-center">
      <h1>Hola, redirigiendo al login...</h1>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';
  
  const router = useRouter();
  
  onMounted(() => {
    setTimeout(() => {
      router.push('/login'); // Redirigir al login
    }, 2000); // Espera 2 segundos antes de redirigir
  });
  </script>
  
  <style>
  /* Estilos opcionales */
  </style>
  
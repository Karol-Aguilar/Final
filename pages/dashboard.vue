<template>
    <div class="vh-100 d-flex flex-column">
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container d-flex justify-content-between">
                <a class="navbar-brand d-flex align-items-center" href="#">
                    <i class="bi bi-house-door me-2"></i> Dashboard
                </a>

                <div class="d-flex align-items-center">
                    <!-- Carrito de compras -->
                    <div class="me-3 d-flex align-items-center" @click="mostrarCarrito = true" style="cursor: pointer;">
                        <i class="bi bi-cart text-white fs-4"></i>
                        <span v-if="totalProductos > 0" class="badge bg-danger text-light ms-1">{{ totalProductos
                            }}</span>
                    </div>

                    <!-- Modal de pago -->
                    <div class="me-3 d-flex align-items-center" @click="mostrarPay = true" style="cursor: pointer;">
                        <i class="bi bi-credit-card text-white fs-4"></i>
                        <span class="badge bg-danger text-light ms-1">Pay</span>
                    </div>

                    <!-- Botón de logout -->
                    <button class="btn btn-danger d-flex align-items-center" @click="logout">
                        <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>

        <!-- Contenido principal -->
        <div class="container flex-grow-1 d-flex flex-column align-items-center justify-content-center mt-4">
            <div class="card shadow p-4 w-100" style="max-width: 800px;">
                <h2 class="text-center mb-4">Bienvenido al Dashboard</h2>
                <p class="text-center bg-success text-white p-2">Has iniciado sesión correctamente.</p>

                <!-- Lista de productos -->
                <div class="row mt-4">
                    <div class="col-md-4 col-sm-6 col-12 mb-4" v-for="producto in productos" :key="producto.id">
                        <div class="card shadow-sm h-100">
                            <img :src="producto.foto" class="card-img-top img-fluid" alt="Imagen del producto"
                                style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-center">{{ producto.nombre }}</h5>
                                <p class="card-text flex-grow-1 text-center">{{ producto.descripcion }}</p>
                                <p class="fw-bold text-center">Precio: ${{ producto.precio }}</p>
                                <button class="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                                    @click="agregarAlCarrito(producto)">
                                    <i class="bi bi-cart-plus me-2"></i> Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Pago -->
        <div v-if="mostrarPay" class="modal fade show d-block bg-dark bg-opacity-50">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-credit-card"></i> Pago</h5>
                        <button type="button" class="btn-close" @click="mostrarPay = false"></button>
                    </div>
                    <div class="modal-body">
                        <p>Total a pagar: ${{ totalCompra }}</p>
                        <button class="btn btn-success w-100" @click="procesarPago">Confirmar Pago</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal del Carrito -->
        <div v-if="mostrarCarrito" class="modal fade show d-block bg-dark bg-opacity-50">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="bi bi-cart"></i> Carrito de Compras</h5>
                        <button type="button" class="btn-close" @click="mostrarCarrito = false"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group" v-if="carrito.length > 0">
                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                v-for="(item, index) in carrito" :key="index">
                                <div class="d-flex align-items-center">
                                    <img :src="item.foto" alt="Imagen del producto" class="img-fluid rounded me-2"
                                        style="width: 50px; height: 50px; object-fit: cover;">
                                    <div>
                                        <strong>{{ item.nombre }}</strong> - ${{ item.precio }}
                                        <div class="d-flex align-items-center mt-2">
                                            <button class="btn btn-sm btn-outline-secondary"
                                                @click="cambiarCantidad(index, -1)">
                                                <i class="bi bi-dash-lg"></i>
                                            </button>
                                            <span class="mx-2">{{ item.cantidad }}</span>
                                            <button class="btn btn-sm btn-outline-secondary"
                                                @click="cambiarCantidad(index, 1)">
                                                <i class="bi bi-plus-lg"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-sm btn-danger" @click="removerDelCarrito(index)">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </li>
                        </ul>
                        <p v-else class="text-center text-muted">El carrito está vacío.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="mostrarCarrito = false">Cerrar</button>
                        <button class="btn btn-success" v-if="carrito.length > 0" @click="finalizarCompra">
                            Finalizar Compra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createClient } from '@supabase/supabase-js';

const router = useRouter();
const productos = ref([]);
const carrito = ref([]);
const mostrarCarrito = ref(false);
const mostrarPay = ref(false);

const supabase = createClient(
    'https://wwvmeihapsbujhamuzqx.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3dm1laWhhcHNidWpoYW11enF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MzE5OTYsImV4cCI6MjA1NzUwNzk5Nn0.E7KalIoKkRKFLOF_RApVpFVEKfyBFdiZNphhvUe15a0'
);

onMounted(async () => {
    if (!localStorage.getItem('token')) {
        router.push('/login');
        return;
    }
    await fetchProductos();
});

const fetchProductos = async () => {
    const { data, error } = await supabase.from('Producto').select('*');
    if (!error) productos.value = data;
};

const agregarAlCarrito = (producto) => {
    const item = carrito.value.find(item => item.id === producto.id);
    item ? item.cantidad++ : carrito.value.push({ ...producto, cantidad: 1 });
};

const totalProductos = computed(() => carrito.value.reduce((acc, item) => acc + item.cantidad, 0));
const totalCompra = computed(() => carrito.value.reduce((acc, item) => acc + item.precio * item.cantidad, 0));

const finalizarCompra = async () => {
    await supabase.from('compra').insert([{ total: totalCompra.value, estado: 'Pendiente' }]);
    carrito.value = [];
    mostrarCarrito.value = false;
    alert('Compra realizada con éxito.');
};

const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
};
</script>

<template>
  <header class="bg-1 py-1">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Grupo Izquierdo -->
      <div class="d-flex align-items-center">
        <a href="/corporativo" class="btn btn-outline-light me-2">Corporativo</a>
        <button class="btn btn-outline-light">Cargo</button>
      </div>

      <!-- Logo -->
      <div class="flex-grow-1 text-center">
        <a href="/">
          <img src="../assets/logo.png" alt="Logo" class="img-fluid" style="max-height: 70px;">
        </a>
      </div>

      <!-- Grupo Derecho -->
      <div class="d-flex align-items-center position-relative">
        <a href="/login?pathname=/" class="btn btn-light d-flex align-items-center d-none d-md-inline-block">
          <i class="bi bi-person-circle me-2"></i> Ingresar
        </a>

        <!-- Botón hamburguesa -->
        <button class="btn btn-light ms-2 menu-toggle" @click="toggleMenu">
          <font-awesome-icon :icon="menuOpen ? ['fas', 'times'] : ['fas', 'bars']" />
        </button>

        <!-- Menú desplegable -->
        <ul v-if="menuOpen" class="menu-list">
          <li class="d-lg-none"><a href="/cargo/seguimiento">Ingresar</a></li>
          <li><a href="/cargo/seguimiento">Seguimiento de envíos</a></li>
          <li><a href="/promociones">Promociones</a></li>
          <li><a href="/encuentranos">Encuéntranos</a></li>
          <li><a href="/informacion/terminos-condiciones">Políticas</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

// Controlar la visibilidad del menú
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

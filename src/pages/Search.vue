<template>
  <div>
    <h1>Rutas Disponibles</h1>
    <ul>
      <li v-for="ruta in rutas" :key="ruta.id">
        {{ ruta.origen }} - {{ ruta.destino }}
        <button @click="seleccionarRuta(ruta.id)">Seleccionar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import {computed} from "vue";

export default {
  name: 'SearchAqp',
  setup() {
    const store = useStore();
    const router = useRouter();
    const rutas = computed(() => store.rutas);

    function seleccionarRuta(rutaId) {
      router.push(`/asientos/${rutaId}`);
    }

    return { rutas, seleccionarRuta };
  },
};
</script>
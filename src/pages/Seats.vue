<template>
  <div>
    <h1>Selecciona tu Asiento</h1>
    <div v-for="asiento in asientos" :key="asiento.id">
      <button :disabled="asiento.estado !== 'libre'" @click="reservar(asiento)">
        {{ asiento.numero }} - {{ asiento.estado }}
      </button>
    </div>
  </div>
</template>

<script>
import { useSeats } from '@/composables/useSeats';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';

export default {
  name: 'SeatsAqp',
  setup() {
    const route = useRoute();
    const store = useStore();
    const { asientos, fetchAsientos, reservarAsiento } = useSeats(route.params.rutaId);

    async function reservar(asiento) {
      const response = await reservarAsiento(asiento.id);
      if (response.success) {
        store.addAsiento(asiento);
        asiento.estado = 'reservado';
      }
    }

    fetchAsientos();

    return { asientos, reservar };
  },
};
</script>
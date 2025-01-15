<template>
  <div>
    <h1>Confirmar Compra</h1>
    <ul>
      <li v-for="asiento in asientosSeleccionados" :key="asiento.id">
        {{ asiento.numero }}
      </li>
    </ul>
    <button @click="confirmarCompra">Confirmar</button>
  </div>
</template>

<script>
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';
import {computed} from "vue";

export default {
  name: 'CheckoutAqp',
  setup() {
    const store = useStore();
    const router = useRouter();
    const { api } = useApi();
    const asientosSeleccionados = computed(() => store.asientosSeleccionados);

    async function confirmarCompra() {
      const response = await api.post('/api/confirmar-reserva', {
        asientos: asientosSeleccionados.value,
      });
      if (response.data.success) {
        store.setReserva(response.data.reserva);
        await router.push('/exito');
      }
    }

    return { asientosSeleccionados, confirmarCompra };
  },
};
</script>

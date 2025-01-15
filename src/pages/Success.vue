<template>
  <div>
    <h1>Reserva Confirmada</h1>
    <p>Gracias por tu compra. Tu reserva es: {{ reserva?.codigo }}</p>
  </div>
</template>

<script>
import { useStore } from '@/store';
import {computed} from "vue";

export default {
  name: 'SuccesAqp',
  setup() {
    const store = useStore();
    const reserva = computed(() => store.reserva);

    return { reserva };
  },
};
</script>

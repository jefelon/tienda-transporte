<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card" style="width: 100%; max-width: 500px;">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">Buscar Rutas</h1>
        <form @submit.prevent="buscarRutas">
          <div class="mb-3">
            <label for="origen" class="form-label">Origen</label>
            <input
                id="origen"
                v-model="origen"
                type="text"
                class="form-control"
                placeholder="Ciudad o lugar de origen"
            />
          </div>
          <div class="mb-3">
            <label for="destino" class="form-label">Destino</label>
            <input
                id="destino"
                v-model="destino"
                type="text"
                class="form-control"
                placeholder="Ciudad o lugar de destino"
            />
          </div>
          <div class="mb-3">
            <label for="fecha" class="form-label">Fecha</label>
            <input
                id="fecha"
                v-model="fecha"
                type="date"
                class="form-control"
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">
            Buscar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useApi } from '@/composables/useApi';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import {ref} from "vue";

export default {
  name: 'HomeAqp',
  setup() {
    const { api } = useApi();
    const store = useStore();
    const router = useRouter();
    const origen = ref('');
    const destino = ref('');
    const fecha = ref('');

    async function buscarRutas() {
      const { data } = await api.get('/api/rutas', {
        params: { origen: origen.value, destino: destino.value, fecha: fecha.value },
      });
      store.setRutas(data);
      await router.push('/buscar');
    }

    return { origen, destino, fecha, buscarRutas };
  },
};
</script>
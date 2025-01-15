import { ref } from 'vue';
import { useApi } from './useApi';

export function useSeats(rutaId) {
    const { api } = useApi();
    const asientos = ref([]);

    async function fetchAsientos() {
        const { data } = await api.get(`/api/asientos/${rutaId}`);
        asientos.value = data;
    }

    async function reservarAsiento(asientoId) {
        const { data } = await api.post(`/api/reservar-asiento`, { asientoId });
        return data;
    }

    return { asientos, fetchAsientos, reservarAsiento };
}
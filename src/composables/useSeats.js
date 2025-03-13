import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useApi } from './useApi';

export function useSeats() {
    const route = useRoute();
    const { api } = useApi();
    const asientos = ref([]);

    // Usa route.query en lugar de route.params
    const programacionParam = route.query.programacion;
    let programacion = null;
    if (programacionParam) {
        try {
            programacion = JSON.parse(decodeURIComponent(programacionParam));
        } catch (error) {
            console.error("Error al parsear 'programacion':", error);
        }
    } else {
        console.error("No se encontró el parámetro 'programacion' en la query");
    }
    console.log("Programacion:", programacion);

    async function fetchAsientos() {
        if (!programacion || !programacion.ruta_id) {
            console.error("Programacion no definida o incompleta");
            return;
        }
        const payload = {
            rutaId: programacion.ruta_id,
            vehiculo_ruta_id: programacion.vehiculo_ruta_id,
            terminal_inicio: programacion.transporteTerminalOrigenId,
            terminal_fin: programacion.transporteTerminalDestinoId,
            vehiculo_id: programacion.vehiculo_id,
        };
        const { data } = await api.post(`/api/transporte/asientos`, payload);
        asientos.value = data;
        console.log('Asientos desde API:', asientos.value);
    }

    async function reservarAsiento(asientoId) {
        const { data } = await api.post(`/api/transporte/reservar-asiento`, { asientoId });
        return data;
    }

    return { asientos,programacion, fetchAsientos, reservarAsiento };
}

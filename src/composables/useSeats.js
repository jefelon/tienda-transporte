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
            tramo_id:programacion.tramo_id,
            tipo_vehiculo_id:programacion.tipo_vehiculo_id,
        };
        const { data } = await api.post(`/api/transporte/asientos`, payload);
        asientos.value = data;
        console.log('Asientos desde API:', asientos.value);
    }

    async function reservarAsiento(asientoId) {
        const { data } = await api.post(`/api/transporte/reservar-asiento`, { asientoId });
        return data;
    }

    async function consultarCliente(type,number) {
        const { data } = await api.get(`/api/transporte/cliente/${type}/${number}`);
        return data;
    }

    async function generarComprobante(document) {
        const { data } = await api.post(`/api/transporte/generar-comprobante`,document);
        return data;
    }
    async function guardarPasaje(selectedSeats) {
        const { data } = await api.post(`/api/transporte/guardar-pasaje`,selectedSeats);
        return data;
    }

    async function guardarPasajero(pasajero) {
        const { data } = await api.post(`/api/transporte/guardar-pasajero`,pasajero);
        return data;
    }

    return { asientos,programacion, fetchAsientos, reservarAsiento, consultarCliente,generarComprobante, guardarPasajero, guardarPasaje };
}

import { defineStore } from 'pinia';

export const useStore = defineStore('main', {
    state: () => ({
        rutas: [],
        asientosSeleccionados: [],
        reserva: null,
    }),
    actions: {
        setRutas(rutas) {
            this.rutas = rutas;
        },
        addAsiento(asiento) {
            this.asientosSeleccionados.push(asiento);
        },
        setReserva(reserva) {
            this.reserva = reserva;
        },
    },
});
<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 card p-4 shadow">
        <h2 class="text-1 text-center mb-3">Busca tu pasaje</h2>
        <div class="row g-3">
          <!-- ORIGEN -->
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label">Origen</label>
            <div class="input-group">
              <span class="input-group-text">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
              </span>
              <select v-model="origenSeleccionado" class="form-select" @change="filtrarDestinos">
                <option value="" disabled>Seleccione un origen</option>
                <option v-for="origen in origenes" :key="origen.id" :value="origen.id">
                  {{ origen.nombre }}
                </option>
              </select>
            </div>
          </div>

          <!-- DESTINO -->
          <div class="col-12 col-md-6 col-lg-3">
            <label class="form-label">Destino</label>
            <div class="input-group">
              <span class="input-group-text">
                <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
              </span>
              <select v-model="destinoSeleccionado" class="form-select">
                <option value="" disabled>Seleccione un destino</option>
                <option v-for="destino in destinosFiltrados" :key="destino.id" :value="destino.id">
                  {{ destino.nombre }}
                </option>
              </select>
            </div>
          </div>

          <!-- FECHA DE IDA -->
          <div class="col-12 col-md-6 col-lg-2">
            <label class="form-label">Fecha de ida</label>
            <input v-model="fecha" type="date" class="form-control" />
          </div>

          <!-- FECHA DE RETORNO -->
          <div class="col-12 col-md-6 col-lg-2">
            <label class="form-label">Fecha de retorno</label>
            <div class="input-group">
              <input v-model="fechaRetorno" type="date" class="form-control" />
              <button v-if="fechaRetorno" class="btn btn-danger" @click="fechaRetorno = ''">
                ❌
              </button>
            </div>
          </div>

          <!-- BOTÓN BUSCAR -->
          <div class="col-12 col-lg-2 d-flex align-items-end justify-content-center">
            <button class="btn btn-success bg-1 w-100" @click="buscarProgramaciones">Buscar</button>
          </div>
        </div>
      </div>

      <!-- Opciones de ordenamiento -->
      <div class="col-12 mt-4" v-if="programacionesFiltradas.length>0">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <span class="fw-bold mb-2 mb-md-0">Resultados: {{ programacionesFiltradas.length }}</span>
          <div class="d-flex align-items-center">
            <strong class="me-2">Ordenar por:</strong>
            <div class="btn-group">
              <button @click="ordenarPor('precio')" class="btn" :class="filtroActivo.campo === 'precio' ? 'btn-primary' : 'btn-outline-secondary'">💰 Más barato</button>
              <button @click="ordenarPor('duracion')" class="btn" :class="filtroActivo.campo === 'duracion' ? 'btn-primary' : 'btn-outline-secondary'">⚡ Más rápido</button>
              <button @click="ordenarPor('hora_inicio', 'asc')" class="btn" :class="filtroActivo.campo === 'hora_inicio' && filtroActivo.orden === 'asc' ? 'btn-primary' : 'btn-outline-secondary'">🕒 Más temprano</button>
              <button @click="ordenarPor('hora_inicio', 'desc')" class="btn" :class="filtroActivo.campo === 'hora_inicio' && filtroActivo.orden === 'desc' ? 'btn-primary' : 'btn-outline-secondary'">🌙 Más tarde</button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 mt-2" v-loading="loading">

        <!-- Encabezado Mejorado -->
        <div class="row py-2 text-center bg-1 text-white rounded-top">
          <h4 class="col-3 fw-bold"> <strong>SALIDA</strong></h4>
          <h4 class="col-3 fw-bold"> <strong>LLEGADA</strong></h4>
          <h4 class="col-3 fw-bold">Asientos Disponibles</h4>
          <h4 class="col-2 fw-bold">Precio</h4>
          <span class="col-1"></span>
        </div>

        <!-- Lista de Viajes -->
        <div class="row">
          <div v-for="(programacion, index) in programacionesFiltradas" :key="index" class="col-md-12 card mb-3 shadow-sm border rounded-3">

            <div class="row g-3 p-3 align-items-center text-center text-md-start">
              <div class="col-12 col-md-3">
                <h5 class="fw-bold">{{ programacion.terminal_inicio_nombre }}</h5>
                <p class="text-muted fs-4">
                  <font-awesome-icon :icon="['fas', 'map-marker-alt']" /> {{ formatearHora(programacion.hora_inicio) }}
                </p>
              </div>

              <div class="col-12 col-md-1 text-success">
                <font-awesome-icon :icon="['fas', 'arrow-right']" size="lg" />
              </div>

              <div class="col-12 col-md-3">
                <h5 class="fw-bold">{{ programacion.terminal_destino_nombre }}</h5>
                <p class="text-muted fs-4">
                  <font-awesome-icon :icon="['fas', 'map-marker-alt']" /> {{ formatearHora(programacion.hora_fin) }}
                </p>
              </div>

              <div class="col-6 col-md-2">
                <h6 class="fw-bold">{{ programacion.asientos_libres }} Asientos</h6>
                <span class="text-muted small">{{ programacion.tipo_asiento }}°120</span>
              </div>

              <div class="col-6 col-md-2 text-center">
                <p class="fw-bold text-danger fs-5">S/ {{ programacion.precio }}</p>
                <small class="text-muted">Ida desde</small>
              </div>

              <div class="col-12 col-md-1">
                <button class="btn btn-outline-success w-100" @click="elegirAsiento(programacion)">Elegir Asiento</button>
              </div>

              <div class="col-12 text-center mt-2">
                <p class="text-muted small">Duración: {{ formatearDuracion(programacion.duracion) }} Aproximadamente</p>
                <span v-for="servicio in programacion.servicios" :key="servicio" class="mx-1">
          <font-awesome-icon :icon="['fas', servicio]" class="text-secondary" />
        </span>
              </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
import { useApi } from '@/composables/useApi';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';

export default {
  name: 'HomeAqp',
  setup() {
    const { api } = useApi();
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);

    const origenes = ref([]);
    const destinos = ref([]);
    const origenSeleccionado = ref('');
    const destinoSeleccionado = ref('');
    const destinosFiltrados = ref([]);
    const programaciones = ref([]);
    const fecha = ref(new Date().toLocaleDateString('fr-CA')); // Formato YYYY-MM-DD
    const fechaRetorno = ref('');
    const filtroActivo = ref({ campo: 'hora_inicio', orden: 'asc' });

    onMounted(() => {
      console.log('Componente montado');
      listarOrigenesDestinos();
    });

    const programacionesFiltradas = computed(() => {
      return [...programaciones.value].sort((a, b) => {
        let resultado = 0;

        switch (filtroActivo.value.campo) {
          case 'precio':
            resultado = parseFloat(a.precio) - parseFloat(b.precio);
            break;
          case 'duracion':
            resultado = parseInt(a.duracion) - parseInt(b.duracion);
            break;
          case 'hora_inicio':
            resultado = convertirHora(a.hora_inicio) - convertirHora(b.hora_inicio);
            break;
        }

        return filtroActivo.value.orden === 'asc' ? resultado : -resultado;
      });
    });

    const ordenarPor = (campo, orden = "asc") => {
      filtroActivo.value = { campo, orden };
      console.log("Ordenando por:", filtroActivo.value);
    };

    const convertirHora = (hora) => {
      const [horas, minutos] = hora.split(':').map(Number);
      return horas * 60 + minutos;
    };

    const formatearDuracion = (minutos) => {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return horas > 0 ? `${horas}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins} min`;
    };

    // Función para convertir la hora a formato AM/PM
    const formatearHora = (hora) => {
      if (!hora) return "";

      // Suponiendo que `hora` viene en formato "HH:mm:ss"
      const [hour, minute] = hora.split(":").map(Number);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12; // Convierte 0 a 12

      return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    const listarOrigenesDestinos = async () => {
      try {
        const { data } = await api.get('/api/transporte/origenes-destinos');
        origenes.value = data.origenes;
        destinos.value = data.destinos;
      } catch (error) {
        console.error('Error al obtener rutas:', error);
      }
    };

    const filtrarDestinos = () => {
      destinosFiltrados.value = destinos.value.filter(destino => destino.id !== origenSeleccionado.value);
    };

    const buscarProgramaciones = async () => {
      try {
        loading.value = true
        const { data } = await api.post('/api/transporte/programaciones', {
          fecha_salida: fecha.value,
          origenSeleccionado: origenSeleccionado.value,
          destinoSeleccionado: destinoSeleccionado.value,
        });

        if (data.programaciones?.length) {
          const horarios = data.programaciones.flatMap(p => p.horarios);
          programaciones.value = horarios.filter(h =>
              Number(h.transporteTerminalOrigenId) === Number(origenSeleccionado.value) &&
              Number(h.transporteTerminalDestinoId) === Number(destinoSeleccionado.value)
          );

          console.log(data.programaciones)
          if (!programaciones.value.length) {
            console.error('No se encontraron horarios disponibles.');
          }
        } else {
          console.error('No se encontraron programaciones en la API.');
          programaciones.value = [];
        }
        loading.value = false
      } catch (error) {
        loading.value = false
        console.error('Error al obtener programaciones:', error);
        programaciones.value = [];
      }
    };

    function elegirAsiento(programacion) {
      router.push({
        name: 'Seats',
        query: { programacion: encodeURIComponent(JSON.stringify(programacion)) }
      });
    }

    return {
      loading,
      origenes,
      destinos,
      origenSeleccionado,
      destinoSeleccionado,
      destinosFiltrados,
      fecha,
      formatearHora,
      fechaRetorno,
      programaciones,
      programacionesFiltradas,
      ordenarPor,
      filtroActivo,
      formatearDuracion,
      listarOrigenesDestinos,
      filtrarDestinos,
      buscarProgramaciones,
      elegirAsiento
    };
  },
};
</script>


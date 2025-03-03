<template>
  <div class="container py-4">
    <div class="card p-4 shadow">
      <h2 class="text-1 text-center mb-3">Busca tu pasaje</h2>
      <div class="row g-2 align-items-center">
        <!-- ORIGEN -->
        <div class="col-lg-3 col-md-6">
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
        <div class="col-lg-3 col-md-6">
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
        <div class="col-lg-2 col-md-6">
          <label class="form-label">Fecha de ida</label>
          <input v-model="fecha" type="date" class="form-control" />
        </div>

        <!-- FECHA DE RETORNO -->
        <div class="col-lg-2 col-md-6">
          <label class="form-label">Fecha de retorno</label>
          <div class="input-group">
            <input v-model="fechaRetorno" type="date" class="form-control" />
            <button v-if="fechaRetorno" class="btn btn-danger" @click="fechaRetorno = ''">
              ❌
            </button>
          </div>
        </div>

        <!-- BOTÓN BUSCAR -->
        <div class="col-lg-2 col-md-12 text-center mt-3 mt-lg-0">
          <button class="btn btn-success bg-1 w-100" @click="buscarProgramaciones">Buscar</button>
        </div>
      </div>
    </div>


    <div class="card p-4 shadow mt-4">
      <div class="row">
    <!-- Título -->
    <div class="col-12 text-center mb-4">
      <h3>Disponibilidad de viaje</h3>
    </div>

    <!-- Contenedor de la tabla -->
    <div class="col-md-12">
      <div class="row table-header">
        <div class="col-3"><strong>Origen</strong></div>
        <div class="col-3"><strong>Destino</strong></div>
        <div class="col-2 text-center"><strong>Asientos Disponibles</strong></div>
        <div class="col-2 text-center"><strong>Precio</strong></div>
        <div class="col-2 text-center"><strong>Acciones</strong></div>
      </div>

      <!-- Aquí se agregarán las filas dinámicamente -->
      <div v-for="(programacion, index) in programaciones" :key="index" class="row table-row">
        <div class="col-3">{{ programacion.terminal_inicio_nombre }}</div>
        <div class="col-3">{{ programacion.terminal_destino_nombre }}</div>
        <div class="col-2 text-center">8</div>
        <div class="col-2 text-center">{{ programacion.precio }}</div>
        <div class="col-2 text-center">
          <button class="btn btn-primary btn-sm">Seleccionar</button>
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
import { onMounted, ref } from "vue";

export default {
  name: 'HomeAqp',
  setup() {
    const { api } = useApi();
    const store = useStore();
    const router = useRouter();
    const origenes = ref([]);
    const destinos = ref([]);
    const origenSeleccionado = ref('');
    const destinoSeleccionado = ref('');
    const destinosFiltrados = ref([]);
    const programaciones = ref([]);
    const fecha = ref('');
    const rutas = ref([]); // <-- Se devuelve en return

    onMounted(() => {
      console.log('Componente montado');
      listarOrigenesDestinos();
    });
    async function listarOrigenesDestinos() {
      try {
        const { data } = await api.get('/transporte/origenes-destinos');
        origenes.value = data.origenes;
        destinos.value = data.destinos;
      } catch (error) {
        console.error("Error al obtener rutas:", error);
      }
    }
    function filtrarDestinos() {
      destinosFiltrados.value = destinos.value.filter(destino => destino.id !== origenSeleccionado.value);
    }

    async function buscarProgramaciones() {
      try {
        const { data } = await api.post('/transporte/programaciones', {
          fecha_salida: fecha.value,
          origenSeleccionado: origenSeleccionado.value,
          destinoSeleccionado: destinoSeleccionado.value,
        });

        // Verificar si 'data.programaciones' y 'data.programaciones.horarios' existen antes de asignar
        if (data.programaciones && data.programaciones.length > 0) {
          // Extraer los horarios
          const horarios = data.programaciones[0].horarios;

          // Verificar y comparar las terminales con los valores seleccionados
          const horariosFiltrados = horarios.filter((horario) => {
            return Number(horario.transporteTerminalOrigenId) === Number(origenSeleccionado.value) &&
            Number(horario.transporteTerminalDestinoId) === Number(destinoSeleccionado.value);

          });

          // Asignar los horarios filtrados
          programaciones.value = horariosFiltrados;

          console.log(programaciones)

          if (horariosFiltrados.length === 0) {
            console.error("No se encontraron horarios que coincidan con los parámetros.");
            programaciones.value = [];
          }
        } else {
          console.error("No se encontraron programaciones en la respuesta de la API.");
          programaciones.value = [];
        }
      } catch (error) {
        console.error("Error al obtener programaciones:", error);
        programaciones.value = [];
      }
    }

    return {
      origenes,
      destinos,
      origenSeleccionado,
      destinoSeleccionado,
      destinosFiltrados,
      fecha,
      rutas,
      filtrarDestinos,
      buscarProgramaciones,
      programaciones
    };
  },
};
</script>

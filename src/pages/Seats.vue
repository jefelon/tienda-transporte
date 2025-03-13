<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 card p-4 shadow">
        <h2 class="text-1 text-center mb-3">Selecciona los asientos</h2>

        <!-- Contenedor original del bus -->
        <div v-if="programacion" class="mt-2" :style="{ position: 'relative', width: programacion.ancho_vehiculo + 'px', height: '210px', margin: '0 auto' }">
          <div class="bus">
            <!-- Imagen trasera del bus -->
            <img v-if="programacion && programacion.image_back" :src="programacion.image_back" alt="Frente del bus"/>
            <img v-else src="../assets/image_back.png" alt="Frente del bus"/>

            <div style="flex:1">
              <div ref="content" class="content-bus">
                <!-- Botones de asientos -->
                <div class="element">
                  <button
                      v-for="asiento in asientos"
                      :key="asiento.id"
                      :disabled="asiento.estado !== '1'"
                      @click="!['sv', 'sb', 'ses'].includes(asiento.type) && toggleSeat(asiento)"
                      :class="[
                        'seat',
                        'btn',
                        'btn-light',
                        { selected: isSelected(asiento) },
                        asiento.type === 'sv'
                        ? 'seat-tv'
                        : asiento.type === 'sb'
                        ? 'seat-banio'
                        : asiento.type === 'ses'
                        ? 'seat-escalera'
                        : 'seat-default'
                      ]"
                      :style="{
                        position: 'absolute',
                        top: asiento.type === 'ses'
                          ? (parseInt(asiento.top) + 27) + 'px'
                          : asiento.top,
                        left: asiento.left
                      }"
                  >
                    <template v-if="!['sv', 'sb', 'ses'].includes(asiento.type)">
                      {{ asiento.numero_asiento }}
                    </template>
                  </button>
                </div>
              </div>
            </div>

            <!-- Imagen frontal del bus -->
            <img v-if="programacion && programacion.image_front" :src="programacion.image_front" alt="Frente del bus"/>
            <img v-else src="../assets/image_front.png" alt="Frente del bus"/>
          </div>
        </div>

      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 p-4 shadow">
        <h3>Asientos seleccionados</h3>
        <!-- Fila que contendrá las tarjetas -->
        <div class="row">
          <div v-if="selectedSeats.length" v-for="(seat, index) in selectedSeats" :key="seat.id" class="col-md-6 mb-3">
            <div class="card">
              <div class="card-header d-flex justify-content-between align-items-center">
                <div class="pasajero_asiento icono">
                  <span class="pasajero_nasiento">Asiento: {{ seat.asiento }}</span>
                </div>
                <div class="icono rojo" @click="removeSeat(index)" style="cursor: pointer;">
                  <span class="tooltip_borrar">Borrar</span>
                  <svg class="tacho" viewBox="0 0 448 512" style="width: 20px; height: 20px;">
                    <path fill="currentColor"
                          d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z">
                    </path>
                  </svg>
                </div>
              </div>
              <div class="card-body">
                <form class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Tipo Documento</label>
                    <select class="form-select" v-model="seat.tipoDocumento">
                      <option value="19">DNI</option>
                      <option value="20">Carnet de Extranjeria</option>
                      <option value="21">Pasaporte</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">N° Documento</label>
                    <div class="input-group">
                      <input type="text" maxlength="8" class="form-control" placeholder="Documento" v-model="seat.numeroDocumento">
                      <button class="btn btn-outline-secondary" type="button">Buscar</button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" placeholder="Nombre" v-model="seat.nombres">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Apellidos</label>
                    <input type="text" class="form-control" placeholder="Paterno" v-model="seat.apellidos">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Correo</label>
                    <input type="email" class="form-control" placeholder="Correo" v-model="seat.correo">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Celular</label>
                    <input type="tel" class="form-control" placeholder="Celular" v-model="seat.celular">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Sexo</label>
                    <select class="form-select" v-model="seat.sexo">
                      <option value="F">Mujer</option>
                      <option value="M">Hombre</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Edad</label>
                    <input type="number" class="form-control" v-model="seat.edad">
                  </div>
                </form>
              </div>
              <div class="card-footer">
                <div class="d-flex justify-content-end">
                  <strong>Precio: S/ 95</strong>
                </div>
              </div>
            </div><!-- /.card -->
          </div><!-- /.col-md-6 -->
        </div><!-- /.row -->
      </div><!-- /.col-12 .col-lg-10 -->
    </div><!-- /.row .justify-content-center -->

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useSeats } from '@/composables/useSeats'
import { useStore } from '@/store'

export default {
  name: 'SeatsAqp',
  setup() {
    const store = useStore()
    const { asientos, fetchAsientos, reservarAsiento, programacion } = useSeats()

    // Función para reservar (si es necesaria)
    async function reservar(asiento) {
      const response = await reservarAsiento(asiento.id)
      if (response.success) {
        store.addAsiento(asiento)
        asiento.estado = 'reservado'
      }
    }

    // Array reactivo para asientos seleccionados
    const selectedSeats = ref([])

    // Función para seleccionar/deseleccionar asientos
    function toggleSeat(asiento) {
      if (asiento.estado !== '1') return
      const index = selectedSeats.value.findIndex(s => s.id === asiento.id)
      if (index === -1) {
        selectedSeats.value.push({
          id: asiento.id,
          asiento: asiento.numero_asiento,
          tipoDocumento: '19',
          numeroDocumento: '',
          nombres: '',
          paterno: '',
          materno: '',
          correo: '',
          celular: '',
          sexo: '',
          fechaNacimiento: ''
        })
      } else {
        selectedSeats.value.splice(index, 1)
      }
    }

    // Función para verificar si un asiento está seleccionado
    function isSelected(asiento) {
      return selectedSeats.value.some(s => s.id === asiento.id)
    }

    // Función para eliminar un asiento de la lista de seleccionados
    function removeSeat(index) {
      selectedSeats.value.splice(index, 1)
    }

    // Cargar asientos al iniciar
    fetchAsientos()

    // Variables de entorno
    const domain = import.meta.env.VITE_API_URL // "https://transporte.pse.aqpfact.pe"
    const tenant = import.meta.env.VITE_API_RUC   // "20000000001"

    // Asegurarse de que el dominio incluya el protocolo
    const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`
    // Construcción de la URL completa para el socket
    const socketUrl = `${baseUrl}:2053/${tenant}`
    console.log("Conectando a socket en:", socketUrl)

    // Conexión al socket
    const socket = io(socketUrl, { transports: ['websocket'] })

    // Logs para confirmar la conexión y posibles errores
    socket.on('connect', () => {
      console.log('Socket conectado:', socket.id)
    })

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err)
    })

    // Escucha del evento "venta-completada"
    onMounted(() => {
      socket.on('venta-completada', (data) => {
        console.log('Evento "venta-completada" recibido:', data)
        // Como se recibe un valor booleano, se recarga la lista de asientos para actualizar su estado
        if (data === true) {
          console.log('Venta completada, actualizando asientos...')
          fetchAsientos()
        }
      })
    })

    onUnmounted(() => {
      socket.disconnect()
      console.log('Socket desconectado')
    })

    return {
      asientos,
      programacion,
      reservar,
      selectedSeats,
      toggleSeat,
      isSelected,
      removeSeat,
    }
  }
}
</script>


<style scoped>
/* Código original para el bus y asientos */
.bus {
  width: 100%;
  height: 102%;
  position: absolute;
  overflow: hidden;
  background-color: #ffff;
  display: flex;
}

.content-bus {
  position: relative;
  width: 100%;
  height: 100%;
  border-bottom: 1px solid #bebdbd;
  border-top: 1px solid #a6a4a4;
}

.element {
  width: 51px;
  height: 38px;
  position: absolute;
  text-align: center;
  cursor: move;
  z-index: 1;
}

.seat {
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.7em;
  background: #fff;
  color: rgb(88, 40, 133);
  border: 0;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px;
  transition: 0.2s;
}

.seat:hover {
  box-shadow: rgba(0, 0, 0, 0.75) 0px 0px 0.5rem;
  transform: scale(1.1);
  z-index: 1000;
}

.seat:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

/* Estilo para el asiento seleccionado */
.seat.selected {
  background-color: #ffc107;
}

.seat-banio ,.seat-tv, .seat-escalera {
  cursor: default;
  background-color: transparent;
  box-shadow: none;
  transform: none;
  z-index: 501;
  border-radius: 0;
  color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
}
.seat-banio:hover ,.seat-tv:hover, .seat-escalera:hover , seat-banio:active ,.seat-tv:active, .seat-escalera:active {
  background-color: transparent;
  box-shadow: none;
  transform: none;
  z-index: 500;
  border-radius: 0;
  color: transparent;
}

.seat-banio {
  background-image: url("/src/assets/banio.svg");
}
.seat-tv {
  background-image: url("/src/assets/tv.svg");
  width: 2.2rem;
}
.seat-escalera {
  background-image: url("/src/assets/escalera.svg");
}

</style>

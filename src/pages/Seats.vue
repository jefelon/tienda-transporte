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
          <div v-if="selectedSeats.length" v-for="(seat, index) in selectedSeats" :key="seat.asiento_id" class="col-md-6 mb-3">
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
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Tipo Documento</label>
                    <select class="form-select" v-model="seat.identity_document_type_id">
                      <option value="1">DNI</option>
                      <option value="4">Carnet de Extranjeria</option>
                      <option value="7">Pasaporte</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">N° Documento</label>
                    <div class="input-group">
                      <input type="text" maxlength="8" class="form-control" placeholder="Documento" v-model="seat.number">
                      <button class="btn btn-secondary"  :disabled="seat.identity_document_type_id!=='1'" type="button" @click="consultar(seat)">Buscar</button>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <label class="form-label">Apellidos y nombres</label>
                    <input type="text" class="form-control" placeholder="Paterno" v-model="seat.name">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Correo</label>
                    <input type="email" class="form-control" placeholder="Correo" v-model="seat.email">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Celular</label>
                    <input type="tel" class="form-control" placeholder="Celular" v-model="seat.telephone">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Edad</label>
                    <input type="number" class="form-control" v-model="seat.edad">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Confirma</label>
                    <el-button
                        type="warning"
                        :loading="loading"
                        class="form-control"
                        @click="confirmarPasajero(seat)">
                      Confirmar pasajero
                    </el-button>
                  </div>
                </div>
              </div>
              <div class="card-footer text-center">
                <div class="precio">
                  <strong>Precio: S/ 95</strong>
                </div>
              </div>
            </div><!-- /.card -->
          </div><!-- /.col-md-6 -->
        </div><!-- /.row -->

        <div class="row mt-5">
          <div class="col-md-12 text-center">
            <div class="form-check form-switch d-inline-block" style="transform: scale(1.5);">
              <input class="form-check-input" type="checkbox" role="switch" id="switchFactura" v-model="deseaFactura" />
              <label class="form-check-label ms-2" for="switchFactura">¿Desea factura?</label>
            </div>
          </div>
          <div v-if="deseaFactura" class="row mt-3 text-center">
            <div class="col-md-2">
              <input type="text" v-model="datosFactura.ruc" class="form-control" placeholder="RUC" @change="buscarEmpresa" />
            </div>
            <div class="col-md-4">
              <input type="text" v-model="datosFactura.razonSocial" class="form-control" placeholder="Razón Social" />
            </div>
            <div class="col-md-6">
              <input type="text" v-model="datosFactura.direccion" class="form-control" placeholder="Dirección" />
            </div>
          </div>
          <div class="col-12 text-center mt-5">
            <button class="btn btn-success w-50" @click="pagar">Pagar</button>
          </div>
        </div>

      </div><!-- /.col-12 .col-lg-10 -->
    </div><!-- /.row .justify-content-center -->

  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, reactive} from 'vue'
import { io } from 'socket.io-client'
import { useSeats } from '@/composables/useSeats'
import { useStore } from '@/store'
import { ElNotification } from 'element-plus'


    const loading = ref(false)
    const deseaFactura = ref(false);
    const datosFactura = reactive({
      ruc: '',
      razonSocial: '',
      direccion: '',
      ubigeo :''
    });
    const store = useStore()
    const { asientos, fetchAsientos, reservarAsiento, programacion, consultarCliente, guardarPasajero, generarComprobante } = useSeats()

    //funcion para obtener datos de la persona o empresa
    async function consultar(seat) {
      try {
        const response = await consultarCliente(seat.identity_document_type_id, seat.number);
        if (response.success) {
          const data = response.data;
          console.log(data);
          seat.pasajero_id = data.id;
          seat.name = data.name;
          seat.edad = data.edad ?? '';
          seat.telephone = data.telephone ?? '';
          seat.email = data.email ?? '';
        }
      } catch (error) {
        console.error("Error consultando al cliente:", error);
      }
    }

    async function buscarEmpresa(){
      try {
        if(datosFactura.ruc.length===11){
          const response = await consultarCliente(6, datosFactura.ruc);
          if (response.success) {
            const data = response.data;
            console.log(data);
            datosFactura.razonSocial = data.name
            datosFactura.direccion = data.address
            datosFactura.ubigeo = data.ubigeo
          }
        }

      } catch (error) {
        console.error("Error consultando al cliente:", error);
      }
    }

    // función para confirmar el pasajero
    async function confirmarPasajero(seat) {
      if (!seat.number) {
        return mostrarNotificacion("error", "Complete el número de documento del pasajero");
      }
      if (!seat.name) {
        return mostrarNotificacion("error", "Complete el nombre del pasajero");
      }
      if (!seat.edad) {
        return mostrarNotificacion("error", "Complete la edad del pasajero");
      }
      if (!seat.email) {
        return mostrarNotificacion("error", "Complete el correo del pasajero");
      }
      if (!seat.telephone) {
        return mostrarNotificacion("error", "Complete el celular del pasajero");
      }

      loading.value = true
      try {
        const pasajero = {
          country_id: "PE",
          type: "customers",
          identity_document_type_id: seat.identity_document_type_id,
          number: seat.number,
          name: seat.name,
          edad: seat.edad,
          telephone: seat.telephone,
          email:seat.email
        };

        const response = await guardarPasajero(pasajero);
        if (response.success) {
          seat.pasajero_id = response.id;
          mostrarNotificacion("success", "Pasajero confirmado exitosamente");
          console.log("Pasajero modificado el id:", seat);
        }
      } catch (error) {
        console.error("Error al generar boletas:", error);
      } finally {
        loading.value = false
      }
    }
    //función para procesar pago
    async function pagar() {
      if (selectedSeats.value.length === 0) {
        console.error("No se han seleccionado asientos");
        return;
      }

      // Mapeamos cada asiento seleccionado a la estructura de boleta
      const boletas = selectedSeats.value.map(seat => {
        // Convertir el precio a número
        const precio = parseFloat(seat.precio);
        const porcentaje_igv = 18.00;
        // Calculamos la base imponible y el impuesto
        const valorventa = precio / 1.18;
        const igv = precio - valorventa;

        return {
          // Datos del comprobante
          serie_documento: deseaFactura ? seat.serie_factura : seat.serie_boleta,
          numero_documento: "#", // Aquí podrías aplicar lógica de numeración
          fecha_de_emision: new Date().toLocaleDateString('en-CA'),
          hora_de_emision: new Date().toLocaleTimeString('en-GB'),
          codigo_tipo_operacion: "0101",
          codigo_tipo_documento: deseaFactura ? '01' : '03',
          codigo_tipo_moneda: "PEN",
          fecha_de_vencimiento: new Date().toISOString().split("T")[0],
          // Datos del cliente, extraídos del asiento seleccionado
          datos_del_cliente_o_receptor: {
            codigo_tipo_documento_identidad: deseaFactura ? '6': seat.identity_document_type_id,
            numero_documento: deseaFactura ? datosFactura.ruc : seat.number,
            apellidos_y_nombres_o_razon_social: deseaFactura ? datosFactura.razonSocial: seat.name,
            codigo_pais: "PE",
            ubigeo: deseaFactura ? datosFactura.ubigeo : '',
            direccion: deseaFactura ? datosFactura.direccion : '',
            correo_electronico: seat.email,
            telefono: seat.telephone
          },
          // Totales de la boleta
          totales: {
            total_exportacion: 0.00,
            total_operaciones_gravadas: (programacion.pasaje_afecto_igv === 1) ? valorventa : 0.00,
            total_operaciones_inafectas: 0.00,
            total_operaciones_exoneradas: (programacion.pasaje_afecto_igv === 1) ? 0.00 : precio,
            total_operaciones_gratuitas: 0.00,
            total_igv: (programacion.pasaje_afecto_igv === 1) ? igv : 0.00,
            total_impuestos: (programacion.pasaje_afecto_igv === 1) ? igv : 0.00,
            total_valor: (programacion.pasaje_afecto_igv === 1) ? valorventa : precio,
            total_venta: precio
          },
          // Items: detalle del pasaje
          items: [
            {
              codigo_interno: seat.codigo_item,
              descripcion: seat.nombre_item,
              codigo_producto_sunat: "",
              codigo_producto_gsl: "",
              unidad_de_medida: "ZZ",
              cantidad: 1,
              valor_unitario: (programacion.pasaje_afecto_igv === 1) ? valorventa : precio,
              codigo_tipo_precio: "01",
              precio_unitario: precio,
              codigo_tipo_afectacion_igv: (programacion.pasaje_afecto_igv === 1) ? "10" : "20",
              total_base_igv: (programacion.pasaje_afecto_igv === 1) ? valorventa : precio,
              porcentaje_igv: (programacion.pasaje_afecto_igv === 1) ? porcentaje_igv : 0.00,
              total_igv: (programacion.pasaje_afecto_igv === 1) ? igv : 0.00,
              total_impuestos: (programacion.pasaje_afecto_igv === 1) ? igv : 0.00,
              total_valor_item: (programacion.pasaje_afecto_igv === 1) ? valorventa : precio,
              total_item: precio,
            }
          ],
          // Datos adicionales para guardar el pasaje
          pasajero_id: seat.pasajero_id,
          cliente_id: seat.cliente_id,
          asiento_id: seat.asiento_id,
          asiento_numero: seat.asiento,
          identity_document_type_id: seat.identity_document_type_id,
          number: seat.number,
          name: seat.name,
          email: seat.email,
          telephone: seat.telephone,
          edad: seat.edad,
          precio : seat.precio,
          vehiculo_ruta_id: seat.vehiculo_ruta_id,
          origen_id: seat.origen_id,
          destino_id: seat.destino_id,
          padre: [],
          ninios: [],
          fecha_salida:seat.fecha_salida
        }
      });

      try {
        const responses = [];
        for (const boleta of boletas) {
          const response = await generarComprobante(boleta);
          responses.push(response);
          // Retardo de 1 segundo entre cada boleta (ajusta el tiempo según tus necesidades)
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log("Boletas generadas:", responses);
        socket.emit('venta-completada', true);
        // Aquí puedes limpiar selectedSeats o redirigir según corresponda
      } catch (error) {
        console.error("Error al generar boletas:", error);
      }
    }

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
      const index = selectedSeats.value.findIndex(s => s.asiento_id === asiento.id)
      if (index === -1) {
        selectedSeats.value.push({
          asiento_id: asiento.id,
          asiento: asiento.numero_asiento,
          pasajero_id:null,
          cliente_id:null,
          identity_document_type_id: '1',
          number: '',
          name: '',
          email: '',
          telephone: '',
          edad: '',
          precio: asiento.precio,
          vehiculo_ruta_id: programacion.vehiculo_ruta_id,
          origen_id: programacion.transporteTerminalOrigenId,
          destino_id: programacion.transporteTerminalDestinoId,
          fecha_salida :programacion.fecha_salida,
          codigo_item:programacion.codigo_item,
          nombre_item:programacion.nombre_item,
          serie_boleta:programacion.serie_boleta,
          serie_factura:programacion.serie_factura
        })
      } else {
        selectedSeats.value.splice(index, 1)
      }

      console.log("selectedSeats")
      console.log(selectedSeats)
    }

    // Función para verificar si un asiento está seleccionado
    function isSelected(asiento) {
      return selectedSeats.value.some(s => s.asiento_id === asiento.id)
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

    //Conexión al socket
    const socket = io(socketUrl, { transports: ['websocket'] })

    //Logs para confirmar la conexión y posibles errores
    socket.on('connect', () => {
      console.log('Socket conectado:', socket.id)
    })

    socket.on('connect_error', (err) => {
      console.error('Error de conexión:', err)
    })

    //Escucha del evento "venta-completada"
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

    function mostrarNotificacion(type, message) {
      ElNotification({
        title: "Mensaje",
        message: message,
        type: type,
        position: "top-left"
      })
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

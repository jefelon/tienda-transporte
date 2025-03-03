import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles.css';

/* Importar el núcleo de Font Awesome */
import { library } from '@fortawesome/fontawesome-svg-core';

/* Importar el componente FontAwesomeIcon */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* Importar todas las colecciones de iconos */
import { fas } from '@fortawesome/free-solid-svg-icons';  // Iconos sólidos
import { far } from '@fortawesome/free-regular-svg-icons'; // Iconos regulares
import { fab } from '@fortawesome/free-brands-svg-icons';  // Iconos de marcas

/* Agregar todos los iconos a la librería */
library.add(fas, far, fab);

const app = createApp(App);
app.use(router);
app.use(createPinia());

// Registrar el componente FontAwesomeIcon globalmente
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');

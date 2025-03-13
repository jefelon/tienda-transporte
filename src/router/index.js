import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Search from '@/pages/Search.vue';
import Seats from '@/pages/Seats.vue';
import Checkout from '@/pages/Checkout.vue';
import Success from '@/pages/Success.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/buscar', name: 'Search', component: Search },
    { path: '/asientos', name: 'Seats', component: Seats, props: route => ({
            programacion: route.query.programacion ? JSON.parse(decodeURIComponent(route.query.programacion)) : null
        })
    },
    { path: '/checkout', name: 'Checkout', component: Checkout },
    { path: '/exito', name: 'Success', component: Success },
];

export default createRouter({
    history: createWebHistory(),
    routes,
});
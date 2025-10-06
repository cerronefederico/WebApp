import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import 'animate.css'
import router from './router'
import { createPinia } from 'pinia';
import { useWebSocketStore } from './stores/webSoket';
import VueApexCharts from 'vue3-apexcharts';


import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.use(VueApexCharts);
const wsStore = useWebSocketStore();
wsStore.connect();


app.mount('#app')

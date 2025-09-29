import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'
import 'animate.css'
import router from './router'
import { createPinia } from 'pinia';
import { useWebSocketStore } from './stores/webSoket'; // Importa il gestore WS


import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia();
app.use(router);
app.use(pinia);
app.mixin({
    mounted() {
        const wsStore = useWebSocketStore();
        // Connette solo se non è già connesso, garantendo un'unica chiamata
        if (!wsStore.isConnected) {
            wsStore.connect();
        }
    },
    beforeUnmount() {
        const wsStore = useWebSocketStore();
        // Disconnetti quando l'app viene chiusa/distrutta
        wsStore.disconnect();
    }
});

app.mount('#app')

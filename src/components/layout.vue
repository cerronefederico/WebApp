<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import SearchBar from "@/components/searchBar.vue";
import { useWebSocketStore} from '@/stores/webSoket'; // Importa lo store WS

const webSocketStore = useWebSocketStore();

</script>

<template>
    <header class="app-header-fixed">
        <div class="header-left">
          <MenuHamburgher></MenuHamburgher>
        </div>

        <!-- MODIFICA APPLICATA: Impostato 'to="/home"' per reindirizzare alla homepage/dashboard -->
        <div class="header-center">
            <router-link to="/home" class="logo-link">
                <img src="/img/logoApplicazione.png" alt="ModuView Logo" class="app-logo">
            </router-link>
        </div>

        <MenuAccount></MenuAccount>
    </header>
    <SearchBar></SearchBar>
  <div v-if="webSocketStore.isDataReady">
    <main class="app-content-wrapper">
      <router-view />
    </main>
  </div>
  <div v-else>
    <div class="d-flex justify-content-center align-items-center vh-100">
        <h1>Connessione ai dati in tempo reale in corso...</h1>
      <div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
  </div>
        </div>
  </div>
</template>

<style scoped>
/* Definisci le variabili di colore globali per coerenza */
:root {
  /* Palette basata sul colore richiesto: #2596BE (rgba(37, 150, 190)) */
  --color-primary: #14265a;      /* Header, Titoli, Branding */
  --color-accent-cta: #004f70;  /* Arancione brillante (CTA) */
  --color-secondary: #004F70;   /* Blu Scuro (per hover su elementi primari) */
}

.app-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1.5rem;
  height:auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 1000;
}

.header-left {
  flex-shrink: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
}

.header-center {
  flex-grow: 1;
  text-align: center;
  padding: 0 0.5rem;
  min-width: 0;
}

/* NUOVO STILE: Assicura che l'area cliccabile del logo sia pulita */
.logo-link {
    text-decoration: none; /* Rimuove la sottolineatura tipica dei link */
    cursor: pointer;
    display: inline-block;
    padding: 0;
    margin: 0;
}

.app-logo {
  max-height: 60px;
  width: auto;
  filter: drop-shadow(0 0 5px rgba(0,0,0,0.5));
}
.btn-outline-dark.search-btn {
    color: white !important;
    border-color: white !important;
    transition: all 0.3s ease;
}
.btn-outline-dark.search-btn:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: white !important;
}

.app-content-wrapper {
    padding-top: 100px;
    min-height: 100vh;
}
</style>

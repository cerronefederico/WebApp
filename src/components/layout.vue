<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import SearchBar from "@/components/searchBar.vue";
import { useWebSocketStore} from '@/stores/webSoket'; // Importa lo store WS

const webSocketStore = useWebSocketStore();
// Non c'è bisogno di chiamare connect qui, è già fatto in main.ts
</script>

<template>
    <header class="app-header-fixed">
        <div class="header-left">
          <MenuHamburgher></MenuHamburgher>
          </div>
        <div class="header-center">
          <img src="/img/logoApplicazione.png" alt="ModuView Logo" class="app-logo">
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
    padding-top: 100px; /* VALORE DA VERIFICARE! (es. 75px, 80px, 90px) */
    min-height: 100vh;
}
</style>
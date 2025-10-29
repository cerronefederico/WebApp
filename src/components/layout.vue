<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import SearchBar from "@/components/searchBar.vue";
import { useWebSocketStore} from '@/stores/webSoket';
import ToastsPage from "@/components/toastsPage.vue"; // Importa lo store WS

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

        <!-- Area destra: Pulsante Cerca e Menu Account -->
        <div class="header-right-actions">
          <!-- NUOVO PULSANTE RICERCA -->
          <button
            class="btn btn-search-header me-3"
            data-bs-toggle="modal"
            data-bs-target="#searchModal"
            title="Cerca PLC"
          >
            <i class="bi bi-search fs-5"></i>
          </button>

          <MenuAccount></MenuAccount>
        </div>
    </header>
    <SearchBar></SearchBar>
  <div v-if="webSocketStore.isDataReady">
    <main class="app-content-wrapper">
      <router-view />
    </main>
    <ToastsPage></ToastsPage>
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

  /* CRUCIALE: Usiamo 'space-between' per spingere i blocchi laterali
     e 'align-items: center' per l'allineamento verticale. */
  justify-content: space-between;
  align-items: center;

  background-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  z-index: 1040; /* Mantenuto il z-index corretto */
}

/* Modifica il blocco centrale per non avere 'flex-grow: 1' e usare 'margin: auto' */
.header-center {
  text-align: center;
  /* Utilizziamo i margini automatici per centrare il blocco del logo */
  margin-left: auto;
  margin-right: auto;
  padding: 0 0.5rem;
  min-width: 0;
}


/* Usiamo 'visibility: hidden' per il blocco che deve bilanciare */
.header-left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
  /* CORREZIONE PER IL BILANCIAMENTO: Imposta una larghezza fissa per il blocco di riferimento */
  width: 100px; /* Larghezza approssimativa del blocco hamburger + spazio */
}

/* Nuovo contenitore per il pulsante di ricerca e MenuAccount */
.header-right-actions {
  display: flex;
  align-items: center;
  /* CORREZIONE PER IL BILANCIAMENTO: Imposta una larghezza fissa uguale a 'header-left' */
  width: 100px; /* Deve avere la stessa larghezza di 'header-left' per centrare il contenuto */
  justify-content: flex-end; /* Allinea gli elementi a destra all'interno del blocco */
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

/* Stile per il NUOVO pulsante di ricerca nell'header */
.btn-search-header {
    background: transparent;
    color: white; /* Icona bianca su sfondo scuro */

    /* MODIFICHE RICHIESTE: Bordo bianco */
    border: 1px solid white;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;

    transition: background-color 0.3s ease, border-color 0.3s ease;
}

.btn-search-header:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Leggero sfondo all'hover */
    color: white;
    border-color: #f0f0f0; /* Bordo leggermente piÃ¹ chiaro all'hover */
}

.app-content-wrapper {
    padding-top: 100px;
    min-height: 100vh;
}
</style>
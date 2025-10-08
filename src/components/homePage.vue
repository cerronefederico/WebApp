<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import PlcElement from "@/components/plcElement.vue";
import SearchBar from "@/components/searchBar.vue";
import {computed, ref} from 'vue';
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import GraficoProduzione from "@/components/graficoProduzione.vue";

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

const totalAlerts = computed(() => {return plc1.getNumeroAllarmi + plc2.getNumeroAllarmi + plc3.getNumeroAllarmi;});
const totalWarnings = computed(() => {return plc1.getNumeroWarning + plc2.getNumeroWarning + plc3.getNumeroWarning;});
const totalOnline = computed(() => {
  let cont=0;
  if(plc1.getAcceso){cont++;}
  if(plc2.getAcceso){cont++;}
  if(plc3.getAcceso){cont++;}
  return cont;
});

// Dati fittizi per i grafici
const chartDataAlerts = ref([{
    name: "Allarmi",
    data: [10, 41, 35, 51, 49, 62, 69]
}]);
const chartDataNetwork = ref([{
    name: "Carico",
    data: [75] // Esempio per un gauge/radiale
}]);
</script>

<template>
<header class="app-header-fixed">
   <div class="header-left">
    <MenuHamburgher></MenuHamburgher>
     <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#searchModal">
        Ricerca&nbsp;<i class="bi bi-search"></i>
      </button>
    </div>
    <div class="header-center">
    <h1>ModuView</h1>
    </div>

  <MenuAccount></MenuAccount>
</header>
  <SearchBar></SearchBar>

  <div class="dashboard-layout">

    <aside class="sidebar-left">
        <h3 class="sidebar-title">Stato Generale</h3>

        <div class="kpi-panel">
            <span class="badge rounded-pill bg-danger shadow-sm p-3 fs-6 w-100 mb-3">
                <i class="bi bi-bell-fill"></i> Alerts: {{totalAlerts}}
            </span>

            <span class="badge rounded-pill bg-warning text-dark shadow-sm p-3 fs-6 w-100 mb-3">
                <i class="bi bi-exclamation-square-fill"></i> Warnings: {{totalWarnings}}
            </span>

            <span class="badge rounded-pill bg-success shadow-sm p-3 fs-6 w-100 mb-3">
                <i class="bi bi-check-circle-fill"></i> Online: {{totalOnline}}
            </span>
        </div>

        <h3 class="sidebar-title mt-4">Ultimo Allarme Rilevato</h3>
        <div class="chart-container">
            <MiniChart chartId="alerts-24h" :seriesData="chartDataAlerts" chartType="line" />
        </div>

    </aside>

    <main class="main-content-area">
        <PlcElement></PlcElement>
    </main>

    <aside class="sidebar-right">
        <h3 class="sidebar-title">Strumenti</h3>
        <button class="btn btn-outline-secondary w-100 mb-2">Allarmi attivi</button>
        <button class="btn btn-outline-secondary w-100 mb-4">Da Decidere</button>

        <h3 class="sidebar-title">Andamento Produzione</h3>
        <div class="chart-container-large">
             <GraficoProduzione />
        </div>

        <h3 class="sidebar-title mt-4">Filtri</h3>
        <p class="small text-muted">Filtra le card PLC:</p>
        <select class="form-select">
            <option>Mostra Tutti</option>
            <option>Solo Manutenzione</option>
            <option>Solo Produzione</option>
        </select>

    </aside>

  </div>
</template>

<style scoped>
.app-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.2rem 1.2rem;
  height:auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(125,125,125,1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
h1 {
  margin: 0;
  font-size: clamp(1.2rem, 3vw, 2.5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ----------------------------------------------------------------- */
/* STILI DEL LAYOUT A TRE COLONNE (Il core della soluzione)          */
/* ----------------------------------------------------------------- */
.dashboard-layout {
    display: grid;
    /* Colonna Fissa (280px) / Colonna Flessibile (1fr) / Colonna Fissa (280px) */
    grid-template-columns: 350px 1fr 350px;
    gap: 30px;
    /* Margine superiore per scendere sotto l'header fisso */
    padding: 100px 30px 20px 30px;
    min-height: calc(100vh - 100px);
    max-width: 1600px;
    margin: 0 auto;
}

/* FIX: Mantiene le card PLC strette e CENTRATE nella colonna centrale */
.main-content-area {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centra orizzontalmente il componente PlcElement */
    justify-self: center; /* Centra l'intera colonna main-content-area all'interno della cella grid */
    align-self: start;
    max-width: 850px; /* Larghezza massima definita per le card */
    width: 100%;
    padding: 0;
    margin: 0;
}

/* Stili delle Sidebar (per i contenuti aggiuntivi) */
.sidebar-left, .sidebar-right {
    padding: 15px;
    background-color: var(--color-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    height: fit-content;
    position: sticky; /* Le fa rimanere visibili in alto */
    top: 100px; /* Spazio sotto l'header */
    align-self: start;
}

.sidebar-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: var(--color-accent);
    border-bottom: 2px solid var(--color-border);
    padding-bottom: 5px;
}

/* Stili per ApexCharts */
.chart-container {
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
}

/* Adattamento per i badge KPI */
.kpi-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Media Query per schermi piccoli (Tablet/Mobile) */
@media (max-width: 1200px) {
    .dashboard-layout {
        /* Passa a una singola colonna */
        grid-template-columns: 1fr;
        padding: 100px 20px 20px 20px;
    }
    .sidebar-left, .sidebar-right {
        /* Nasconde le sidebar per dare spazio al contenuto centrale */
        display: none;
    }

    .main-content-area {
        max-width: 100%; /* Permette alle card di usare lo schermo intero */
    }
}
.chart-container-large {
    width: 100%;
    /* Rimuoviamo l'altezza fissa (es. height: 180px) se era presente,
       per lasciare che AreaChart si ridimensioni a 250px come definito nel componente. */
    margin-bottom: 20px;
    /* Puoi usare un po' di padding se necessario */
    padding: 5px;
}
</style>
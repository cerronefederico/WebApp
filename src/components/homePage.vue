<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import PlcElement from "@/components/plcElement.vue";
import SearchBar from "@/components/searchBar.vue";
import {computed, onMounted, onUnmounted, ref} from 'vue';
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import GraficoProduzione from "@/components/graficoProduzione.vue";
import AllarmOnModal from "@/components/allarmOnModal.vue";


const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

// 1. STATO DEL FILTRO
const selectedFilter = ref('TUTTI');

// 2. STRUTTURA DATI COMBINATA AGGIORNATA
// Ora usa plc.getStati[0].acceso e plc.getStati[0].blocco
const allPlcs = computed(() => [
  {
    id: 'PLC1',
    store: plc1,
    stato: {
      // ✅ Usa il primo elemento della lista getStati per 'acceso'
      acceso: plc1.getStati.length > 0 ? plc1.getStati[0].acceso : false,
      // ✅ Usa il primo elemento della lista getStati per 'inBlocco'
      inBlocco: plc1.getStati.length > 0 ? plc1.getStati[0].blocco : false,
    },
    image: '/img/provaPlcCard.png',
    route: '/home/plc1'
  },
  {
    id: 'PLC2',
    store: plc2,
    stato: {
      acceso: plc2.getStati.length > 0 ? plc2.getStati[0].acceso : false,
      inBlocco: plc2.getStati.length > 0 ? plc2.getStati[0].blocco : false,
    },
    image: '/img/provaPlcCard1.png',
    route: '/home/plc2'
  },
  {
    id: 'PLC3',
    store: plc3,
    stato: {
      acceso: plc3.getStati.length > 0 ? plc3.getStati[0].acceso : false,
      inBlocco: plc3.getStati.length > 0 ? plc3.getStati[0].blocco : false,
    },
    image: '/img/provaPlcCard2.png',
    route: '/home/plc3'
  }
]);

// 3. LOGICA DI FILTRAGGIO AGGIORNATA
const filteredPlcs = computed(() => {
  const filter = selectedFilter.value;

  if (filter === 'TUTTI') {
    return allPlcs.value;
  }

  return allPlcs.value.filter(plc => {
    // Estraiamo gli stati per chiarezza
    const { acceso, inBlocco } = plc.stato;

    switch (filter) {
      case 'ACCESE':
        // ✅ ACCESE: acceso è TRUE E blocco è FALSE
        return acceso && !inBlocco;
      case 'SPENTE':
        // ✅ SPENTE: accesso è FALSE (a prescindere da blocco)
        return !acceso;
      case 'BLOCCO':
        // ✅ BLOCCO: acceso è TRUE E blocco è TRUE
        return acceso && inBlocco;
      default:
        return true;
    }
  });
});

// Logiche KPI esistenti (aggiornate per 'Online')
const totalAlerts = computed(() => {return plc1.getNumeroAllarmi + plc2.getNumeroAllarmi + plc3.getNumeroAllarmi;});
const totalWarnings = computed(() => {return plc1.getNumeroWarning + plc2.getNumeroWarning + plc3.getNumeroWarning;});
const totalOnline = computed(() => {
  let cont=0;
  // Contiamo solo quelli Accesi E NON in Blocco
  if(plc1.getStati.length > 0 && plc1.getStati[0].acceso && !plc1.getStati[0].blocco){cont++;}
  if(plc2.getStati.length > 0 && plc2.getStati[0].acceso && !plc2.getStati[0].blocco){cont++;}
  if(plc3.getStati.length > 0 && plc3.getStati[0].acceso && !plc3.getStati[0].blocco){cont++;}
  return cont;
});


const oraCorrente = ref(Date.now());
let timer: number | null = null;

onMounted(() => {
  timer = setInterval(() => {
    oraCorrente.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer);
  }
});

const ultimoAllarmPlc = computed(() => {
    const _ = oraCorrente.value;

    return (plc: typeof plc1) => {
        const lista = plc.getNotificaAllarmi;
        const result: any[] = []
        if (!lista || lista.length === 0) {
            return result;
        }
        for (let i = 0; i < lista.length; i++) {
          if (lista[i].ora === lista[0].ora){
            result.push(lista[i]);
          }else {
            return result;
          }
        }
        return result;
    };
});

const formattedTime = computed(() => {
    return (index: string) => {
        const oraCompleta = index;

        if (!oraCompleta || typeof oraCompleta !== 'string') {
            return 'N/A';
        }

        const puntoIndex = oraCompleta.indexOf('.');

        if (puntoIndex !== -1) {
            return oraCompleta.substring(0, puntoIndex).replace('T', ' ');
        }

        const plusIndex = oraCompleta.indexOf('+');
        if (plusIndex !== -1) {
            return oraCompleta.substring(0, plusIndex).replace('T', ' ');
        }

        return oraCompleta.replace('T', ' ');
    };
});
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

  <div class="dashboard-layout position-absolute start-0">

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

        <h3 class="sidebar-title mt-4">Ultimi Allarmi Rilevati</h3>
      <div class="allarm-scroll-container">
      <div class="text-center">PLC1</div>
      <ul class="list-group">
  <li v-for="item in ultimoAllarmPlc(plc1)" :key="item.id" class="list-group-item">
    <div class="d-flex justify-content-between" :class="{ 'text-danger' : item.stato===true, 'text-success': item.stato===false}" >
      <div> {{item.id}}</div>
      <div>  {{formattedTime(item.ora)}}</div>
    </div>
  </li>
        <li v-if="ultimoAllarmPlc(plc1).length === 0" class="list-group-item text-muted">Nessun Allarme Rilevato.</li>
</ul>
            <div class="text-center">PLC2</div>
      <ul class="list-group">
  <li v-for="item in ultimoAllarmPlc(plc2)" :key="item.id" class="list-group-item">
    <div class="d-flex justify-content-between" :class="{ 'text-danger' : item.stato===true, 'text-success': item.stato===false}">
      <div> {{item.id}}</div>
      <div>  {{formattedTime(item.ora)}}</div>
    </div>
  </li>
        <li v-if="ultimoAllarmPlc(plc2).length === 0" class="list-group-item text-muted">Nessun Allarme Rilevato.</li>
</ul>
            <div class="text-center">PLC3</div>
      <ul class="list-group">
  <li v-for="item in ultimoAllarmPlc(plc3)" :key="item.id" class="list-group-item">
    <div class="d-flex justify-content-between" :class="{ 'text-danger' : item.stato===true, 'text-success': item.stato===false}">
      <div> {{item.id}}</div>
      <div>  {{formattedTime(item.ora)}}</div>
    </div>
  </li>
        <li v-if="ultimoAllarmPlc(plc3).length === 0" class="list-group-item text-muted">Nessun Allarme Rilevato.</li>
</ul>
      </div>
    </aside>

    <main class="main-content-area">
        <PlcElement :plcs="filteredPlcs"></PlcElement>
    </main>

    <aside class="sidebar-right">
        <h3 class="sidebar-title">Strumenti</h3>
        <button class="btn btn-outline-secondary w-100 mb-2" data-bs-toggle="modal" data-bs-target="#allarmOnModal">Allarmi attivi</button>
      <p class="small text-muted">Filtra le card PLC:</p>
        <select class="form-select" v-model="selectedFilter">
            <option value="TUTTI">Mostra Tutti</option>
            <option value="ACCESE">Solo Accese</option>
            <option value="SPENTE">Solo Spente</option>
            <option value="BLOCCO">Solo In Blocco</option>
        </select>

        <h3 class="sidebar-title">Andamento Produzione</h3>
        <div class="chart-container-large">
          <GraficoProduzione></GraficoProduzione>
        </div>
    </aside>
  </div>
  <AllarmOnModal></AllarmOnModal>
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
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;

    padding: 100px 15px 20px 15px;
    min-height: calc(100vh - 100px);

    grid-template-columns: minmax(250px, 380px) minmax(450px, 550px) minmax(250px, 380px);
    gap: 20px;
    margin-left: 175px;
}

.main-content-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: start;

    max-width: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
}

.sidebar-left, .sidebar-right {
    padding: 10px;
    background-color: var(--color-card-bg);
    border-radius: 8px;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
    height: fit-content;
    position: sticky;
    top: 100px;
    align-self: start;
}

.sidebar-title {
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: var(--color-accent);
    border-bottom: 2px solid var(--color-border);
    padding-bottom: 2px;
}


/* Adattamento per i badge KPI */
.kpi-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Media Query per schermi piccoli (Tablet/Mobile) */
.chart-container-large {
    width: 100%;
}

.allarm-scroll-container {
    /* Imposta l'altezza massima desiderata.
       Ho usato 400px, puoi regolarla come preferisci. */
    max-height: 250px;

    /* Fa comparire la barra di scroll verticale (y) solo se l'altezza massima è superata. */
    overflow-y: auto;

    /* Aggiunge un po' di padding per evitare che il testo sia troppo vicino alla barra di scroll */
    padding-right: 5px;
}
</style>
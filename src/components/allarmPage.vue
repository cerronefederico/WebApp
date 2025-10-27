<script setup lang="ts">
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import {computed, ref} from "vue";
import GraficoStoricoAllarmi from "@/components/graficoStoricoAllarmi.vue";

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

const activeCollapse = ref<string | null>(null);

const toggleCollapse = (targetId: string) => {
  if (activeCollapse.value === targetId) {
    activeCollapse.value = null;
  } else {
    activeCollapse.value = targetId;
  }
};

const plcStores = {
  'collapse1': plc1,
  'collapse2': plc2,
  'collapse3': plc3,
};
const getActivePlcStore = computed(() => {
    return activeCollapse.value ? plcStores[activeCollapse.value] : null;
});


const allarmiOn = computed(() => {
  return (plc) => {
    const statiList = plc.getStati;
    const risultati: Record<string, { stato: boolean, ora: string | null }> = {};

    if (!statiList || statiList.length === 0) {
      return risultati;
    }

    const attributiBooleani: string[] = [
      'aanomaliagenerica',
      'amotorenastro',
      'amancanzaconsenso',
      'atemperaturaprodottoalta',
      'aemergenzainserita',
      'atemperaturacpuelevata',
      'aaggraffatricespenta',
      'anastrospento',
    ];

    for (const key of attributiBooleani) {
      const statoCorrente = statiList[0][key];
      let oraAttivazione: string | null = statiList[0].ora;
      let cambioTrovato = false;

      for (let i = 1; i < statiList.length; i++) {
        const statoElementoCorrente = statiList[i];

        if (statoElementoCorrente[key] !== statoCorrente) {
          oraAttivazione = statiList[i - 1].ora;
          cambioTrovato = true;
          break;
        }
      }

      if (!cambioTrovato && statiList.length > 0) {
        oraAttivazione = statiList[statiList.length - 1].ora;
      }

      risultati[key] = {
        stato: statoCorrente,
        ora: oraAttivazione
      };
    }

    return risultati;
  }
});


const formattedTime = (oraCompleta: string | null) => {
    if (!oraCompleta || typeof oraCompleta !== 'string') {
        return 'N/A';
    }
    const puntoIndex = oraCompleta.indexOf('.');
    const trimmed = puntoIndex !== -1 ? oraCompleta.substring(0, puntoIndex) : oraCompleta;

    return trimmed.replace('T', ' ').replace(/\+\d{2}:\d{2}$/, '');
};

const getAlarmList = (plc) => {
    return Object.entries(allarmiOn.value(plc)).map(([name, data]) => ({
        name: name,
        ...data,
    }));
};

const getAlarmDisplayName = (technicalName: string): string => {
    const map: Record<string, string> = {
        'aanomaliagenerica': 'Anomalia Generica',
        'amotorenastro': 'Motore Nastro',
        'amancanzaconsenso': 'Mancanza Consenso',
        'atemperaturaprodottoalta': 'Temperatura Prodotto Alta',
        'aemergenzainserita': 'Emergenza Inserita',
        'atemperaturacpuelevata': 'Temperatura CPU Elevata',
        'aaggraffatricespenta': 'Aggraffatrice Spenta',
        'anastrospento': 'Nastro Spento',
    };
    return map[technicalName] || technicalName.replace(/a([a-z])/g, (match, p1) => p1.toUpperCase());
};

</script>

<template>
<div class="container p-6">

  <div class="row mb-5">
    <div class="col-12">
      <h1 class="text-center display-4 fw-semibold text-danger">
        <span class="border-bottom border-4 pb-2 custom-border-primary custom-text-primary">Allarmi Attivi</span>
      </h1>
    </div>
  </div>

  <div class="row g-4">

    <div class="col-md-4">
      <h2 class="text-center h4 mb-0 p-2 text-white rounded-top shadow-sm custom-bg-primary">PLC1</h2>

      <div class="table-responsive shadow">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr class="table-primary">
              <th scope="col" class="text-dark">Allarme</th>
              <th scope="col" class="text-center text-dark">Stato</th>
              <th scope="col" class="text-dark">Da Ora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in getAlarmList(plc1)" :key="alarm.name"
                :class="{'table-danger border-start border-5 border-danger': alarm.stato}">
              <td :class="{'fw-bold': alarm.stato}">{{ getAlarmDisplayName(alarm.name) }}</td>
              <td class="text-center">
                <span :class="{'badge bg-danger text-uppercase p-2': alarm.stato, 'badge bg-success text-uppercase p-2': !alarm.stato, 'fw-bold': true}">
                    {{ alarm.stato ? 'ATTIVO' : 'OK' }}
                </span>
              </td>
              <td :class="{'fw-bold text-danger': alarm.stato}">{{ formattedTime(alarm.ora) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-md-4">
      <h2 class="text-center h4 mb-0 p-2 text-white rounded-top shadow-sm custom-bg-primary">PLC2</h2>
      <div class="table-responsive shadow">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr class="table-primary">
              <th scope="col" class="text-dark">Allarme</th>
              <th scope="col" class="text-center text-dark">Stato</th>
              <th scope="col" class="text-dark">Da Ora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in getAlarmList(plc2)" :key="alarm.name"
                :class="{'table-danger border-start border-5 border-danger': alarm.stato}">
              <td :class="{'fw-bold': alarm.stato}">{{ getAlarmDisplayName(alarm.name) }}</td>
              <td class="text-center">
                <span :class="{'badge bg-danger text-uppercase p-2': alarm.stato, 'badge bg-success text-uppercase p-2': !alarm.stato, 'fw-bold': true}">
                    {{ alarm.stato ? 'ATTIVO' : 'OK' }}
                </span>
              </td>
              <td :class="{'fw-bold text-danger': alarm.stato}">{{ formattedTime(alarm.ora) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="col-md-4">
      <h2 class="text-center h4 mb-0 p-2 text-white rounded-top shadow-sm custom-bg-primary">PLC3</h2>
      <div class="table-responsive shadow">
        <table class="table table-hover align-middle mb-0">
          <thead>
            <tr class="table-primary">
              <th scope="col" class="text-dark">Allarme</th>
              <th scope="col" class="text-center text-dark">Stato</th>
              <th scope="col" class="text-dark">Da Ora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in getAlarmList(plc3)" :key="alarm.name"
                :class="{'table-danger border-start border-5 border-danger': alarm.stato}">
              <td :class="{'fw-bold': alarm.stato}">{{ getAlarmDisplayName(alarm.name) }}</td>
              <td class="text-center">
                <span :class="{'badge bg-danger text-uppercase p-2': alarm.stato, 'badge bg-success text-uppercase p-2': !alarm.stato, 'fw-bold': true}">
                    {{ alarm.stato ? 'ATTIVO' : 'OK' }}
                </span>
              </td>
              <td :class="{'fw-bold text-danger': alarm.stato}">{{ formattedTime(alarm.ora) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <div class="d-flex justify-content-center my-5 gap-3">
    <button class="btn shadow-lg custom-bg-primary text-white" type="button" @click="toggleCollapse('collapse1')"
      :aria-expanded="activeCollapse === 'collapse1'">
      Storico Allarmi PLC1
    </button>
    <button class="btn shadow-lg custom-bg-primary text-white" type="button" @click="toggleCollapse('collapse2')"
      :aria-expanded="activeCollapse === 'collapse2'">
      Storico Allarmi PLC2
    </button>
    <button class="btn shadow-lg custom-bg-primary text-white" type="button" @click="toggleCollapse('collapse3')"
      :aria-expanded="activeCollapse === 'collapse3'">
      Storico Allarmi PLC3
    </button>
  </div>

  <div class="collapse-wrapper">
    <Transition name="smooth-slide-vertical" mode="out-in">
        <div
          v-if="activeCollapse"
          :key="activeCollapse"
          class="chart-content-container"
        >
         <div class="card card-body shadow-sm border-0 border-start border-end border-bottom border-1 custom-border-light">
            <GraficoStoricoAllarmi :plc-store="getActivePlcStore"></GraficoStoricoAllarmi>
          </div>
        </div>
    </Transition>
  </div>
</div>
</template>

<style scoped>
/* **************************************************
 * COLORI CUSTOM con #14265a
 * **************************************************/
.custom-bg-primary {
    background-color: #14265a !important;
}
.custom-border-primary {
    border-color: #14265a !important;
}



.chart-content-container {
    display: block;
    width: 100%;
}

.card-body {
    padding: 1.5rem;
}

.table {
    border-spacing: 0;
    border: none;
}

.table th, .table td {
    border-top: 1px solid #dee2e6;
    border-bottom: 1px solid #dee2e6;
    border-left: 1px solid #dee2e6;
    border-right: 1px solid #dee2e6;
}


.table-primary {
    --bs-table-bg: #cfe2ff;
}

.table-danger {
    --bs-table-bg: #ffe0e0; /* Rosso molto chiaro */
    --bs-table-hover-bg: #fddddd;
}

/* Bordo sinistro spesso e rosso per evidenziare l'allarme attivo */
.table-danger.border-start {
    border-left-color: var(--bs-danger) !important;
}

/* Assicura che l'header del PLC (custom-bg-primary) abbia angoli arrotondati solo in alto */
.custom-bg-primary {
    border-radius: 0.3rem 0.3rem 0 0 !important;
}

/* **************************************************
 * FIX MARGINI GRAFICO (USANDO :DEEP)
 * **************************************************/
.chart-content-container :deep(.container) {
    padding: 0;
    margin: 0;
    max-width: 100%;
}
</style>
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

</script>

<template>
<div class="container p-6">
  <h1 class="text-center">Allarmi attivi</h1>
  <div class="row">
    <div class="col">
      <div class="text-center">PLC1</div>
      <table class="table table-bordered border-black">
        <thead>
          <tr>
            <th scope="col">Allarme</th>
            <th scope="col">Stato</th>
            <th scope="col">Da Ora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in getAlarmList(plc1)" :key="alarm.name">
            <td>{{ alarm.name }}</td>
            <td :class="{'text-danger fw-bold': alarm.stato, 'text-success': !alarm.stato}">
                {{ alarm.stato ? 'ATTIVO' : 'OK' }}
            </td>
            <td>{{ formattedTime(alarm.ora) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="col">
      <div class="text-center">PLC2</div>
      <table class="table table-bordered border-black">
        <thead>
          <tr>
            <th scope="col">Allarme</th>
            <th scope="col">Stato</th>
            <th scope="col">Da Ora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in getAlarmList(plc2)" :key="alarm.name">
            <td>{{ alarm.name }}</td>
            <td :class="{'text-danger fw-bold': alarm.stato, 'text-success': !alarm.stato}">
                {{ alarm.stato ? 'ATTIVO' : 'OK' }}
            </td>
            <td>{{ formattedTime(alarm.ora) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="col">
      <div class="text-center">PLC3</div>
      <table class="table table-bordered border-black">
        <thead>
          <tr>
            <th scope="col">Allarme</th>
            <th scope="col">Stato</th>
            <th scope="col">Da Ora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alarm in getAlarmList(plc3)" :key="alarm.name">
            <td>{{ alarm.name }}</td>
            <td :class="{'text-danger fw-bold': alarm.stato, 'text-success': !alarm.stato}">
                {{ alarm.stato ? 'ATTIVO' : 'OK' }}
            </td>
            <td>{{ formattedTime(alarm.ora) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="d-flex justify-content-between my-4">
    <button class="btn btn-primary" type="button" @click="toggleCollapse('collapse1')"
      :aria-expanded="activeCollapse === 'collapse1'">
      Storico Allarmi PLC1
    </button>
    <button class="btn btn-primary" type="button" @click="toggleCollapse('collapse2')"
      :aria-expanded="activeCollapse === 'collapse2'">
      Storico Allarmi PLC2
    </button>
    <button class="btn btn-primary" type="button" @click="toggleCollapse('collapse3')"
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
          <div class="card card-body">
            <GraficoStoricoAllarmi :plc-store="getActivePlcStore"></GraficoStoricoAllarmi>
          </div>
        </div>
    </Transition>
  </div>
</div>
</template>

<style scoped>
.collapse-wrapper {
    /* Rimuovendo position: absolute, non serve più l'overflow-x */
}

.chart-content-container {
    /* Rimosso position: absolute */
    display: block;
    width: 100%; /* Si adatta al 100% del div.container genitore */
}

/* **************************************************
 * ANIMAZIONE COLLAPSE VERTICALE
 * **************************************************/

.smooth-slide-vertical-enter-active,
.smooth-slide-vertical-leave-active {
  /* Transiziona l'altezza e l'opacità */
  transition: max-height 0.5s cubic-bezier(0.25, 0.8, 0.25, 1),
              opacity 0.4s ease-in-out;
  overflow: hidden;
}

.smooth-slide-vertical-enter-from,
.smooth-slide-vertical-leave-to {
  max-height: 0; /* Lo chiude in verticale */
  opacity: 0;
}

.smooth-slide-vertical-enter-to,
.smooth-slide-vertical-leave-from {
  /* Altezza fissa sufficiente (circa 450px del grafico + margini) */
  max-height: 600px;
  opacity: 1;
}

/* **************************************************
 * FIX MARGINI GRAFICO (USANDO :DEEP)
 * **************************************************/
/* Questo targettizza il div.container ALL'INTERNO del GraficoStoricoAllarmi per rimuovere i margini di Bootstrap */
.chart-content-container :deep(.container) {
    padding: 0;
    margin: 0;
    max-width: 100%;
}

.card-body {
    padding: 1rem;
}
</style>
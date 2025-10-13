<script setup lang="ts">
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import {computed} from "vue";

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();


const allarmiOn = computed(() => {
  return (plc) => { // Uso plc1 come tipo generico per lo store
    const statiList = plc.getStati;
    const risultati: Record<string, { stato: boolean, ora: string | null }> = {};

    if (!statiList || statiList.length === 0) {
      return risultati; // Ritorna un oggetto vuoto se non ci sono stati
    }

    // 1. Identifica gli attributi booleani (assumendo che gli allarmi siano i booleani, esclusa 'ora')
    // Usiamo il primo elemento per scoprire i nomi degli attributi
    const primoStato = statiList[0];
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

    // 2. Itera su ogni attributo booleano trovato (es. 'anomaliaGenerica', 'temperaturaAlta', ecc.)
    for (const key of attributiBooleani) {

      const statoCorrente = primoStato[key]; // Valore booleano del primo elemento (stato attuale)
      let oraAttivazione: string | null = statiList[0].ora; // L'ora di default è l'ora del primo elemento

      // ✅ VARIABILE PER TRACCIARE IL CAMBIAMENTO
      let cambioTrovato = false;

      // 3. Scorri la lista dalla posizione successiva (indice 1)
      for (let i = 1; i < statiList.length; i++) {
        const statoElementoCorrente = statiList[i];

        // 4. Se il valore dell'attributo CAMBIA rispetto allo stato attuale
        if (statoElementoCorrente[key] !== statoCorrente) {
          // L'ora desiderata è l'ora dell'elemento *precedente*
          oraAttivazione = statiList[i - 1].ora;
          cambioTrovato = true; // ✅ Segnala che il cambiamento è stato trovato
          break; // Esci dal ciclo for (i)
        }
      }

      // ✅ 5. CONDIZIONE AGGIUNTA: Se non è stato trovato alcun cambiamento e la lista è abbastanza lunga
      if (!cambioTrovato && statiList.length > 0) {
        // L'ora dello stato attuale risale all'inizio del log (ultimo elemento)
        oraAttivazione = statiList[statiList.length - 1].ora;
      }

      // 6. Salva il risultato (il vecchio punto 5)
      risultati[key] = {
        stato: statoCorrente,
        ora: oraAttivazione
      };
    }

    return risultati;
  }
});


// Funzione di formattazione del tempo (utile per il template)
const formattedTime = (oraCompleta: string | null) => {
    if (!oraCompleta || typeof oraCompleta !== 'string') {
        return 'N/A';
    }
    const puntoIndex = oraCompleta.indexOf('.');
    const trimmed = puntoIndex !== -1 ? oraCompleta.substring(0, puntoIndex) : oraCompleta;

    // Rimuove 'T' e il fuso orario se presente
    return trimmed.replace('T', ' ').replace(/\+\d{2}:\d{2}$/, '');
};

// Funzione helper per ottenere un elenco ordinato per il template
const getAlarmList = (plc) => {
    return Object.entries(allarmiOn.value(plc)).map(([name, data]) => ({
        name: name,
        ...data,
    }));
};

</script>

<template>
<div>
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
  <div class="d-flex justify-content-between">
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
    Toggle width collapse
  </button>
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
    Toggle width collapse
  </button>
    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
    Toggle width collapse
  </button>
  </div>
  <div>
  <div class="collapse collapse-horizontal" id="collapseWidthExample">
    <div class="card card-body" style="width: 300px;">
      This is some placeholder content for a horizontal collapse. It’s hidden by default and shown when triggered.
    </div>
  </div>
</div>
</div>
</template>

<style scoped>

</style>
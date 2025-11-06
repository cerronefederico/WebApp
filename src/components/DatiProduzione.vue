<template>
  <div class="container py-4">
    <header class="text-center mb-5">
      <h1 class="text-primary display-6 fw-bold">Panoramica Comparativa di Produzione</h1>
      <p class="lead text-secondary mt-2">Prestazioni operative attuali e comparative di tutti gli impianti PLC.</p>
      <hr class="separator-line mx-auto">
    </header>

    <h2 class="section-title mb-4">Riepilogo Impianto Totale (Oggi)</h2>
    <div class="row g-4 mb-5">

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-lg bg-primary-light">
          <p class="kpi-label">Produzione Totale (Pezzi)</p>
          <h3 class="kpi-value text-primary fw-bolder">{{contTot}}</h3> </div>
      </div>

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-lg bg-info-light">
          <p class="kpi-label">Efficienza Media</p>
          <h3 class="kpi-value text-info fw-bolder">{{activeTime}}</h3> </div>
      </div>

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-lg bg-danger-light">
          <p class="kpi-label">Allarmi Attivati</p>
          <h3 class="kpi-value text-danger fw-bolder">{{allarmiAttivatiOggi}}</h3> </div>
      </div>

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-lg bg-warning-light">
          <p class="kpi-label">Warning Attivati</p>
          <h3 class="kpi-value text-warning fw-bolder">{{warningAttiviOggi}}</h3> </div>
      </div>
    </div>

    <h2 class="section-title mb-4">Confronto Prestazioni Giornaliere</h2>
    <div class="row g-4 mb-5">

      <div class="col-lg-6">
        <div class="card shadow-lg chart-card">
          <div class="card-header bg-light text-primary fw-bold">Produzione Totale (Pezzi) per PLC</div>
          <div class="card-body">
            <h2 class="section-title mb-4">Storico Produzione Giornaliera (Sincronizzato)</h2>
    <div class="row g-4 mb-5">
      <!-- Grafico 1: PLC 1 -->
        <div class="card shadow-lg chart-card p-0">
          <div class="card-body p-2">
             <!-- ApexChart deve essere importato/registrato globalmente (es. come 'ApexChart') affinché questo funzioni -->
            <apexchart type="line" :options="chartOptionsPLC1" :series="seriesPLC1" height="200" />
          </div>
        </div>
      <!-- Grafico 2: PLC 2 -->
        <div class="card shadow-lg chart-card p-0">
          <div class="card-body p-2">
            <apexchart type="line" :options="chartOptionsPLC2" :series="seriesPLC2" height="200" />
          </div>
        </div>
      <!-- Grafico 3: PLC 3 -->
        <div class="card shadow-lg chart-card p-0">
          <div class="card-body p-2">
            <apexchart type="line" :options="chartOptionsPLC3" :series="seriesPLC3" height="200" />
          </div>
        </div>
    </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow-lg chart-card">
          <div class="card-header bg-light text-primary fw-bold">Velocità produzione per PLC</div>
          <div class="card-body">
            <h2 class="section-title mb-4">Storico Velocità Giornaliera (Sincronizzato)</h2>
    <div class="row g-4 mb-5">
      <!-- Grafico 1: PLC 1 -->
        <div class="card shadow-lg chart-card p-0">
          <div class="card-body p-2">
             <!-- ApexChart deve essere importato/registrato globalmente (es. come 'ApexChart') affinché questo funzioni -->
            <apexchart type="line" :options="speedChartOptionsPLC1" :series="speedSeriesPLC1" height="200" />
          </div>
        </div>
      <!-- Grafico 2: PLC 2 -->
        <div class="card shadow-lg chart-card p-0">
          <div class="card-body p-2">
            <apexchart type="line" :options="speedChartOptionsPLC2" :series="speedSeriesPLC2" height="200" />
          </div>
        </div>
      <!-- Grafico 3: PLC 3 -->
        <div class="card shadow-lg chart-card p-0">
          <div class="card-body p-2">
            <apexchart type="line" :options="speedChartOptionsPLC3" :series="speedSeriesPLC3" height="200" />
          </div>
        </div>
    </div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="section-title mb-4">Stato Live e Velocità Attuale</h2>
    <div class="row g-4">

      <div class="col-md-4">
        <div class="status-card p-4 shadow-lg">
            <h4 class="text-primary">PLC 1</h4>
            <p class="mb-1">Stato:
              <strong v-if="plc1.getStati[0].acceso ===false" class="text-secondary">Spento</strong>
              <strong v-if="plc1.getStati[0].acceso ===true && plc1.getStati[0].blocco === true" class="text-warning">In Blocco</strong>
              <strong v-if="plc1.getStati[0].acceso ===true && plc1.getStati[0].blocco === false && plc1.getStati[0].regime === true" class="text-info">A Regime</strong>
              <strong v-if="plc1.getStati[0].acceso ===true && plc1.getStati[0].blocco === false && plc1.getStati[0].regime === false" class="text-success">Acceso</strong>
            </p>
            <p class="mb-1">Pezzi/Min: <strong>{{plc1.getContatori[0].velocitaproduzionepezziminuto}}</strong></p>
            <p class="mb-3">Allarmi Live: <strong class="text-danger">{{plc1.getNumeroAllarmi}}</strong></p>
          <router-link to="/history/report">
            <button class="btn btn-sm btn-outline-primary w-100" @click="goToReport('PLC1')">Visualizza Report Dettagliato</button>
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="status-card p-4 shadow-lg">
            <h4 class="text-primary">PLC 2</h4>
          <p class="mb-1">Stato:
              <strong v-if="plc2.getStati[0].acceso ===false" class="text-secondary">Spento</strong>
              <strong v-if="plc2.getStati[0].acceso ===true && plc2.getStati[0].blocco === true" class="text-warning">In Blocco</strong>
              <strong v-if="plc2.getStati[0].acceso ===true && plc2.getStati[0].blocco === false && plc2.getStati[0].regime === true" class="text-info">A Regime</strong>
              <strong v-if="plc2.getStati[0].acceso ===true && plc2.getStati[0].blocco === false && plc2.getStati[0].regime === false" class="text-success">Acceso</strong>
            </p>
            <p class="mb-1">Pezzi/Min: <strong>{{plc2.getContatori[0].velocitaproduzionepezziminuto}}</strong></p>
            <p class="mb-3">Allarmi Live: <strong class="text-danger">{{plc2.getNumeroAllarmi}}</strong></p>
          <router-link to="/history/report">
            <button class="btn btn-sm btn-outline-primary w-100" @click="goToReport('PLC2')">Visualizza Report Dettagliato</button>
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="status-card p-4 shadow-lg">
            <h4 class="text-primary">PLC 3</h4>
          <p class="mb-1">Stato:
              <strong v-if="plc3.getStati[0].acceso ===false" class="text-secondary">Spento</strong>
              <strong v-if="plc3.getStati[0].acceso ===true && plc3.getStati[0].blocco === true" class="text-warning">In Blocco</strong>
              <strong v-if="plc3.getStati[0].acceso ===true && plc3.getStati[0].blocco === false && plc3.getStati[0].regime === true" class="text-info">A Regime</strong>
              <strong v-if="plc3.getStati[0].acceso ===true && plc3.getStati[0].blocco === false && plc3.getStati[0].regime === false" class="text-success">Acceso</strong>
            </p>
            <p class="mb-1">Pezzi/Min: <strong>{{plc3.getContatori[0].velocitaproduzionepezziminuto}}</strong></p>
            <p class="mb-3">Allarmi Live: <strong class="text-danger">{{plc3.getNumeroAllarmi}}</strong></p>
          <router-link to="/history/report">
            <button class="btn btn-sm btn-outline-primary w-100" @click="goToReport('PLC3')">Visualizza Report Dettagliato</button>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {usePlc1Store, usePlc2Store, usePlc3Store} from "@/stores/index.js";
import {computed, reactive} from "vue";

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

const router = useRouter();

const goToReport = (plcId) => {
    router.push({
        // Usa il NOME della route di destinazione
        name: 'ReportDati',
        // Passa l'ID come parametro
        params: { plcId: plcId }
    });
};

const contTot = computed(() => {
  const listCont1 = plc1.getContatori;
  const listCont2 = plc2.getContatori;
  const listCont3 = plc3.getContatori;
  const todayDay = new Date().getDay();

  const calculateDelta = (listCont) => {
    if (!listCont || listCont.length === 0) {
      return 0;
    }

    const currentCounter = listCont[0].contatorepezzitotale;

    let startIndex = -1;

    // Cerca l'indice del primo elemento che NON è di oggi, partendo dal secondo elemento
    for (let i = 0; i < listCont.length; i++) {
      const item = listCont[i];

      if (item && item.ora) {
        const itemDate = new Date(item.ora);

        // Verifica se la conversione è valida (non 'Invalid Date') e confronta il giorno
        if (!isNaN(itemDate) && itemDate.getDay() !== todayDay) {
          startIndex = i;
          break;
        }
      }
    }

    let startCounter;

    if (startIndex === -1) {
      // Nessun elemento di giorni precedenti trovato, usa l'ultimo elemento come punto di partenza.
      startCounter = listCont[listCont.length - 1].contatorepezzitotale;
    } else {
      // Usa il valore del primo elemento trovato che NON è di oggi
      startCounter = listCont[startIndex].contatorepezzitotale;
    }
    return currentCounter - startCounter;
  };

  const summ1 = calculateDelta(listCont1);
  const summ2 = calculateDelta(listCont2);
  const summ3 = calculateDelta(listCont3);
  return summ1 + summ2 + summ3;
});

const activeTime = computed(() => {
  // --- 1. Preparazione delle Variabili Globali ---
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const totalTimeMs = now.getTime() - todayStart.getTime(); // Tempo totale trascorso da mezzanotte a 'now'

  if (totalTimeMs <= 0 || isNaN(totalTimeMs)) {
    return (0).toFixed(2);
  }

  // --- 2. Funzione per Calcolare il Tempo di Blocco per un Singolo PLC ---
  const calculateBlockMs = (listStati) => {
    if (!listStati || listStati.length === 0) {
      return 0;
    }

    let blockTimeMs = 0;

    // Filtra per trovare gli stati loggati oggi, più l'ultimo stato di ieri
    let relevantLogs = [];
    let logBeforeToday = null;
    let isToday = (date) => date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

    // 2.a. Identifica i log di oggi (incluso l'elemento 0, il più recente) e l'ultimo di ieri
    for (let i = 0; i < listStati.length; i++) {
        const item = listStati[i];
        const itemDate = new Date(item.ora);

        if (isToday(itemDate)) {
            relevantLogs.push(item);
        } else {
            // Primo elemento non di oggi trovato (è l'ultimo log di ieri)
            logBeforeToday = item;
            break;
        }
    }

    // 2.b. Costruisci la lista finale di log (dal più vecchio al più recente)
    // Inizia con lo stato di ieri (punto 1 del tuo algoritmo modificato)
    if (logBeforeToday) {
        // Applica la forzatura: cambia l'ora a mezzanotte di oggi
        let modifiedStartLog = {...logBeforeToday};
        modifiedStartLog.ora = todayStart.toISOString(); // Imposta l'ora a 00:00:00 di oggi
        relevantLogs.push(modifiedStartLog);
    }

    // Inverti per lavorare cronologicamente dal più vecchio al più recente (00:00:00 -> now)
    relevantLogs.reverse();

    // 2.c. Calcola gli intervalli di blocco
    // Loop attraverso gli elementi, escluso l'ultimo (che è lo stato attuale/now)
    for (let i = 0; i < relevantLogs.length - 1; i++) {
        const olderItem = relevantLogs[i];
        const newerItem = relevantLogs[i + 1];

        // Assumiamo che lo stato registrato al tempo T_i (più vecchio) sia attivo
        // fino all'evento T_{i+1} (più recente)
        if (olderItem.blocco === true) {
            const endIntervalDate = new Date(newerItem.ora);
            const startIntervalDate = new Date(olderItem.ora);

            // Calcola l'intervallo e aggiungilo al tempo di blocco
            blockTimeMs += (endIntervalDate.getTime() - startIntervalDate.getTime());
        }
    }

    // 2.d. Gestione dell'intervallo corrente (dall'ultimo log a NOW)
    // L'ultimo elemento in `relevantLogs` è il log più recente di oggi.
    const latestLog = relevantLogs[relevantLogs.length - 1];
    if (latestLog && latestLog.blocco === true) {
        const latestLogDate = new Date(latestLog.ora);

        if (!isNaN(latestLogDate) && latestLogDate.getTime() < now.getTime()) {
             blockTimeMs += (now.getTime() - latestLogDate.getTime());
        }
    }

    return blockTimeMs;
  };

  // --- 3. Calcolo Totale e Media ---
  const totalBlockMs1 = calculateBlockMs(plc1.getStati);
  const totalBlockMs2 = calculateBlockMs(plc2.getStati);
  const totalBlockMs3 = calculateBlockMs(plc3.getStati);

  // Tempo Attivo = Tempo Totale Oggi - Tempo Totale di Blocco
  const totalActiveMs1 = totalTimeMs - totalBlockMs1;
  const totalActiveMs2 = totalTimeMs - totalBlockMs2;
  const totalActiveMs3 = totalTimeMs - totalBlockMs3;

  // Media delle percentuali di tempo attivo
  const efficiency1 = totalActiveMs1 / totalTimeMs;
  const efficiency2 = totalActiveMs2 / totalTimeMs;
  const efficiency3 = totalActiveMs3 / totalTimeMs;

  const mediaEfficiency = (efficiency1 + efficiency2 + efficiency3) / 3;

  // Percentuale Attiva = Media * 100
  return (mediaEfficiency * 100).toFixed(2);
});

// ... (codice precedente, inclusi gli import di useRouter, usePlcStore e computed)

// --- Funzione di Utilità (NON reattiva) ---
// Questa funzione ora lavora su una singola lista passata come argomento.
const countNotifiche = (listNotifiche, prefix) => {
    if (listNotifiche.length === 0) {
        return 0;
    }

    const now = new Date();
    // Funzione per verificare se una data è oggi
    const isToday = (date) => date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();

    let count = 0;

    // La lista è in ordine decrescente di ora (più recente in posizione 0)
    for (const item of listNotifiche) {

        // 1. Filtra per data odierna
        const itemDate = new Date(item.ora);
        if (isNaN(itemDate) || !isToday(itemDate)) {
            // Poiché la lista è ordinata dal più recente al più vecchio,
            // possiamo interrompere il ciclo quando troviamo un elemento di ieri.
            break;
        }

        // 2. Filtra per prefisso e stato
        const id = item.id ? item.id.toLowerCase() : '';
        if (item.stato === true && id.startsWith(prefix.toLowerCase())) {
            count++;
        }
    }
    return count;
};

// --- Computed Properties REATTIVE ---

const allarmiAttivatiOggi = computed(() => {
    // ⚠️ CHIAVE: L'accesso ai getter reattivi delle store (getNotifiche) avviene qui.
    // Vue traccia questa lettura e garantisce che la computed si aggiorni
    // ogni volta che la lista notifiche in una delle store cambia.
    const count1 = countNotifiche(plc1.getNotifiche || [], 'a');
    const count2 = countNotifiche(plc2.getNotifiche || [], 'a');
    const count3 = countNotifiche(plc3.getNotifiche || [], 'a');

    // Somma per tutti e tre i PLC
    return count1 + count2 + count3;
});

const warningAttiviOggi = computed(() => {
    // ⚠️ CHIAVE: L'accesso ai getter reattivi delle store (getNotifiche) avviene qui.
    const count1 = countNotifiche(plc1.getNotifiche || [], 'w');
    const count2 = countNotifiche(plc2.getNotifiche || [], 'w');
    const count3 = countNotifiche(plc3.getNotifiche || [], 'w');

    // Somma per tutti e tre i PLC
    return count1 + count2 + count3;
});

const prepareDailyProductionData = (listCont) => {
    // 1. Pre-elaborazione e Gestione Fuso Orario
    if (!listCont || listCont.length === 0) {
        const todayStartTimestamp = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        return [{ x: todayStartTimestamp, y: 0 }];
    }

    const dailyCounters = {};
    let firstLogTimestamp = Infinity; // Il log più vecchio
    let lastLogTimestamp = 0;       // Il log più recente

    for (const item of listCont) {
        const dateObj = new Date(item.ora);
        if (isNaN(dateObj)) continue;

        // Ottiene il timestamp di mezzanotte del giorno del log **in UTC**
        // Per fixare il problema del fuso orario: usiamo le funzioni UTC.
        const dayTimestamp = Date.UTC(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate()
        );

        firstLogTimestamp = Math.min(firstLogTimestamp, dayTimestamp);
        lastLogTimestamp = Math.max(lastLogTimestamp, dayTimestamp);

        // Se è il primo log che incontriamo per questo giorno (più recente nella lista originale)
        if (!dailyCounters[dayTimestamp]) {
            dailyCounters[dayTimestamp] = {
                endCounter: item.contatorepezzitotale,
                startCounter: null, // Verrà impostato
            };
        }

        // L'ultimo elemento della lista (il più vecchio) serve come punto di partenza.
        // Questo è il valore più basso registrato per quel giorno o prima.
        dailyCounters[dayTimestamp].oldestCounterInList = item.contatorepezzitotale;
    }


    // 2. Calcolo dei Delta Giornalieri e Completamento Giorni Mancanti

    let finalData = [];

    // Inizializza il contatore di inizio per il giorno più vecchio (prende il valore più basso trovato)
    let startCounterForNextDay = dailyCounters[firstLogTimestamp].oldestCounterInList;

    // Itera dal giorno più vecchio (firstLogTimestamp) fino a oggi
    const today = new Date();
    // Mezzanotte di oggi (UTC per consistenza)
    const todayStartTimestamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    // Iterazione giorno per giorno
    for (let currentDayTimestamp = firstLogTimestamp; currentDayTimestamp <= todayStartTimestamp; currentDayTimestamp += (24 * 60 * 60 * 1000)) {

        const currentDayData = dailyCounters[currentDayTimestamp];
        let endCounterForDay;
        let finalDelta;

        if (currentDayData) {
            // Dati disponibili per questo giorno
            endCounterForDay = currentDayData.endCounter;

            // Delta = Contatore Finale del giorno - Contatore Finale del giorno precedente (StartCounterForNextDay)
            finalDelta = Math.max(0, endCounterForDay - startCounterForNextDay);

            // Aggiorna lo startCounter per il giorno successivo
            startCounterForNextDay = endCounterForDay;
        } else {
            // Nessun dato disponibile per questo giorno -> Produzione zero
            endCounterForDay = startCounterForNextDay; // Il contatore non è cambiato
            finalDelta = 0;
            // startCounterForNextDay rimane lo stesso
        }

        // Aggiunge il punto per il giorno
        finalData.push({
            x: Number(currentDayTimestamp), // Timestamp UTC del giorno
            y: finalDelta,
        });

        // Caso limite: se stiamo analizzando un giorno futuro (non dovrebbe succedere, ma per sicurezza)
        if (currentDayTimestamp > todayStartTimestamp) break;
    }

    return finalData;
};


// --- Dati reattivi per i grafici ---
const dataPLC1 = computed(() => prepareDailyProductionData(plc1.getContatori));
const dataPLC2 = computed(() => prepareDailyProductionData(plc2.getContatori));
const dataPLC3 = computed(() => prepareDailyProductionData(plc3.getContatori));

// --- Opzioni Base per la Sincronizzazione ---
const commonChartOptions = {
    chart: {
        // ID univoco per il grafico
        id: 'PLC_CHART_COMMON',
        // CHIAVE: Assegna lo stesso 'group' a tutti i grafici per sincronizzarli
        group: 'production-sync',
        type: 'line',
        height: 350,
        animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
                speed: 1000,
            }
        },
        toolbar: {
            // Abilita lo zoom/pan
            tools: {
                zoom: true,
                pan: true,
                reset: true,
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth', // 'straight' o 'smooth' o 'stepline'
        width: 3
    },
    title: {
        text: 'Produzione Giornaliera (Pezzi)',
        align: 'left'
    },
    xaxis: {
        type: 'datetime', // Tipo di asse X basato sul timestamp
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMM \'yy',
                day: 'dd MMM',
                hour: 'HH:mm'
            },
            style: {
                colors: '#6c757d'
            }
        },
        tickPlacement: 'on'
    },
    yaxis: {
        title: {
            text: 'Pezzi Prodotti',
            style: {
                 color: '#14265a'
            }
        },
        labels: {
            formatter: (val) => val.toFixed(0),
            style: {
                colors: ['#6c757d']
            }
        }
    },
    tooltip: {
        x: {
            format: 'dd MMM yyyy'
        }
    },
    grid: {
        borderColor: '#e7e7e7',
    },
    theme: {
        mode: 'light',
    }
};

// --- Dati e Opzioni per il Grafico 1 (PLC1) ---
const chartOptionsPLC1 = reactive({
    ...commonChartOptions,
    colors: ['#008FFB'], // Blu
    title: { text: 'PLC 1 - Produzione Giornaliera' },
});

const seriesPLC1 = computed(() => [{
    name: "PLC 1 - Pezzi",
    data: dataPLC1.value
}]);

// --- Dati e Opzioni per il Grafico 2 (PLC2) ---
const chartOptionsPLC2 = reactive({
    ...commonChartOptions,
    colors: ['#00E396'], // Verde
    title: { text: 'PLC 2 - Produzione Giornaliera' },
});

const seriesPLC2 = computed(() => [{
    name: "PLC 2 - Pezzi",
    data: dataPLC2.value
}]);

// --- Dati e Opzioni per il Grafico 3 (PLC3) ---
const chartOptionsPLC3 = reactive({
    ...commonChartOptions,
    colors: ['#FEB019'], // Giallo/Arancio
    title: { text: 'PLC 3 - Produzione Giornaliera' },
});

const seriesPLC3 = computed(() => [{
    name: "PLC 3 - Pezzi",
    data: dataPLC3.value
}]);



const prepareDailySpeedData = (listCont) => {
    if (!listCont || listCont.length === 0) {
        const todayStartTimestamp = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        return [{ x: todayStartTimestamp, y: 0 }]; // Nessun dato, velocità 0
    }

    const dailySpeeds = {};
    let firstLogTimestamp = Infinity; // Il log più vecchio

    // 1. Raggruppamento e Calcolo della Media
    for (const item of listCont) {
        const dateObj = new Date(item.ora);
        if (isNaN(dateObj) || typeof item.velocitaproduzionepezziminuto !== 'number') continue;

        // Ottiene il timestamp di mezzanotte del giorno del log (UTC per fixare il fuso orario)
        const dayTimestamp = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());

        firstLogTimestamp = Math.min(firstLogTimestamp, dayTimestamp);

        if (!dailySpeeds[dayTimestamp]) {
            dailySpeeds[dayTimestamp] = { sum: 0, count: 0 };
        }

        dailySpeeds[dayTimestamp].sum += item.velocitaproduzionepezziminuto;
        dailySpeeds[dayTimestamp].count += 1;
    }

    // 2. Calcolo dei Punti Dati e Completamento Giorni Mancanti
    let finalData = [];
    let lastCalculatedAverage = 0; // Se non ci sono dati, la media è 0

    const today = new Date();
    // Mezzanotte di oggi (UTC per consistenza)
    const todayStartTimestamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

    // Itera dal giorno più vecchio fino a oggi
    for (let currentDayTimestamp = firstLogTimestamp; currentDayTimestamp <= todayStartTimestamp; currentDayTimestamp += (24 * 60 * 60 * 1000)) {

        const currentDayData = dailySpeeds[currentDayTimestamp];
        let dailyAverage;

        if (currentDayData && currentDayData.count > 0) {
            // Dati disponibili: calcola la media effettiva
            dailyAverage = currentDayData.sum / currentDayData.count;
            lastCalculatedAverage = dailyAverage; // Aggiorna l'ultimo valore valido
        } else {
            // Nessun dato disponibile: usa l'ultima media calcolata
            dailyAverage = lastCalculatedAverage;
        }

        // Aggiunge il punto per il giorno
        finalData.push({
            x: Number(currentDayTimestamp), // Timestamp UTC del giorno
            y: parseFloat(dailyAverage.toFixed(2)), // Arrotonda per chiarezza
        });

        if (currentDayTimestamp > todayStartTimestamp) break;
    }

    return finalData;
};

const speedDataPLC1 = computed(() => prepareDailySpeedData(plc1.getContatori));
const speedDataPLC2 = computed(() => prepareDailySpeedData(plc2.getContatori));
const speedDataPLC3 = computed(() => prepareDailySpeedData(plc3.getContatori));

// --- Opzioni Base per la Sincronizzazione della Velocità ---
const commonSpeedOptions = {
    chart: {
        id: 'PLC_CHART_COMMON',
        // CHIAVE: Assegna lo stesso 'group' a tutti i grafici per sincronizzarli
        group: 'production-sync',
        type: 'line',
        height: 200,
        animations: commonChartOptions.chart.animations,
        toolbar: commonChartOptions.chart.toolbar,
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight',
        width: 3
    },
    title: {
        text: 'Velocità Media Giornaliera (Pezzi/Min)',
        align: 'left'
    },
    xaxis: commonChartOptions.xaxis, // Riutilizza la configurazione datetime
    yaxis: {
        title: {
            text: 'Pezzi/Minuto',
            style: { color: '#14265a' }
        },
        labels: {
            formatter: (val) => val.toFixed(2),
            style: { colors: ['#6c757d'] }
        }
    },
    tooltip: commonChartOptions.tooltip,
    grid: commonChartOptions.grid,
    theme: commonChartOptions.theme,
};

// --- Configurazione Grafici Velocità ---
const speedChartOptionsPLC1 = reactive({
    ...commonSpeedOptions,
    colors: ['#008FFB'], // Blu
    title: { text: 'PLC 1 - Velocità Media Giornaliera' },
});
const speedSeriesPLC1 = computed(() => [{ name: "PLC 1 - Pezzi/Min", data: speedDataPLC1.value }]);

const speedChartOptionsPLC2 = reactive({
    ...commonSpeedOptions,
    colors: ['#00E396'], // Verde
    title: { text: 'PLC 2 - Velocità Media Giornaliera' },
});
const speedSeriesPLC2 = computed(() => [{ name: "PLC 2 - Pezzi/Min", data: speedDataPLC2.value }]);

const speedChartOptionsPLC3 = reactive({
    ...commonSpeedOptions,
    colors: ['#FEB019'], // Giallo/Arancio
    title: { text: 'PLC 3 - Velocità Media Giornaliera' },
});
const speedSeriesPLC3 = computed(() => [{ name: "PLC 3 - Pezzi/Min", data: speedDataPLC3.value }]);

const colorText1= computed(() => {
  const stati= plc1.getStati[0];
  if (stati.acceso === false){
    return 'text-secondary';
  }else if(stati.blocco === true){
    return 'text-danger';
  }else if(stati.regime === true){
    return 'text-info';
  }else {
    return 'text-success';
  }
});

const colorText2= computed(() => {
  const stati= plc2.getStati[0];
  if (stati.acceso === false){
    return 'text-secondary';
  }else if(stati.blocco === true){
    return 'text-danger';
  }else if(stati.regime === true){
    return 'text-info';
  }else {
    return 'text-success';
  }
});

const colorText3= computed(() => {
  const stati= plc2.getStati[0];
  if (stati.acceso === false){
    return 'text-secondary';
  }else if(stati.blocco === true){
    return 'text-danger';
  }else if(stati.regime === true){
    return 'text-info';
  }else {
    return 'text-success';
  }
});

</script>

<style scoped>
/* Definiamo le variabili per coerenza con il tuo tema */
:root {
  --color-primary: #14265a;
  --color-secondary: #6c757d;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  --color-success: #28a745;
  --color-border-light: #dee2e6;
}

/* -------------------------------------- */
/* LAYOUT BASE */
/* -------------------------------------- */
.display-6 {
    font-size: 2.2rem;
}

.separator-line {
    height: 1px;
    background-color: var(--color-border-light);
    opacity: 1;
    width: 20%; /* Rende la linea corta e centrata */
    margin-top: 0.5rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-primary);
    border-bottom: 2px solid #dee2e6;
    padding-bottom: 0.5rem;
}

/* -------------------------------------- */
/* STILE KPI AGGREGATI */
/* -------------------------------------- */
.kpi-card {
    background-color: white;
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    padding: 1.5rem;
    height: 100%;
}

.kpi-label {
    font-size: 0.9rem;
    color: var(--color-secondary);
    margin-bottom: 0.5rem;
}

.kpi-value {
    font-size: 2.2rem;
    font-weight: 700;
}

/* -------------------------------------- */
/* STILE GRAFICI (CHART CARDS) */
/* -------------------------------------- */
.chart-card {
    border: 1px solid var(--color-border-light);
    border-radius: 8px;
    height: 100%;
}

.card-header {
    background-color: #f8f9fa !important;
    border-bottom: 1px solid var(--color-border-light);
}

.chart-placeholder {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #adb5bd;
    border: 2px dashed #e9ecef;
    border-radius: 4px;
    font-style: italic;
    background-color: #f8f9fa;
}

/* -------------------------------------- */
/* STILE STATUS CARD LIVE */
/* -------------------------------------- */
.status-card {
    border: 1px solid var(--color-border-light);
    border-left: 5px solid var(--color-primary); /* Bordo di accento a sinistra */
    border-radius: 8px;
    background-color: white;
}
header h1.text-primary {
    color: var(--color-primary) !important;
}
</style>
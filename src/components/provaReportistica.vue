<template>
  <div class="report-container">

    <div class="card p-4 mb-4 shadow-sm filter-block">
        <div class="row align-items-end g-3">

            <div class="col-md-auto">
                <label for="reportType" class="form-label fw-bold">Tipo Report</label>
                <select class="form-select" id="reportType" v-model="reportType">
                    <option value="daily">Report Giornaliero</option>
                    <option value="range">Report Intervallo Date</option>
                </select>
            </div>

            <div class="col-md-auto">
                <label for="startDate" class="form-label fw-bold">{{ reportType === 'daily' ? 'Giorno Selezionato' : 'Data Inizio' }}</label>
                <input type="date" class="form-control" id="startDate" v-model="startDate">
            </div>

            <div class="col-md-auto" v-if="reportType === 'range'">
                <label for="endDate" class="form-label fw-bold">Data Fine</label>
                <input type="date" class="form-control" id="endDate" v-model="endDate">
            </div>

            <div class="col-md-auto">
                <button class="btn btn-primary" @click="fetchReportData" :disabled="isLoading">
                    <i v-if="isLoading" class="spinner-border spinner-border-sm me-2"></i>
                    <i v-else class="bi bi-search me-2"></i>
                    Genera Report
                </button>
            </div>

        </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
      <p class="mt-2 text-secondary">Caricamento dati di reportistica per {{ plcId }}...</p>
    </div>

    <div v-else>
        <p v-if="filteredReportData.length > 0 || filteredContatoriData.length > 0 || filteredNotificheData.length > 0" class="text-muted small">
            Stati filtrati: **{{ filteredReportData.length }}** record | Contatori filtrati: **{{ filteredContatoriData.length }}** record | Notifiche filtrate: **{{ filteredNotificheData.length }}** record
        </p>

        <h3 class="report-section-title">Riepilogo Prestazioni</h3>
        <div class="row g-4 mb-5">

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Produzione Totale (Pezzi)</p>
              <h3 class="kpi-value text-primary">{{pezziTotali}}</h3> </div>
          </div>

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Velocità Media</p>
              <h3 class="kpi-value text-success">{{ velocitaMedia }}</h3> </div>
          </div>

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Temperatura Media</p>
              <h3 class="kpi-value text-info">{{ temperaturaMedia }}</h3> </div>
          </div>

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Allarmi/Warning Totali</p>
              <h3 class="kpi-value text-danger">{{ allarmiTotali }}</h3> </div>
          </div>
        </div>

        <h3 class="report-section-title">Analisi Temporale e Stato Macchina</h3>
        <div class="row g-4 mb-5">

          <div class="col-lg-6">
            <div class="card shadow-sm chart-card">
              <div class="card-header bg-light text-primary fw-bold">Tendenza Produzione (Pezzi al Minuto)</div>
              <div class="card-body">
                <div class="chart-placeholder">Grafico a Linee (Placeholder - basato su Contatori)</div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card shadow-sm chart-card">
              <div class="card-header bg-light text-primary fw-bold">Distribuzione Tempo di Stato</div>
              <div class="card-body">
                <div class="chart-placeholder">Grafico a Barre Impilate (Placeholder - basato su Stati)</div>
              </div>
            </div>
          </div>
        </div>

        <h3 class="report-section-title">Dettaglio Allarmi e Warning</h3>
        <div class="row g-4 mb-5">
            <div class="col-lg-5">
                <div class="card shadow-sm chart-card">
                    <div class="card-header bg-light text-primary fw-bold">Ripartizione Tipi di Allarme/Warning</div>
                    <div class="card-body">
                        <div class="chart-placeholder">Grafico a Torta / Anello (Placeholder - basato su Notifiche)</div>
                    </div>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="card shadow-sm chart-card">
                    <div class="card-header bg-light text-primary fw-bold">Tabella Dettaglio Eventi Storici</div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-sm">
                                <thead>
                                    <tr>
                                        <th>Codice</th>
                                        <th>Descrizione</th>
                                        <th>Data/Ora Inizio</th>
                                        <th>Durata (min)</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-if="filteredNotificheData.length === 0">
                                        <td colspan="5" class="text-center text-secondary">Nessuna notifica trovata nel periodo.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch} from 'vue';
import {usePlc1Store, usePlc2Store, usePlc3Store} from "@/stores/index.js";

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

const props = defineProps({
  plcId: {
    type: String,
    required: true,
  }
});

// --- VARIABILI REATTIVE PER I FILTRI ---
const reportType = ref('daily');
const startDate = ref(getTodayDate());
const endDate = ref(getTodayDate());
const isLoading = ref(false);

// --- VARIABILI REATTIVE PER I DATI FILTRATI (LE TRE BASI) ---
const filteredReportData = ref([]);    // Stati
const filteredContatoriData = ref([]);  // Contatori
const filteredNotificheData = ref([]);  // Notifiche

// --- VARIABILI REATTIVE PER I KPI ---
const pezziTotali = ref(0);
const velocitaMedia = ref(0);
const temperaturaMedia = ref(0);
const allarmiTotali = ref(0);


// --- FUNZIONI DI BASE ---

/** Ottiene la data di oggi in formato YYYY-MM-DD. */
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Ottiene tutti i dati grezzi dal Vuex/Pinia store corretto.
 * @param {string} dataType - 'stati', 'contatori' o 'notifiche'
 */
function getRawData(dataType) {
    let store;
    switch (props.plcId) {
        case 'PLC1': store = plc1; break;
        case 'PLC2': store = plc2; break;
        case 'PLC3': store = plc3; break;
        default: return [];
    }

    if (dataType === 'stati') {
        return store.getStati || [];
    } else if (dataType === 'contatori') {
        return store.getContatori || [];
    } else if (dataType === 'notifiche') {
        return store.getNotifiche || [];
    }
    return [];
}


/**
 * Trova il primo record precedente alla data di inizio filtro.
 * Assumiamo che la lista 'data' sia ordinata per data decrescente (la prima è la più recente).
 *
 * @param {Array<Object>} data L'array di dizionari non filtrato.
 * @param {string} startDateString La data di inizio del filtro (es. '2025-10-28').
 * @returns {Object|null} Il dizionario immediatamente precedente a startDate, o null.
 */
function getPrecedingRecord(data, startDateString) {
    if (!data || data.length === 0) {
        return null;
    }

    const startTimestamp = new Date(`${startDateString}T00:00:00.000Z`).getTime();

    // Poiché i dati sono ordinati in modo decrescente (dal più recente al più vecchio):
    // Il filtro è: itemTimestamp >= startTimestamp.
    // L'elemento precedente è il primo elemento per cui itemTimestamp < startTimestamp.

    for (let i = 0; i < data.length; i++) {
        const itemTimestamp = new Date(data[i].ora).getTime();

        // Se troviamo un elemento più vecchio della data di inizio (startTimestamp)
        if (itemTimestamp < startTimestamp) {
            return data[i];
        }
    }

    return null; // Nessun record trovato precedente all'inizio del report
}


/**
 * Filtra una lista di dizionari in base al campo 'ora' e aggiunge il record precedente.
 *
 * @param {Array<Object>} data L'array di dizionari da filtrare.
 * @param {string} startDateString La data di inizio del filtro.
 * @param {string} finalEndDateString La data di fine del filtro.
 * @param {boolean} includePreceding Se TRUE, include il record immediatamente precedente (per Stati e Contatori).
 * @returns {Array<Object>} I dizionari filtrati.
 */
function filterDataByTimeRange(data, startDateString, finalEndDateString, includePreceding = false) {
    if (!data || data.length === 0) {
        return [];
    }

    const startTimestamp = new Date(`${startDateString}T00:00:00.000Z`).getTime();
    const nextDay = new Date(`${finalEndDateString}T00:00:00.000Z`);
    nextDay.setDate(nextDay.getDate() + 1);
    const endTimestamp = nextDay.getTime();

    // 1. Filtra i dati all'interno dell'intervallo
    let filtered = data.filter(item => {
        const itemTimestamp = new Date(item.ora).getTime();
        // Condizione standard: >= Inizio E < Fine
        return itemTimestamp >= startTimestamp && itemTimestamp < endTimestamp;
    });

    // 2. Aggiungi l'elemento precedente se richiesto (per Stati e Contatori)
    if (includePreceding) {
        const precedingRecord = getPrecedingRecord(data, startDateString);

        if (precedingRecord) {
            // Aggiungiamo il record precedente. Poiché l'input è decrescente,
            // il record precedente (il più vecchio) viene aggiunto in fondo.
            filtered.push(precedingRecord);
        }
    }

    return filtered;
}


// --- FUNZIONI DI CALCOLO (REIMPOSTATE) ---

function setPezziTotali() {
  if(filteredContatoriData.value.length > 0) {
      // Uso il primo e l'ultimo elemento della lista filtrata
      pezziTotali.value =  (filteredContatoriData.value[0].contatorepezzitotale || 0) - (filteredContatoriData.value[filteredContatoriData.value.length - 1].contatorepezzitotale || 0);
  } else {
      pezziTotali.value = 0;
  }
}

function calcolaVelocitaMedia() {
  if(filteredContatoriData.value.length > 0) {
    const listaDati = filteredContatoriData.value;
    const sommaVelocita = listaDati.reduce((sum, item) => {
      const velocita = item.velocitaproduzionepezziminuto || 0;
      return sum + velocita;
    }, 0);
    // Media aritmetica su tutti gli elementi (inclusi eventuali record precedenti)
    velocitaMedia.value = (sommaVelocita/ listaDati.length).toFixed(2);
  } else {
      velocitaMedia.value = 0;
  }
}

function calcolaTemperaturaMedia() {
    if(filteredContatoriData.value.length > 0) {
    const listaDati = filteredContatoriData.value;
    const sommaTemperatura = listaDati.reduce((sum, item) => {
      const temperatura = item.temperaturacpu || 0;
      return sum + temperatura;
    }, 0);
    // Media aritmetica su tutti gli elementi (inclusi eventuali record precedenti)
    temperaturaMedia.value = (sommaTemperatura/ listaDati.length).toFixed(2);
  } else {
      temperaturaMedia.value = 0;
  }
}

function contaAllarmiTotali() {
    // Questa funzione è rimasta invariata rispetto alla versione precedente
    let listaDati = filteredNotificheData.value.filter(item => item.stato);
    allarmiTotali.value = listaDati.length;
}

/** Aggiorna tutti i calcoli KPI. */
function updateAllKPIs() {
    setPezziTotali();
    calcolaVelocitaMedia();
    calcolaTemperaturaMedia();
    contaAllarmiTotali();
}


const fetchReportData = async () => {
    // 1. Validazione Filtri
    let finalEndDate = endDate.value;
    if (reportType.value === 'daily') {
        finalEndDate = startDate.value;
    }

    if (startDate.value && finalEndDate && startDate.value > finalEndDate) {
        alert("Attenzione: La Data Inizio non può essere successiva alla Data Fine.");
        return;
    }

    isLoading.value = true;

    // 2. RECUPERA E FILTRA TUTTE E TRE LE LISTE

    // Filtra gli STATI (include l'elemento precedente)
    const rawStati = getRawData('stati');
    filteredReportData.value = filterDataByTimeRange(rawStati, startDate.value, finalEndDate, true);

    // Filtra i CONTATORI (include l'elemento precedente)
    const rawContatori = getRawData('contatori');
    filteredContatoriData.value = filterDataByTimeRange(rawContatori, startDate.value, finalEndDate, true);

    // Filtra le NOTIFICHE (NON include l'elemento precedente)
    const rawNotifiche = getRawData('notifiche');
    filteredNotificheData.value = filterDataByTimeRange(rawNotifiche, startDate.value, finalEndDate, false);

    // 3. AGGIORNA TUTTI I CALCOLI
    updateAllKPIs();

    isLoading.value = false;
};


// --- WATCHERS E HOOKS ---

// Carica il report iniziale all'apertura del componente
fetchReportData();

// Ricarica il report quando il PLC ID cambia
watch(() => props.plcId, () => {
    fetchReportData();
});

// Watchers per i filtri che ricaricano i dati
watch([startDate, endDate, reportType], (newValues, oldValues) => {
    // Gestione del report giornaliero (assicura che endDate = startDate)
    if (reportType.value === 'daily' && startDate.value !== endDate.value) {
        endDate.value = startDate.value;
        // La chiamata a fetchReportData è gestita dal successivo trigger di watch su endDate
        return;
    }

    // Esegui la ricerca se i valori non sono uguali
    if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1] || newValues[2] !== oldValues[2]) {
        fetchReportData();
    }
});

</script>

<style scoped>
/* Il CSS non è stato modificato */
:root {
  --color-primary: #14265a;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
}

.report-container {
    padding: 1rem;
}

.report-section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-primary);
    border-bottom: 2px solid #dee2e6;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    margin-top: 2rem;
}

.filter-block {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
}

.kpi-card {
    background-color: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
    height: 100%;
}

.kpi-label {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
}

.kpi-value {
    font-size: 2.2rem;
    font-weight: 700;
}

.chart-card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    height: 100%;
}

.card-header {
    background-color: #f8f9fa !important;
    border-bottom: 1px solid #dee2e6;
}

.chart-placeholder {
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #adb5bd;
    border: 2px dashed #e9ecef;
    border-radius: 4px;
    font-style: italic;
    background-color: #f8f9fa;
}
</style>
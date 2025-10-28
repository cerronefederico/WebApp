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
        <h3 class="report-section-title">Riepilogo Prestazioni</h3>
        <div class="row g-4 mb-5">

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Produzione Totale (Pezzi)</p>
              <h3 class="kpi-value text-primary">0</h3> </div>
          </div>

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Velocità Media</p>
              <h3 class="kpi-value text-success">0h</h3> </div>
          </div>

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Temperatura Media</p>
              <h3 class="kpi-value text-info">0%</h3> </div>
          </div>

          <div class="col-md-3">
            <div class="kpi-card text-center shadow-sm">
              <p class="kpi-label">Allarmi/Warning Totali</p>
              <h3 class="kpi-value text-danger">0</h3> </div>
          </div>
        </div>

        <h3 class="report-section-title">Analisi Temporale e Stato Macchina</h3>
        <div class="row g-4 mb-5">

          <div class="col-lg-6">
            <div class="card shadow-sm chart-card">
              <div class="card-header bg-light text-primary fw-bold">Tendenza Produzione (Pezzi al Minuto)</div>
              <div class="card-body">
                <div class="chart-placeholder">Grafico a Linee (Placeholder)</div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card shadow-sm chart-card">
              <div class="card-header bg-light text-primary fw-bold">Distribuzione Tempo di Stato</div>
              <div class="card-body">
                <div class="chart-placeholder">Grafico a Barre Impilate (Placeholder)</div>
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
                        <div class="chart-placeholder">Grafico a Torta / Anello (Placeholder)</div>
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
                                    <tr>
                                        <td colspan="5" class="text-center text-secondary">Nessun evento caricato. Genera il report.</td>
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
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  plcId: {
    type: String,
    required: true,
  }
});

// --- VARIABILI REATTIVE PER I FILTRI ---
const reportType = ref('daily'); // 'daily' o 'range'
const startDate = ref(getTodayDate());
const endDate = ref(getTodayDate());
const isLoading = ref(false);

// --- FUNZIONI HELPER ---

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
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

    // 2. Inizia il caricamento (qui andrà la tua chiamata API)
    isLoading.value = true;

    console.log(`Report richiesto per PLC: ${props.plcId} dal ${startDate.value} al ${finalEndDate}`);

    // Implementa qui la TUA logica di chiamata API a PostgreSQL
    // Esempio: const data = await api.fetchReport(props.plcId, startDate.value, finalEndDate);

    // Simulo solo la fine del caricamento
    setTimeout(() => {
        isLoading.value = false;
        // QUI ANDRÀ LA LOGICA PER ASSEGNARE I DATI RICEVUTI AI TUOI GRAFICI E KPI
    }, 800);
};

// --- WATCHERS E HOOKS ---

// Carica il report iniziale all'apertura del componente
fetchReportData();

// Ricarica il report quando il PLC ID cambia
watch(() => props.plcId, () => {
    fetchReportData();
});

// Resetta la data di fine quando si passa a Report Giornaliero
watch(reportType, (newType) => {
    if (newType === 'daily') {
        endDate.value = startDate.value;
    }
});
</script>

<style scoped>

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
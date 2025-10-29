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
        <div class="kpi-card text-center shadow-sm bg-primary-light">
          <p class="kpi-label">Produzione Totale (Pezzi)</p>
          <h3 class="kpi-value text-primary fw-bolder">0</h3> </div>
      </div>

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-sm bg-info-light">
          <p class="kpi-label">Efficienza Media</p>
          <h3 class="kpi-value text-info fw-bolder">0%</h3> </div>
      </div>

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-sm bg-danger-light">
          <p class="kpi-label">Allarmi Attivati</p>
          <h3 class="kpi-value text-danger fw-bolder">0</h3> </div>
      </div>

      <div class="col-md-3">
        <div class="kpi-card text-center shadow-sm bg-warning-light">
          <p class="kpi-label">Warning Attivati</p>
          <h3 class="kpi-value text-warning fw-bolder">0</h3> </div>
      </div>
    </div>

    <h2 class="section-title mb-4">Confronto Prestazioni Giornaliere</h2>
    <div class="row g-4 mb-5">

      <div class="col-lg-6">
        <div class="card shadow chart-card">
          <div class="card-header bg-light text-primary fw-bold">Produzione Totale (Pezzi) per PLC</div>
          <div class="card-body">
            <div class="chart-placeholder">Grafico a Barre: PLC1 vs PLC2 vs PLC3</div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card shadow chart-card">
          <div class="card-header bg-light text-primary fw-bold">Efficienza Operativa (%) per PLC</div>
          <div class="card-body">
            <div class="chart-placeholder">Grafico a Barre: Efficienza di ciascun PLC</div>
          </div>
        </div>
      </div>
    </div>

    <h2 class="section-title mb-4">Stato Live e Velocità Attuale</h2>
    <div class="row g-4">

      <div class="col-md-4">
        <div class="status-card p-4 shadow-sm">
            <h4 class="text-primary">PLC 1</h4>
            <p class="mb-1">Stato: <strong class="text-success">A Regime</strong></p>
            <p class="mb-1">Pezzi/Min: <strong>0</strong></p>
            <p class="mb-3">Allarmi Live: <strong class="text-danger">0</strong></p>
          <router-link to="/history/report">
            <button class="btn btn-sm btn-outline-primary w-100">Visualizza Report Dettagliato</button>
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="status-card p-4 shadow-sm">
            <h4 class="text-primary">PLC 2</h4>
            <p class="mb-1">Stato: <strong class="text-warning">In Blocco</strong></p>
            <p class="mb-1">Pezzi/Min: <strong>0</strong></p>
            <p class="mb-3">Allarmi Live: <strong class="text-danger">0</strong></p>
          <router-link to="/history/report">
            <button class="btn btn-sm btn-outline-primary w-100">Visualizza Report Dettagliato</button>
          </router-link>
        </div>
      </div>

      <div class="col-md-4">
        <div class="status-card p-4 shadow-sm">
            <h4 class="text-primary">PLC 3</h4>
            <p class="mb-1">Stato: <strong class="text-secondary">Spenta</strong></p>
            <p class="mb-1">Pezzi/Min: <strong>0</strong></p>
            <p class="mb-3">Allarmi Live: <strong class="text-danger">0</strong></p>
          <router-link to="/history/report">
            <button class="btn btn-sm btn-outline-primary w-100">Visualizza Report Dettagliato</button>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
// Qui importerai e userai i tuoi store Pinia per i dati live
// e il tuo servizio API per i dati storici (produzione/efficienza giornaliera).

// Non c'è logica specifica qui, poiché i dati non vengono gestiti.
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
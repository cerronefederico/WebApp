<template>
  <div class="container py-4">

    <div class="page-header text-center">
      <h1 class="text-primary display-6">Reportistica completa</h1>

      <div class="separator-line"></div>

      <p class="lead text-secondary">Scegli un PLC per visualizzare la sua reportistica.</p>
    </div>

    <div class="row g-4 cards-row">

      <div class="col-12 col-md-6 col-lg-4">
        <div
          class="card text-bg-dark plc-card"
          @click="selectPlc('PLC1')"
          :class="{ 'selected': selectedPlc === 'PLC1' }"
        >
          <img
            src="/img/provaPlcCard.png"
            alt="Immagine PLC 1"
            class="card-img"
            style="height: 270px; object-fit: cover;"
          >

          <div class="card-img-overlay">
            <h5 class="card-title">Report PLC 1</h5>
            <p class="card-text">Dettaglio produzione e allarmi. Clicca per visualizzare la reportistica completa.</p>
            <p class="card-text"><small>Ultimo report generato: 3 min fa</small></p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        <div
          class="card text-bg-dark plc-card"
          @click="selectPlc('PLC2')"
          :class="{ 'selected': selectedPlc === 'PLC2' }"
        >
          <img
            src="/img/provaPlcCard1.png"
            alt="Immagine PLC 2"
            class="card-img"
            style="height: 270px; object-fit: cover;"
          >

          <div class="card-img-overlay">
            <h5 class="card-title">Report PLC 2</h5>
            <p class="card-text">Dettaglio produzione e allarmi. Clicca per visualizzare la reportistica completa.</p>
            <p class="card-text"><small>Ultimo report generato: 5 min fa</small></p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-4">
        <div
          class="card text-bg-dark plc-card"
          @click="selectPlc('PLC3')"
          :class="{ 'selected': selectedPlc === 'PLC3' }"
        >
          <img
            src="/img/provaPlcCard2.png"
            alt="Immagine PLC 3"
            class="card-img"
            style="height: 270px; object-fit: cover;"
          >

          <div class="card-img-overlay">
            <h5 class="card-title">Report PLC 3</h5>
            <p class="card-text">Dettaglio produzione e allarmi. Clicca per visualizzare la reportistica completa.</p>
            <p class="card-text"><small>Ultimo report generato: 10 min fa</small></p>
          </div>
        </div>
      </div>

    </div>

    <Transition name="fade-slide">
      <div v-if="selectedPlc" :key="selectedPlc" class="plc-report-detail card shadow-lg p-4">

        <h2 class="text-primary mb-4">Report Dettagliato: {{ selectedPlc }}</h2>

        <button class="btn btn-sm btn-outline-secondary close-button" @click="selectedPlc = null">
          Chiudi Report
        </button>

        <div class="report-content mt-3">
          <prova-reportistica :plc-id="selectedPlc" />
        </div>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'; // ⭐ AGGIUNTE NECESSARIE
const selectedPlc = ref(null);
import provaReportistica from './provaReportistica.vue';

// 1. DEFINIZIONE DELLA PROP RICEVUTA DALLA ROUTE
const props = defineProps({
  plcId: {
    type: String,
    default: null,
  }
});

/**
 * Funzione per selezionare/deselezionare un PLC.
 * @param {string} plcId - L'identificatore del PLC (e.g., 'PLC1')
 */
const selectPlc = (plcId) => {
  if (selectedPlc.value === plcId) {
    selectedPlc.value = null;
  } else {
    selectedPlc.value = plcId;
  }
};

// 2. HOOK DI INIZIALIZZAZIONE (LEGGE IL PARAMETRO ALL'AVVIO)
onMounted(() => {
    // Se la prop 'plcId' è stata passata dall'URL (cioè se arriviamo da DatiProduzione.vue)
    if (props.plcId) {
        // IMPOSTA LO STATO LOCALE PER APRIRE DIRETTAMENTE IL REPORT
        selectedPlc.value = props.plcId;
    }
});
</script>

<style scoped>
:root {
  --color-primary: #14265a;
  --color-accent-cta: #004f70;
  --color-secondary: #6c757d;
  --color-border-light: rgba(248, 249, 250, 0.27);
}

/* ... (Il resto dello stile rimane invariato) ... */

.page-header {
    margin-bottom: 0;
    padding-bottom: 0.5rem;
    text-align: center;
}

/* Stile per l'h1: Rendi il testo BLU SCURO e in GRASSETTO deciso */
.page-header h1 {
    color: var(--color-primary) !important;
    font-weight: 800; /* Grassetto extra-bold */
    margin-bottom: 0.25rem !important;
}

.page-header .lead {
    color: var(--color-secondary);
    font-size: 1.25rem; /* Aumentato il font-size */
    margin-top: 0.75rem !important;
    margin-bottom: 0 !important;
}

.separator-line {
    height: 1px;
    background-color: #3c3c3c;
    opacity: 1;
    width: 80%;
    margin: 0.5rem auto;
}


.cards-row {
    margin-top: 1rem !important;
    margin-bottom: 3rem !important;
}

.plc-card {
  cursor: pointer;
  border: 4px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
}

.plc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.plc-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 6px rgba(20, 38, 90, 0.3);
}

.card-img-overlay {
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-title, .card-text {
  color: white;
}

.plc-report-detail {
  position: relative;
  background-color: white;
  border-radius: 12px;
  min-height: 500px;
  border: 1px solid var(--color-primary);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.close-button {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
}


.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
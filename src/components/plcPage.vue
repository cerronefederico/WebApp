<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount , computed } from 'vue';
import { useRoute } from 'vue-router';
import { Popover } from 'bootstrap';

// Importiamo tutti gli store necessari
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';

import StatistichePlc from "@/components/statistichePlc.vue";
import ContatorePlc from "@/components/contatorePlc.vue";
import WarningPlc from "@/components/warningPlc.vue";
import AllarmPlc from "@/components/allarmPlc.vue";


const route = useRoute();

const currentPlcStore = computed(() => {
    const routeName = route.name;
    switch (routeName) {
        case 'Plc1': return usePlc1Store();
        case 'Plc2': return usePlc2Store();
        case 'Plc3': return usePlc3Store();
        default: return null;
    }
});

const currentPlcId = computed(() => {
    return route.name ? String(route.name).toUpperCase() : 'PLC Sconosciuto';
});

const currentPlcIp = computed(() => {
    switch (currentPlcId.value) {
        case 'PLC1': return '192.168.40.13';
        case 'PLC2': return '192.168.40.14';
        case 'PLC3': return '192.168.40.15';
        default: return 'N/A';
    }
});

const pallinoElement = ref(null);
let popoverInstance = null;

onMounted(() => {
  if (pallinoElement.value) {
    popoverInstance = new Popover(pallinoElement.value);
  }
});

onBeforeUnmount(() => {
    if (popoverInstance) {
        popoverInstance.dispose();
    }
});

const pallinoStyle = computed(() => {
    const store = currentPlcStore.value;
    if (!store || !store.getStati || store.getStati.length === 0) {
        return { 'background-color': '#6c757d', cursor: 'pointer', height: '24px', width: '24px' };
    }
    const stato = store.getStati[0];
    let backgroundColor = '#6c757d';
    if (stato.acceso === false) {
        backgroundColor = 'red';
    }
    else if (stato.acceso === true && stato.blocco === true) {
        backgroundColor = 'yellow';
    }
    else if (stato.acceso === true && stato.blocco !== true && stato.regime === true) {
        backgroundColor = 'blue';
    }
    else if (stato.acceso === true && stato.blocco !== true && stato.regime !== true) {
        backgroundColor = 'green';
    }
    return {
        'background-color': backgroundColor,
        cursor: 'pointer',
        height: '24px',
        width: '24px',
    };
});


const plcData = ref({
    plcImageUrl: "https://placehold.co/150x150/007bff/ffffff?text=PLC",
});


const plcStato = computed(() => {
    const store = currentPlcStore.value;
    if (!store || !store.getStati || store.getStati.length === 0) {
        return { acceso: false, blocco: false, regime: false, datiDisponibili: false };
    }
    return { ...store.getStati[0], datiDisponibili: true };
});


</script>

<template>
  <div class="container-fluid py-4 mx-auto" style="max-width: 1400px;">

    <div v-if="!currentPlcStore" class="alert alert-danger text-center">
        Errore: Dati PLC non disponibili per questa rotta.
    </div>

    <div v-else class="row">

      <div class="col-12 col-lg-4 mb-3">
        <div class="card shadow-sm fixed-height-card">
          <div class="card-body text-center">

            <img :src="plcData.plcImageUrl" alt="Immagine PLC" class="img-fluid rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;">

            <h4 class="card-title text-primary">{{ currentPlcId }}</h4>
            <ul class="list-group list-group-flush text-start">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Stato Macchina:</strong>
                 <span
                    ref="pallinoElement"
                    tabindex="0"
                    class="d-inline-block p-2 rounded-circle"
                    :style="pallinoStyle"
                    data-bs-toggle="popover"
                    data-bs-trigger="hover"
                    data-bs-placement="top"
                    data-bs-html="true"
                    data-bs-title="Legenda Stato Colori"
                    data-bs-content='
                        <ul class="list-unstyled mb-0 small">
                            <li class="d-flex align-items-center mb-1">
                                <span class="d-inline-block rounded-circle me-2" style="width: 10px; height: 10px; background-color: blue;"></span>
                                <span class="fw-bold text-primary">Blu</span>: A regime
                            </li>
                            <li class="d-flex align-items-center">
                                <span class="d-inline-block rounded-circle me-2" style="width: 10px; height: 10px; background-color: green;"></span>
                                <span class="fw-bold text-success">Verde</span>: Accesa
                            </li>
                            <li class="d-flex align-items-center mb-1">
                                <span class="d-inline-block rounded-circle me-2" style="width: 10px; height: 10px; background-color: yellow;"></span>
                                <span class="fw-bold text-warning">Giallo</span>: In Blocco
                            </li>
                            <li class="d-flex align-items-center mb-1">
                                <span class="d-inline-block rounded-circle me-2" style="width: 10px; height: 10px; background-color: red;"></span>
                                <span class="fw-bold text-danger">Rosso</span>: Spenta
                            </li>
                        </ul>
                    '
                    aria-label="Informazioni sui colori dello stato"
                >
                </span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Indirizzo IP:</strong>
                <span>{{ currentPlcIp }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Macchina Accesa:</strong>
                <template v-if="plcStato.datiDisponibili">
                    <span v-if="plcStato.acceso === true" class="text-success">Accesa</span>
                    <span v-else class="text-danger">Spenta</span>
                </template>
                <template v-else><span class="text-muted">N/A</span></template>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Blocco Macchina:</strong>
                <template v-if="plcStato.datiDisponibili">
                    <span  v-if="plcStato.blocco === true" class="text-danger">In Blocco</span>
                    <span  v-else class="text-success">Regolare</span>
                </template>
                <template v-else><span class="text-muted">N/A</span></template>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Macchina a regime:</strong>
                <template v-if="plcStato.datiDisponibili">
                    <span  v-if="plcStato.regime === true" class="text-success">A Regime</span>
                    <span  v-else class="text-warning">Non A Regime</span>
                </template>
                <template v-else><span class="text-muted">N/A</span></template>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header p-0">
            <ul class="nav nav-pills mb-3" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="contatori-tab" data-bs-toggle="pill" data-bs-target="#contatori" type="button" role="tab" aria-controls="contatori" aria-selected="true">Contatori</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="warning-tab" data-bs-toggle="pill" data-bs-target="#warning" type="button" role="tab" aria-controls="warning" aria-selected="false">Warning</button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="allarm-tab" data-bs-toggle="pill" data-bs-target="#allarm" type="button" role="tab" aria-controls="allarm" aria-selected="false">Allarm</button>
              </li>
            </ul>
          </div>
          <div class="tab-content" >
            <div class="tab-pane fade show active" id="contatori" role="tabpanel" aria-labelledby="contatori-tab" tabindex="0">
              <ContatorePlc :plc-store="currentPlcStore" :plc-id="currentPlcId"></ContatorePlc>
            </div>
            <div class="tab-pane fade" id="warning" role="tabpanel" aria-labelledby="warning-tab" tabindex="0">
              <WarningPlc :plc-store="currentPlcStore"></WarningPlc>
            </div>
            <div class="tab-pane fade" id="allarm" role="tabpanel" aria-labelledby="allarm-tab" tabindex="0">
              <AllarmPlc :plc-store="currentPlcStore" :plc-id="currentPlcId"></AllarmPlc>
            </div>
          </div>
        </div>
      </div>
    </div>
  <StatistichePlc :plc-store="currentPlcStore"></StatistichePlc>
</div>
</template>

<style scoped>
.container-fluid {
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
}
.card {
    border: none;
    border-radius: 10px;
}
.card-header-tabs .nav-link {
    color: #6c757d;
    border: none;
}
.card-header-tabs .nav-link.active {
    color: #007bff;
    border-bottom: 3px solid #007bff;
    background-color: transparent;
}

/* ⭐ NUOVA CLASSE: Forzare l'altezza massima per impedire lo stretching */
/* L'altezza deve essere impostata per adattarsi al contenuto fisso della card. */
.fixed-height-card {
    /* Impostando max-height, la card non può crescere oltre i suoi contenuti naturali. */
    /* La sua altezza finale sarà determinata dai suoi contenuti, non dalla riga. */
    max-height: 100%;
}

/* Forzare la card a sinistra ad allinearsi in alto se necessario */
.row {
    align-items: flex-start;
}
</style>
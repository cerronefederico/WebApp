<script  setup lang="ts">
import { ref, onMounted, onBeforeUnmount , computed} from 'vue';
import { Popover } from 'bootstrap';
import StatistichePlc from "@/components/statistichePlc.vue";
import ContatorePlc from "@/components/contatorePlc.vue";
import { usePlc1Store} from '@/stores/index';
import WarningPlc from "@/components/warningPlc.vue";

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
    let backgroundColor = '#6c757d';
    if (plc1.getStati.acceso === false) {
        backgroundColor = 'red';
    }
    else if (plc1.getStati.acceso === true && plc1.getStati.blocco === true) {
        backgroundColor = 'yellow';
    }
    else if (plc1.getStati.acceso === true && plc1.getStati.blocco !== true && plc1.getStati.regime === true) {
        backgroundColor = 'blue';
    }
    else if (plc1.getStati.acceso === true && plc1.getStati.blocco !== true && plc1.getStati.regime !== true) {
        backgroundColor = 'green';
    }
    return {
        'background-color': backgroundColor,
        cursor: 'pointer',
        height: '24px',
        width: '24px',
    };
});


const plc1 = usePlc1Store();

const plcData = ref({
    plcImageUrl: "https://placehold.co/150x150/007bff/ffffff?text=PLC",
});


</script>

<template>
  <div class="container-fluid py-4 mx-auto" style="max-width: 1400px;">
    <!-- Colonna Principale del Dettaglio -->
    <div class="row">

      <!-- Colonna Sinistra (4/12): Immagine e Dati Base -->
      <div class="col-12 col-lg-4 mb-3">
        <div class="card shadow-sm h-100">
          <div class="card-body text-center">

            <!-- Immagine PLC -->
            <img :src="plcData.plcImageUrl" alt="Immagine PLC" class="img-fluid rounded-circle mb-3" style="width: 150px; height: 150px; object-fit: cover;">

            <!-- Dati PLC -->
            <h4 class="card-title text-primary">PLC1</h4>
            <ul class="list-group list-group-flush text-start">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Indirizzo IP:</strong>

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
            <span class="d-inline-block rounded-circle me-2" style="width: 10px; height: 10px; background-color: gray;"></span>
            <span class="fw-bold text-success">Verde</span>: Accesa
        </li>
        <li class="d-flex align-items-center mb-1">
            <span class="d-inline-block rounded-circle me-2" style="width: 10px; height: 10px; background-color: yellow;"></span>
            <span class="fw-bold text-warning">Giallo</span>: In Bloco
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
                <strong>Stato Macchina:</strong>
                <span>192.168.40.13</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Macchina Accesa:</strong>
                <span v-if="plc1.getStati.acceso === true" class="text-success">Accesa</span>
                <span v-if="plc1.getStati.acceso === false" class="text-danger">Spenta</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Blocco Macchina:</strong>
                <span v-if="plc1.getStati.blocco === true" class="text-danger">In Blocco</span>
                <span v-if="plc1.getStati.blocco === false" class="text-success">Regolare</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Macchina a regime:</strong>
                <span v-if="plc1.getStati.regime === true" class="text-success">A Regime</span>
                <span v-if="plc1.getStati.regime === false" class="text-warning">Non A Regime</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Colonna Destra (8/12): Menu Tab -->
      <div class="col-12 col-lg-8">
        <div class="card shadow-sm h-100">
          <div class="card-header p-0">
            <!-- Navigazione Tab -->
            <ul class="nav nav-pills mb-3" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="contatori-tab" data-bs-toggle="pill" data-bs-target="#contatori" type="button" role="tab" aria-controls="contatori" aria-selected="true">Contatori</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="warning-tab" data-bs-toggle="pill" data-bs-target="#warning" type="button" role="tab" aria-controls="warning" aria-selected="false">Warning</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="allarm-tab" data-bs-toggle="pill" data-bs-target="#allarm" type="button" role="tab" aria-controls="allarm" aria-selected="false">Contact</button>
  </li>
</ul>
          </div>
          <div class="tab-content" >
  <div class="tab-pane fade show active" id="contatori" role="tabpanel" aria-labelledby="contatori-tab" tabindex="0">
    <ContatorePlc></ContatorePlc>
  </div>
  <div class="tab-pane fade" id="warning" role="tabpanel" aria-labelledby="warning-tab" tabindex="0">
    <WarningPlc></WarningPlc>
  </div>
  <div class="tab-pane fade" id="allarm" role="tabpanel" aria-labelledby="allarm-tab" tabindex="0">...</div>
</div>
        </div>
      </div>
    </div>
  </div>
  <StatistichePlc></StatistichePlc>
</template>


<style scoped>
.container {
    /* Assicuriamo che il contenitore sia il principale per il centraggio */
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
</style>
<script setup lang="ts">
import { ref } from 'vue';
import StatistichePlc from "@/components/statistichePlc.vue";

const plcData = ref({
    name: "PLC Assemblaggio C2",
    ip: "192.168.1.133",
    status: "Operativo",
    plcImageUrl: "https://placehold.co/150x150/007bff/ffffff?text=PLC",
});

const activeTab = ref('alarmi');

// Dati di esempio per la tabella Allarmi
const alarms = ref([
    { id: 101, timestamp: '2025-09-27 10:30:15', description: 'Sensore di pressione critico (Linea 1)', severity: 'Critico' },
    { id: 204, timestamp: '2025-09-27 11:05:40', description: 'Guasto al motore asincrono', severity: 'Grave' },
    { id: 312, timestamp: '2025-09-27 12:45:00', description: 'Anomalia temperatura, fuori specifica', severity: 'Basso' },
]);
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
            <h4 class="card-title text-primary">{{ plcData.name }}</h4>
            <ul class="list-group list-group-flush text-start">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Indirizzo IP:</strong>
                <span>{{ plcData.ip }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <strong>Stato Macchina:</strong>
                <span :class="{'text-success': plcData.status === 'Operativo', 'text-danger': plcData.status !== 'Operativo'}">
                  {{ plcData.status }}
                </span>
              </li>
              <li class="list-group-item">
                <!-- Altri dati specifici da inserire qui -->
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
            <ul class="nav nav-tabs card-header-tabs" role="tablist">
              <li class="nav-item">
                <a class="nav-link"
                   :class="{ active: activeTab === 'alarmi' }"
                   @click.prevent="activeTab = 'alarmi'"
                   id="alarmi-tab" data-bs-toggle="tab" href="#alarmi" role="tab" aria-controls="alarmi" aria-selected="true">
                  Allarmi ({{ alarms.length }})
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link"
                   :class="{ active: activeTab === 'warning' }"
                   @click.prevent="activeTab = 'warning'"
                   id="warning-tab" data-bs-toggle="tab" href="#warning" role="tab" aria-controls="warning" aria-selected="false">
                  Warning
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link"
                   :class="{ active: activeTab === 'contatori' }"
                   @click.prevent="activeTab = 'contatori'"
                   id="contatori-tab" data-bs-toggle="tab" href="#contatori" role="tab" aria-controls="contatori" aria-selected="false">
                  Contatori
                </a>
              </li>
            </ul>
          </div>

          <!-- Contenuto dei Tab -->
          <div class="card-body tab-content p-4">

            <!-- Tab Allarmi -->
            <div class="tab-pane fade"
                 :class="{ 'show active': activeTab === 'alarmi' }"
                 id="alarmi" role="tabpanel" aria-labelledby="alarmi-tab">

              <!-- INIZIO CODICE AGGIUNTO: Tabella Allarmi -->
              <h5 class="mb-3">Lista Allarmi Attivi</h5>
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead class="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Timestamp</th>
                      <th>Descrizione</th>
                      <th>Severità</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- Iterazione sui dati 'alarms' -->
                    <tr v-for="alarm in alarms" :key="alarm.id" :class="{'table-danger': alarm.severity === 'Critico'}">
                      <td>{{ alarm.id }}</td>
                      <td>{{ alarm.timestamp }}</td>
                      <td>{{ alarm.description }}</td>
                      <td>
                        <!-- Badge colorato per la severità -->
                        <span :class="['badge', {
                            'bg-danger': alarm.severity === 'Critico',
                            'bg-warning text-dark': alarm.severity === 'Grave',
                            'bg-info': alarm.severity === 'Basso',
                        }]">
                          {{ alarm.severity }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- FINE CODICE AGGIUNTO -->
            </div>

            <!-- Tab Warning -->
            <div class="tab-pane fade"
                 :class="{ 'show active': activeTab === 'warning' }"
                 id="warning" role="tabpanel" aria-labelledby="warning-tab">
              <p>Contenuto della scheda Warning (ancora vuoto).</p>
            </div>

            <!-- Tab Contatori -->
            <div class="tab-pane fade"
                 :class="{ 'show active': activeTab === 'contatori' }"
                 id="contatori" role="tabpanel" aria-labelledby="contatori-tab">
              <p>Contenuto della scheda Contatori (ancora vuoto).</p>
            </div>

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
<script setup lang="ts">
import { computed, defineProps } from "vue";
import { useRoute } from "vue-router"; // Importa useRoute per il fallback, se necessario

// ⭐ 1. DEFINIZIONE DELLE PROP (plcStore è fondamentale)
const props = defineProps({
  plcStore: {
    type: Object, // L'istanza dello store Pinia iniettata
    required: true,
  },
  // plcId non è strettamente necessario per la logica qui, ma è buona prassi
  plcId: {
    type: String,
    default: 'PLC Sconosciuto',
  }
});

// Aggiungi un controllo per la disponibilità dei dati
const plcStati = computed(() => {
    // Controlla se lo store esiste e se ha l'array getStati definito
    return props.plcStore.getStati && props.plcStore.getStati.length > 0
        ? props.plcStore.getStati[0]
        : null; // Ritorna null se i dati non sono disponibili
});


// 2. LOGICA PER ELENCO ALLARMI DINAMICO
const allarmiList = computed(() => {
    const stati = plcStati.value;

    if (!stati) return []; // Ritorna array vuoto se i dati non sono pronti

    // Mappa gli attributi degli allarmi al testo da visualizzare
    return [
        { key: 'aanomaliagenerica', label: 'Anomalia Generica' },
        { key: 'amotorenastro', label: 'Anomalia Motore Nastro' },
        { key: 'amancanzaconsenso', label: 'Anomalia Mancanza Consenso' },
        { key: 'atemperaturaprodottoalta', label: 'Anomalia Temperatura Prodotto Alta' },
        { key: 'aemergenzainserita', label: 'Anomalia Emergenza Inserita' },
        { key: 'atemperaturacpuelevata', label: 'Anomalia Temperatura CPU Elevata' },
        { key: 'aaggraffatricespenta', label: 'Anomalia Aggraffatrice Spenta' },
        { key: 'anastrospento', label: 'Anomalia Nastro Spento' },
    ].map(alarm => ({
        ...alarm,
        // Ottiene lo stato booleano (true/false) per l'allarme corrente
        is_active: stati[alarm.key] || false,
    }));
});


// 3. LOGICA PER IL FORMATTO DELLA DATA/ORA
const formattedLastUpdate = computed(() => {
    const stati = plcStati.value;
    const oraCompleta = stati?.ora;

    if (!oraCompleta || typeof oraCompleta !== 'string') {
        return 'N/A';
    }

    // Logica di formattazione invariata
    const puntoIndex = oraCompleta.indexOf('.');
    const trimmed = puntoIndex !== -1 ? oraCompleta.substring(0, puntoIndex) : oraCompleta;

    // Rimuove 'T' e i suffissi del fuso orario (es. +02:00)
    return trimmed.replace('T', ' ').replace(/\+\d{2}:\d{2}$/, '');
});

</script>

<template>
<div class="card shadow-sm">
   <div class="card-header text-white">
      <div class="hstack gap-3">
  <div class="p-2">Elenco Allarmi
  <i class="bi bi-shield-fill-exclamation"></i></div>
  <div class="ms-auto">Ultimo Aggiornamento: {{formattedLastUpdate}}</div>
  </div>
    </div>

    <div class="table-scroll-container">
      <table class="table table-hover table-sm mb-0">
        <thead>
          <tr>
            <th style="width: 70%;">Allarmi</th>
            <th style="width: 30%;">Stato</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allarmiList.length === 0">
            <td colspan="2" class="text-center text-muted">Dati PLC non ancora disponibili o non caricati.</td>
          </tr>

          <tr v-for="alarm in allarmiList" :key="alarm.key"
              :class="{ 'table-danger': alarm.is_active, 'table-info': !alarm.is_active }">
            <td>
               <span class="status-text" :class="{ 'text-danger': alarm.is_active, 'text-success': !alarm.is_active }">{{ alarm.label }}</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': alarm.is_active }]"></span>

                    <span :class="{ 'text-danger': alarm.is_active, 'text-success': !alarm.is_active }">
                        {{ alarm.is_active ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<style scoped>
/* Il blocco style rimane invariato e definito qui */
.table-scroll-container {
    max-height: 400px; /* Aggiunto un limite per scroll verticale se la lista è lunga */
    overflow-y: auto;
}

.status-text {
    font-weight: 500;
    margin-right: 15px;
    flex-grow: 1;
}

.status-badge-wrapper {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 0.8rem;
    gap: 7px;
    flex-shrink: 0;
}

/* IL PALLINO COLORATO */
.status-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--bs-success, #198754);
    box-shadow: 0 0 5px var(--bs-success, #198754);
    transition: background-color 0.3s, box-shadow 0.3s;
}

.status-dot.dot-active {
    background-color: var(--bs-danger, #dc3545);
    box-shadow: 0 0 8px var(--bs-danger, #dc3545);
}
.card-header{
  background-color: #14265a;
}
</style>
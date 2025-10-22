<script setup lang="ts">
import { computed, defineProps } from "vue";
// Rimosso: import { usePlc1Store} from '@/stores/index';

// ⭐ Definisco la prop per ricevere lo store
const props = defineProps({
  plcStore: {
    type: Object,
    required: true,
  },
});

// ⭐ Uso props.plcStore per accedere ai dati
const formattedLastUpdate = computed(() => {
    const oraCompleta = props.plcStore.getStati[0]?.ora;
    if (!oraCompleta || typeof oraCompleta !== 'string') {
        return 'N/A';
    }
    const puntoIndex = oraCompleta.indexOf('.');
    if (puntoIndex !== -1) {
        return oraCompleta.substring(0, puntoIndex).replace('T', ' ');
    }
    const plusIndex = oraCompleta.indexOf('+');
    if (plusIndex !== -1) {
        return oraCompleta.substring(0, plusIndex).replace('T', ' ');
    }

    return oraCompleta.replace('T', ' ');
});

// Variabile di stato per semplificare il template
const stato = computed(() => props.plcStore.getStati[0]);

</script>

<template>
<div class="card shadow-sm">

    <div class="card-header text-white">
      <div class="hstack gap-3">
  <div class="p-2">Elenco Warning
  <i class="bi bi-shield-fill-exclamation"></i>
  </div>
  <div class="ms-auto">Ultimo Aggiornamento: {{formattedLastUpdate}}</div>
  </div>
    </div>

    <div class="table-scroll-container">
      <table class="table table-hover table-sm mb-0">
        <thead>
          <tr>
            <th style="width: 70%;">Warning</th>
            <th style="width: 30%;">stato</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{ 'table-warning': stato.wtermico, 'table-info': !stato.wtermico }">
            <td>
               <span class="status-text" :class="{ 'text-warning': stato.wtermico, 'text-success': !stato.wtermico }">Warning Termico</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': stato.wtermico }]"></span>

                    <span :class="{ 'text-warning': stato.wtermico, 'text-success': !stato.wtermico }">
                        {{ stato.wtermico ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
        <tr :class="{ 'table-warning': stato.wanomalianastro, 'table-info': !stato.wanomalianastro }">
            <td>
               <span class="status-text" :class="{ 'text-warning': stato.wanomalianastro, 'text-success': !stato.wanomalianastro }">Warning Anomalia Nastro</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': stato.wanomalianastro }]"></span>

                    <span :class="{ 'text-warning': stato.wanomalianastro, 'text-success': !stato.wanomalianastro }">
                        {{ stato.wanomalianastro ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
                <tr :class="{ 'table-warning': stato.wmancanzaprodotto, 'table-info': !stato.wmancanzaprodotto }">
            <td>
               <span class="status-text" :class="{ 'text-warning': stato.wmancanzaprodotto, 'text-success': !stato.wmancanzaprodotto }">Warning Mancanza Prodotto</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': stato.wmancanzaprodotto }]"></span>

                    <span :class="{ 'text-warning': stato.wmancanzaprodotto, 'text-success': !stato.wmancanzaprodotto }">
                        {{ stato.wmancanzaprodotto ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
                        <tr :class="{ 'table-warning': stato.wpieno, 'table-info': !stato.wpieno }">
            <td>
               <span class="status-text" :class="{ 'text-warning': stato.wpieno, 'text-success': !stato.wpieno }">Warning Pieno</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': stato.wpieno }]"></span>

                    <span :class="{ 'text-warning': stato.wpieno, 'text-success': !stato.wpieno }">
                        {{ stato.wpieno ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-warning': stato.wportelloneaperto, 'table-info': !stato.wportelloneaperto }">
            <td>
               <span class="status-text" :class="{ 'text-warning': stato.wportelloneaperto, 'text-success': !stato.wportelloneaperto }">Warning Portellone Aperto</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': stato.wportelloneaperto }]"></span>

                    <span :class="{ 'text-warning': stato.wportelloneaperto, 'text-success': !stato.wportelloneaperto }">
                        {{ stato.wportelloneaperto ? 'ATTIVO' : 'OK' }}
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
/* Stili invariati */
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
    background-color: var(--bs-warning, #198754);
    box-shadow: 0 0 8px var(--bs-warning, #dc3545);
}
.card-header{
  background-color: #14265a;
}

</style>
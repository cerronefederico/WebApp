<script setup lang="ts">
import { usePlc1Store} from '@/stores/index';
import {computed} from "vue";

const plc1 = usePlc1Store();

const formattedLastUpdate = computed(() => {
    const oraCompleta = plc1.getStati[0]?.ora;
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


</script>

<template>
<div class="card shadow-sm">

    <div class="card-header bg-primary text-white">
      <div class="hstack gap-3">
  <div class="p-2">Elenco Warning</div>
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
          <tr :class="{ 'table-warning': plc1.getStati[0].wtermico, 'table-info': !plc1.getStati[0].wtermico }">
            <td>
               <span class="status-text" :class="{ 'text-warning': plc1.getStati[0].wtermico, 'text-success': !plc1.getStati[0].wtermico }">Warning Termico</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].wtermico }]"></span>

                    <span :class="{ 'text-warning': plc1.getStati[0].wtermico, 'text-success': !plc1.getStati[0].wtermico }">
                        {{ plc1.getStati[0].wtermico ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
        <tr :class="{ 'table-warning': plc1.getStati[0].wanomalianastro, 'table-info': !plc1.getStati[0].wanomalianastro }">
            <td>
               <span class="status-text" :class="{ 'text-warning': plc1.getStati[0].wanomalianastro, 'text-success': !plc1.getStati[0].wanomalianastro }">Warning Anomalia Nastro</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].wanomalianastro }]"></span>

                    <span :class="{ 'text-warning': plc1.getStati[0].wanomalianastro, 'text-success': !plc1.getStati[0].wanomalianastro }">
                        {{ plc1.getStati[0].wanomalianastro ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
                <tr :class="{ 'table-warning': plc1.getStati[0].wmancanzaprodotto, 'table-info': !plc1.getStati[0].wmancanzaprodotto }">
            <td>
               <span class="status-text" :class="{ 'text-warning': plc1.getStati[0].wmancanzaprodotto, 'text-success': !plc1.getStati[0].wmancanzaprodotto }">Warning Mancanza Prodotto</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].wmancanzaprodotto }]"></span>

                    <span :class="{ 'text-warning': plc1.getStati[0].wmancanzaprodotto, 'text-success': !plc1.getStati[0].wmancanzaprodotto }">
                        {{ plc1.getStati[0].wmancanzaprodotto ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
                        <tr :class="{ 'table-warning': plc1.getStati[0].wpieno, 'table-info': !plc1.getStati[0].wpieno }">
            <td>
               <span class="status-text" :class="{ 'text-warning': plc1.getStati[0].wpieno, 'text-success': !plc1.getStati[0].wpieno }">Warning Pieno</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].wpieno }]"></span>

                    <span :class="{ 'text-warning': plc1.getStati[0].wpieno, 'text-success': !plc1.getStati[0].wpieno }">
                        {{ plc1.getStati[0].wpieno ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-warning': plc1.getStati[0].wportelloneaperto, 'table-info': !plc1.getStati[0].wportelloneaperto }">
            <td>
               <span class="status-text" :class="{ 'text-warning': plc1.getStati[0].wportelloneaperto, 'text-success': !plc1.getStati[0].wportelloneaperto }">Warning Portellone Aperto</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].wportelloneaperto }]"></span>

                    <span :class="{ 'text-warning': plc1.getStati[0].wportelloneaperto, 'text-success': !plc1.getStati[0].wportelloneaperto }">
                        {{ plc1.getStati[0].wportelloneaperto ? 'ATTIVO' : 'OK' }}
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
    flex-shrink: 0; /* Impedisce che si riduca troppo */
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


</style>
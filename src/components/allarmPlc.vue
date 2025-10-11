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
  <div class="p-2">Elenco Allarmi</div>
  <div class="ms-auto">Ultimo Aggiornamento: {{formattedLastUpdate}}</div>
  </div>
    </div>

    <div class="table-scroll-container">
      <table class="table table-hover table-sm mb-0">
        <thead>
          <tr>
            <th style="width: 70%;">Allarmi</th>
            <th style="width: 30%;">stato</th>
          </tr>
        </thead>
        <tbody>
          <tr :class="{ 'table-danger': plc1.getStati[0].aanomaliagenerica, 'table-info': !plc1.getStati[0].aanomaliagenerica }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].aanomaliagenerica, 'text-success': !plc1.getStati[0].aanomaliagenerica }">Anomalia Generica</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].aanomaliagenerica }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].aanomaliagenerica, 'text-success': !plc1.getStati[0].aanomaliagenerica }">
                        {{ plc1.getStati[0].aanomaliagenerica ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
                  <tr :class="{ 'table-danger': plc1.getStati[0].amotorenastro, 'table-info': !plc1.getStati[0].amotorenastro }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].amotorenastro, 'text-success': !plc1.getStati[0].amotorenastro }">Anomalia Motore Nastro</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].amotorenastro }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].amotorenastro, 'text-success': !plc1.getStati[0].amotorenastro }">
                        {{ plc1.getStati[0].amotorenastro ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-danger': plc1.getStati[0].amancanzaconsenso, 'table-info': !plc1.getStati[0].amancanzaconsenso }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].amancanzaconsenso, 'text-success': !plc1.getStati[0].amancanzaconsenso }">Anomalia Mancanza Consenso</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].amancanzaconsenso }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].amancanzaconsenso, 'text-success': !plc1.getStati[0].amancanzaconsenso }">
                        {{ plc1.getStati[0].amancanzaconsenso ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-danger': plc1.getStati[0].atemperaturaprodottoalta, 'table-info': !plc1.getStati[0].atemperaturaprodottoalta }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].atemperaturaprodottoalta, 'text-success': !plc1.getStati[0].atemperaturaprodottoalta }">Anomalia Temperatura Prodotto Alta</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].atemperaturaprodottoalta }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].atemperaturaprodottoalta, 'text-success': !plc1.getStati[0].atemperaturaprodottoalta }">
                        {{ plc1.getStati[0].atemperaturaprodottoalta ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-danger': plc1.getStati[0].aemergenzainserita, 'table-info': !plc1.getStati[0].aemergenzainserita }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].aemergenzainserita, 'text-success': !plc1.getStati[0].aemergenzainserita }">Anomalia Emergenza Inserita</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].aemergenzainserita }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].aemergenzainserita, 'text-success': !plc1.getStati[0].aemergenzainserita }">
                        {{ plc1.getStati[0].aemergenzainserita ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-danger': plc1.getStati[0].atemperaturacpuelevata, 'table-info': !plc1.getStati[0].atemperaturacpuelevata }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].atemperaturacpuelevata, 'text-success': !plc1.getStati[0].atemperaturacpuelevata }">Anomalia Temperatura CPU Elevata</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].atemperaturacpuelevata }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].atemperaturacpuelevata, 'text-success': !plc1.getStati[0].atemperaturacpuelevata }">
                        {{ plc1.getStati[0].atemperaturacpuelevata ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-danger': plc1.getStati[0].aaggraffatricespenta, 'table-info': !plc1.getStati[0].aaggraffatricespenta }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].aaggraffatricespenta, 'text-success': !plc1.getStati[0].aaggraffatricespenta }">Anomalia Aggraffatrice Spenta</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].aaggraffatricespenta }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].aaggraffatricespenta, 'text-success': !plc1.getStati[0].aaggraffatricespenta }">
                        {{ plc1.getStati[0].aaggraffatricespenta ? 'ATTIVO' : 'OK' }}
                    </span>
                </span>
            </td>
          </tr>
          <tr :class="{ 'table-danger': plc1.getStati[0].anastrospento, 'table-info': !plc1.getStati[0].anastrospento }">
            <td>
               <span class="status-text" :class="{ 'text-danger': plc1.getStati[0].anastrospento, 'text-success': !plc1.getStati[0].anastrospento }">Anomalia Nastro Spento</span>
            </td>
            <td>
              <span class="status-badge-wrapper">
                    <span :class="['status-dot', { 'dot-active': plc1.getStati[0].anastrospento }]"></span>

                    <span :class="{ 'text-danger': plc1.getStati[0].anastrospento, 'text-success': !plc1.getStati[0].anastrospento }">
                        {{ plc1.getStati[0].anastrospento ? 'ATTIVO' : 'OK' }}
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
    background-color: var(--bs-danger, #198754);
    box-shadow: 0 0 8px var(--bs-danger, #dc3545);
}


</style>
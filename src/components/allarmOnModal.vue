<script setup lang="ts">
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import { computed, ref, onMounted, onUnmounted } from "vue"; // Importati i nuovi helper

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

// 1. Variabile reattiva per l'ora attuale che forza il ricalcolo
const oraCorrente = ref(Date.now());
let timer: number | null = null; // Per tenere traccia dell'intervallo

// 2. Aggiorna l'ora corrente ogni secondo
onMounted(() => {
  // Avvia il timer
  timer = setInterval(() => {
    oraCorrente.value = Date.now();
  }, 1000); // 1000ms = 1 secondo
});

// 3. Pulisci il timer quando il componente viene distrutto per evitare memory leak
onUnmounted(() => {
  if (timer !== null) {
    clearInterval(timer);
  }
});

/**
 * Funzione di utilità per formattare la differenza di tempo da millisecondi a "X minuti e Y secondi fa".
 */
const formatTempoTrascorso = (ms: number): string => {
  const secondiTotali = Math.floor(ms / 1000);
  const minuti = Math.floor(secondiTotali / 60);
  const secondi = secondiTotali % 60;

const parteMinuti = minuti > 0
    ? `${minuti} minut${minuti !== 1 ? 'i' : 'o'}`
    : '';

const parteSecondi = secondi > 0
    ? `${secondi} second${secondi !== 1 ? 'i' : 'o'}`
    : '';

// Se ci sono sia minuti che secondi
if (minuti > 0 && secondi > 0) {
  return `${parteMinuti} e ${parteSecondi} fa`;
}
// Se ci sono solo minuti (o minuti e zero secondi)
else if (minuti > 0) {
  return `${parteMinuti} fa`;
}
// Se ci sono solo secondi (e zero minuti)
else if (secondi > 0) {
  return `${parteSecondi} fa`;
}
// Caso in cui entrambi siano zero (dovrebbe essere gestito, assumiamo 'ora' o 'meno di un secondo')
else {
  return 'ora'; // o 'ora' a seconda del contesto
}
};

const allarmOn = computed(() => {
    // La dipendenza da oraCorrente.value fa sì che questo computed si ricalcoli ogni secondo
    const currentTimestamp = oraCorrente.value;

    return (plc): { nome: string, tempo_attivazione: string }[] => {
      const lista: any[] = plc.getStati;
      const risultati: { nome: string, tempo_attivazione: string }[] = [];

      if (!lista || lista.length === 0) {
        return [];
      }

      const statoCorrente = lista[0];
      // USIAMO ORA IL VALORE REATTIVO aggiornato (currentTimestamp)
      const oraAttuale = currentTimestamp;

      // Definisci qui i NOMI degli attributi booleani che vuoi monitorare
      const attributiAllarme: string[] = [
        'aanomaliagenerica',
        'amotorenastro',
        'amancanzaconsenso',
        'atemperaturaprodottoalta',
        'aemergenzainserita',
        'atemperaturacpuelevata',
        'aaggraffatricespenta',
        'anastrospento',
      ];

      for (const nomeAllarme of attributiAllarme) {

        const isAttivoCorrente = statoCorrente[nomeAllarme] === true;

        if (isAttivoCorrente) {
          let oraAttivazione: string | null = null;

          for (let i = 0; i < lista.length; i++) {
            if (lista[i][nomeAllarme] === false) {
              oraAttivazione = lista[i - 1].ora;
              break;
            }
          }
          if (oraAttivazione === null) {
              oraAttivazione = lista[lista.length - 1].ora;
          }

          // Calcolo della differenza oraria e formattazione
          if (oraAttivazione) {
            const timeAttivazione = new Date(oraAttivazione).getTime();
            const tempoTrascorsoMs = oraAttuale - timeAttivazione; // Usa l'ora reattiva

            const tempoFormattato = formatTempoTrascorso(tempoTrascorsoMs);

            risultati.push({
              nome: nomeAllarme,
              tempo_attivazione: tempoFormattato,
            });
          }
        }
      }

      return risultati;
    };
});
</script>

<template>
<div class="modal fade" id="allarmOnModal" tabindex="-1" aria-labelledby="allarmOnModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="text-center text-danger">Allarmi Attivi</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <table class="table table-bordered border-black">
  <thead class="table-dark">
    <tr>
      <th scope="col" style="width: 20%">PLC</th>
      <th scope="col" style="width: 30%">Allarme</th>
      <th scope="col" style="width: 50%">Tempo attivazione</th>
    </tr>
  </thead>
  <tbody>
    <template v-for="item in allarmOn(plc1)" :key="`plc1-${item.nome}`">
      <tr>
        <td>PLC1</td>
        <td>{{item.nome}}</td>
        <td>{{item.tempo_attivazione}}</td>
      </tr>
    </template>
    <template v-for="item in allarmOn(plc2)" :key="`plc2-${item.nome}`">
      <tr>
        <td>PLC2</td>
        <td>{{item.nome}}</td>
        <td>{{item.tempo_attivazione}}</td>
      </tr>
    </template>
    <template v-for="item in allarmOn(plc3)" :key="`plc3-${item.nome}`">
      <tr>
        <td>PLC3</td>
        <td>{{item.nome}}</td>
        <td>{{item.tempo_attivazione}}</td>
      </tr>
    </template>

    <tr v-if="allarmOn(plc1).length === 0 && allarmOn(plc2).length === 0 && allarmOn(plc3).length === 0">
      <td colspan="3" class="text-center">Nessun allarme attivo.</td>
    </tr>

  </tbody>
</table>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
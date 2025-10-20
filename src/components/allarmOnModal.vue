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
const getAlarmDisplayName = (technicalName: string): string => {
    const map: Record<string, string> = {
        'aanomaliagenerica': 'Anomalia Generica',
        'amotorenastro': 'Motore Nastro',
        'amancanzaconsenso': 'Mancanza Consenso',
        'atemperaturaprodottoalta': 'Temp. Prodotto Alta',
        'aemergenzainserita': 'Emergenza Inserita',
        'atemperaturacpuelevata': 'Temp. CPU Elevata',
        'aaggraffatricespenta': 'Aggraffatrice Spenta',
        'anastrospento': 'Nastro Spento',
    };
    return map[technicalName] || technicalName;
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
  <div class="modal-dialog modal-dialog-scrollable modal-xl">
    <div class="modal-content shadow-lg border-danger border-5">

      <div class="modal-header bg-danger text-white">
        <h1 class="modal-title fs-3 fw-bold" id="allarmOnModalLabel">⚠️ Allarmi Attivi ⚠️</h1>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body p-4">

       <div class="table-container-style">
            <table class="table table-striped table-hover align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th scope="col" style="width: 15%">PLC</th>
              <th scope="col" style="width: 45%">Allarme</th>
              <th scope="col" style="width: 40%" class="text-end">Tempo Attivazione</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="allarmOn(plc1).length > 0 || allarmOn(plc2).length > 0 || allarmOn(plc3).length > 0">

                <tr v-for="item in allarmOn(plc1)" :key="`plc1-${item.nome}`" class="table-danger">
                    <td class="fw-bold text-center border-end">PLC1</td>
                    <td class="fw-bold">{{ getAlarmDisplayName(item.nome) }}</td>
                    <td class="text-end text-danger fw-bold">{{ item.tempo_attivazione }}</td>
                </tr>

                <tr v-for="item in allarmOn(plc2)" :key="`plc2-${item.nome}`" class="table-danger">
                    <td class="fw-bold text-center border-end">PLC2</td>
                    <td class="fw-bold">{{ getAlarmDisplayName(item.nome) }}</td>
                    <td class="text-end text-danger fw-bold">{{ item.tempo_attivazione }}</td>
                </tr>

                <tr v-for="item in allarmOn(plc3)" :key="`plc3-${item.nome}`" class="table-danger">
                    <td class="fw-bold text-center border-end">PLC3</td>
                    <td class="fw-bold">{{ getAlarmDisplayName(item.nome) }}</td>
                    <td class="text-end text-danger fw-bold">{{ item.tempo_attivazione }}</td>
                </tr>

            </template>

            <tr v-else>
              <td colspan="3" class="text-center py-4 text-success fs-5 fw-bold bg-light">
                  Nessun allarme attivo! Stato OK.
              </td>
            </tr>

          </tbody>
        </table>
      </div>
      </div>

      <div class="modal-footer justify-content-center">
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Chiudi</button>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
/* Rendi l'intestazione del Modal ben definita */
.modal-header {
    border-bottom: 3px solid #dc3545; /* Bordo rosso più scuro */
}
/* Stile per il corpo del modal in stato di allarme */
.modal-content {
    /* Il colore rosso per il bordo (border-danger) è impostato nel template */
    border-radius: 0.5rem;
}

/* Stile per la riga di allarme: uso un rosso molto chiaro */
.table-danger {
    --bs-table-bg: #fff3f3; /* Rosso pastello molto chiaro */
    --bs-table-hover-bg: #feeaea; /* Un po' più scuro all'hover */
}

/* Header della tabella scuro e solido */
.table-dark {
    --bs-table-bg: #343a40; /* Grigio scuro standard Bootstrap */
    color: white;
}

/* Rimuovi i bordi verticali non necessari (solo la riga di PLC li tiene) */
.table th, .table td {
    border-top: none;
    border-bottom: 1px solid #e9ecef;
}

/* Assicura che la colonna PLC abbia un bordo di separazione verticale */
.border-end {
    border-right: 1px solid #e9ecef !important;
}
.btn-primary {
    background-color: var(--color-accent-cta) !important;
    border-color: var(--color-accent-cta) !important;
    font-weight: bold;
    color: white;
    transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
}
.btn-primary:hover {
    background-color: #004f70 !important;
    border-color: #004f70 !important;
    transform: translateY(-1px);
}
.table-container-style {
    /* Bordo sottile che usa il colore table-primary di Bootstrap (blu chiaro) */
    border: 1px solid #004F70;
    border-radius: 0.5rem; /* Bordi arrotondati */
    overflow: hidden; /* Assicura che la tabella interna rispetti il border-radius */
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1); /* Ombra leggera */
}
</style>
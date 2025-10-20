<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Presupponiamo l'uso di Vue Router

const router = useRouter();
const searchTerm = ref('');

// Mappa fissa dei PLC e delle loro rotte (basata sulla tua richiesta)
const plcMap = {
    'PLC1': { ip: '192.168.40.13', route: '/home/plc1' },
    'PLC2': { ip: '192.168.40.14', route: '/home/plc2' },
    'PLC3': { ip: '192.168.40.15', route: '/home/plc3' },
};

function searchAndNavigate() {
    // Converte il termine di ricerca in maiuscolo per la corrispondenza con i nomi PLC
    const query = searchTerm.value.trim().toUpperCase();
    if (!query) return;

    let targetRoute = null;

    // 1. Cerca per Nome PLC (es. PLC1, PLC2, PLC3)
    if (plcMap[query as keyof typeof plcMap]) {
        targetRoute = plcMap[query as keyof typeof plcMap].route;
    }

    // 2. Cerca per IP
    if (!targetRoute) {
        // La ricerca per IP non è case-sensitive, ma l'IP è gestito come stringa
        for (const key in plcMap) {
            const plc = plcMap[key as keyof typeof plcMap];
            if (plc.ip === query) {
                targetRoute = plc.route;
                break;
            }
        }
    }

    if (targetRoute) {
        // Naviga verso la rotta trovata
        router.push(targetRoute);
        searchTerm.value = ''; // Pulisci il campo

        // Azione: Chiudi il modale dopo la navigazione riuscita
        // Clicca programmaticamente sul pulsante di chiusura del modale (richiede Bootstrap JS)
        const closeButton = document.querySelector('#searchModal .btn-close') as HTMLElement;
        if (closeButton) {
             closeButton.click();
        }

    } else {
        // Gestione errore: Nessun PLC trovato
        console.warn(`Elemento non trovato: ${query}. Nessun PLC corrisponde a nome o IP.`);
        // In un'app reale, si mostrerebbe qui un Toast o un messaggio di errore all'utente.
    }
}
</script>

<template>
<div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="searchModalLabel">Cerca PLC</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <!-- Form con listener @submit.prevent per eseguire la logica Vue -->
        <form class="d-flex" @submit.prevent="searchAndNavigate">
          <input
            class="form-control me-2"
            type="search"
            v-model="searchTerm"
            placeholder="Cerca PLC per Nome (PLC1) o IP (192.168.40.XX)"
            aria-label="Cerca"
          >
          <button class="btn btn-primary" type="submit">
              <i class="bi bi-search"></i> Cerca
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>
.modal-header {
    background-color: var(--color-primary, #14265a);
    color: white;
}
.modal-title {
    font-weight: 600;
}
.btn-close {
    filter: invert(1); /* Rende la X bianca per l'header scuro */
}
.btn-primary {
    background-color: var(--color-primary, #14265a) !important;
    border-color: var(--color-primary, #14265a) !important;
}
.btn-primary:hover {
    background-color: #0d1e48 !important;
    border-color: #0d1e48 !important;
}
</style>
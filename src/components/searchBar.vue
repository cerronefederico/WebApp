<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';

// Dati fittizi per la simulazione della ricerca (dovrebbero rispecchiare i tuoi PLC reali)
const plcs = [
    { id: 'PLC1', ip: '192.168.40.13', route: '/home/plc1' },
    { id: 'PLC2', ip: '192.168.40.14', route: '/home/plc2' },
    { id: 'PLC3', ip: '192.168.40.15', route: '/home/plc3' },
];

const router = useRouter();
const searchTerm = ref('');
const errorMessage = ref('');

/**
 * Cerca un PLC per nome o indirizzo IP e naviga verso la sua rotta.
 * Visualizza un messaggio di errore se non trova corrispondenze.
 */
const searchAndNavigate = () => {
    // 1. Pulisci il messaggio di errore precedente
    errorMessage.value = '';

    if (!searchTerm.value.trim()) {
        errorMessage.value = "Per favore, inserisci un nome (es. PLC1) o un indirizzo IP valido.";
        return;
    }

    const query = searchTerm.value.trim().toUpperCase();

    // 2. Esegui la ricerca
    const foundPlc = plcs.find(plc =>
        plc.id === query || plc.ip === query.toLowerCase()
    );

    // 3. Gestione del risultato e navigazione
    if (foundPlc) {
        // Chiudi il modale
        const searchModalEl = document.getElementById('searchModal');
        if (searchModalEl) {
            const modal = Modal.getInstance(searchModalEl) || new Modal(searchModalEl);
            modal.hide();
        }

        // Resetta lo stato e naviga
        searchTerm.value = '';
        router.push(foundPlc.route);
    } else {
        // 4. Se non trovato, imposta l'errore
        errorMessage.value = `Nessun PLC trovato con il nome o IP: "${searchTerm.value}". Riprova.`;
    }
};

/**
 * Resetta lo stato quando il modale viene aperto o chiuso per pulire l'input e l'errore.
 */
const resetModalState = () => {
  searchTerm.value = '';
  errorMessage.value = '';
}
</script>

<template>
<div
    class="modal fade"
    id="searchModal"
    tabindex="-1"
    aria-labelledby="searchModalLabel"
    aria-hidden="true"
    @hidden.bs.modal="resetModalState"
    @shown.bs.modal="resetModalState"
>
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-custom-secondary text-white">
        <h1 class="modal-title fs-5" id="searchModalLabel">Cerca PLC per Nome o IP</h1>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">

        <!-- Form di ricerca. Prevent default per gestire la logica con Vue. -->
        <form class="d-flex" @submit.prevent="searchAndNavigate">
          <input
            class="form-control form-control-lg me-2"
            type="search"
            placeholder="Esempio: PLC1 o 192.168.40.13"
            aria-label="Cerca PLC"
            v-model="searchTerm"
            :class="{ 'is-invalid': errorMessage }"
            @input="errorMessage = ''"
            autofocus
          >
          <button class="btn btn-primary btn-lg" type="submit">Cerca</button>
        </form>

        <!-- Area di visualizzazione dell'errore -->
        <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>
/* Stili per armonizzare il modale con il tema scuro dell'header */
.modal-content {
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

/* ------------------------------------------------ */
/* AREA DA MODIFICARE PER PERSONALIZZARE I COLORI   */
/* ------------------------------------------------ */

/* 1. COLORE DELL'HEADER DEL MODALE */
.bg-custom-secondary {
    /* *** MODIFICA QUI IL COLORE PER L'HEADER *** */
    background-color: #17223b !important; /* Colore blu scuro */
}

.btn-close-white {
    /* Mantieni la X bianca per l'header scuro */
    filter: invert(1) grayscale(100%) brightness(200%);
}

/* 2. COLORE DEL PULSANTE "CERCA" */
.btn-primary {
    /* *** MODIFICA QUI IL COLORE PRINCIPALE DEL PULSANTE *** */
    background-color: #17223b; /* Colore più brillante per l'azione */
    border-color: #17223b;
}
.btn-primary:hover {
    /* *** MODIFICA QUI IL COLORE DEL PULSANTE ALL'HOVER *** */
    background-color: #17223b;
    border-color: #17223b;
}
/* ------------------------------------------------ */
</style>

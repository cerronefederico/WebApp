<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 1. Definiamo la prop per ricevere l'array di PLC (che ora deve contenere lo store)
defineProps({
    plcs: {
        type: Array,
        required: true
    }
});

// 2. Funzione per la navigazione dinamica
function navigateTo(route) {
    if (route) {
        // Usa router.push per navigare alla route specifica del PLC (es. /dettaglio/plc1)
        router.push(route);
    }
}
</script>

<template>
    <div class="mx-auto" style="max-width: 850px; width: 100%;">
        <div v-if="plcs.length === 0" class="alert alert-info text-center shadow-lg" role="alert">
            Nessun PLC trovato con il filtro selezionato. Riprova con un altro filtro.
        </div>

        <div v-for="plc in plcs" :key="plc.id" class="card h-100 shadow-lg mb-4">
            <img :src="plc.image" class="card-img-top" :alt="`Immagine ${plc.id}`" height="280">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">{{ plc.id }}</h5>
                <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content.</p>

                <div class="status-row d-flex justify-content-between align-items-center mt-2">
                    <div class="status-indicators d-flex gap-3">

                        <span class="text-danger">
                            <i class="bi bi-x-octagon-fill"></i> Alert: {{plc.store.getNumeroAllarmi}}
                        </span>

                        <span class="text-warning">
                            <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{plc.store.getNumeroWarning}}
                        </span>

                        <span :class="[!plc.stato.acceso ? 'text-secondary' : !plc.stato.inBlocco ? 'text-success' : 'text-danger fw-bold']">
                            <i :class="[!plc.stato.acceso ? 'bi bi-outlet' : !plc.stato.inBlocco ? 'bi bi-power' : 'bi bi-lock-fill']"></i>

                            Stato:
                            <template v-if="plc.stato.acceso && plc.stato.inBlocco">BLOCCO</template>
                            <template v-else-if="plc.stato.acceso && !plc.stato.inBlocco">ACCESO</template>
                            <template v-else-if="!plc.stato.acceso">SPENTO</template>
                            <template v-else>Sconosciuto</template>
                        </span>

                    </div>
                </div>
                <button
                    type="button"
                    class="btn btn-primary mt-2 ms-auto"
                    @click="navigateTo(plc.route)"
                >
                    Visualizza
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.status-indicators {
    font-size: 0.9rem;
    font-weight: 500;
}
</style>
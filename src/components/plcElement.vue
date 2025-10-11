<script setup>
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import { useWebSocketStore } from '@/stores/webSoket';
import { computed, ref } from 'vue'; // Importiamo i componenti necessari
import { useRouter } from 'vue-router'; // Per usare il router

// 1. Hook degli Store
const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();



const router = useRouter();

function handlePLC1() {
    router.push('/home/plc1');
}


</script>

<template>
    <div class="mx-auto" style="max-width: 850px; width: 100%;">
        <div class="card h-100 shadow-lg mb-4">
          <img src="/img/provaPlcCard.png"  class="card-img-top" alt="Immagine PLC1" height="280">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">PLC1</h5>
                <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <div class="status-row d-flex justify-content-between align-items-center mt-2">

                    <div class="status-indicators d-flex gap-3">

                        <span class="text-danger">
                            <i class="bi bi-x-octagon-fill"></i> Alert: {{plc1.getNumeroAllarmi}}
                        </span>

                        <span class="text-warning">
                            <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{plc1.getNumeroWarning}}
                        </span>

                    </div>
                </div>
                <form @submit.prevent="handlePLC1" class="d-flex justify-content-end">
                    <button type="submit" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
                </form>
            </div>
        </div>
        <div class="card h-100 shadow-lg mb-4">
          <img src="/img/provaPlcCard1.png" class="card-img-top" alt="Immagine PLC1" height="280">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">PLC2</h5>
                <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>

                <div class="status-row d-flex justify-content-between align-items-center mt-2">

                    <div class="status-indicators d-flex gap-3">

                        <span class="text-danger">
                            <i class="bi bi-x-octagon-fill"></i> Alert: {{plc2.getNumeroAllarmi}}
                        </span>

                        <span class="text-warning">
                            <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{plc2.getNumeroWarning}}
                        </span>

                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
            </div>
        </div>
        <div class="card h-100 shadow-lg mb-4">
          <img src="/img/provaPlcCard2.png" class="card-img-top" alt="Immagine PLC1" height="280">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">PLC3</h5>
                <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content.</p>

                <div class="status-row d-flex justify-content-between align-items-center mt-2">

                    <div class="status-indicators d-flex gap-3">

                        <span class="text-danger">
                            <i class="bi bi-x-octagon-fill"></i> Alert: {{plc3.getNumeroAllarmi}}
                        </span>

                        <span class="text-warning">
                            <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{plc3.getNumeroWarning}}
                        </span>

                    </div>
                </div>
                <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
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
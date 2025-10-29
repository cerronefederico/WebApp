<script setup lang="ts">
import { Toast } from 'bootstrap';
import { ref, watch, computed, nextTick } from 'vue';
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores';
import { useAuthStore } from '@/stores/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();
const authStore = useAuthStore();

// 💡 Modificato: Tracciamento delle lunghezze iniziali, resettato quando l'utente cambia.
const initialLengths = ref({
    PLC1: 0,
    PLC2: 0,
    PLC3: 0,
});

const activeToasts = ref<any[]>([]);
const isFirstDataLoad = ref(true); // Indica se le lunghezze iniziali sono state salvate dopo l'ultimo login

const generateToastId = () => Date.now() + Math.random().toString(36).substring(2);

// --------------------------------------------------------------------------------
// Gestione Reattività Utente/Notifiche
// --------------------------------------------------------------------------------

// Computato che unisce tutte le notifiche con il loro PLC ID
const allNotificheGrouped = computed(() => ({
    PLC1: plc1.getNotifiche.map((n: any) => ({ ...n, plcId: 'PLC1' })),
    PLC2: plc2.getNotifiche.map((n: any) => ({ ...n, plcId: 'PLC2' })),
    PLC3: plc3.getNotifiche.map((n: any) => ({ ...n, plcId: 'PLC3' })),
}));

/**
 * 🚀 Nuovo Watch: Resetta lo stato del caricamento quando l'utente cambia.
 * Questo forza il watch successivo (su allNotificheGrouped) a rieseguire la logica di inizializzazione.
 */
watch(
    () => authStore.isAuthenticated,
    (isAuth, wasAuth) => {
        if (isAuth && !wasAuth) {
            // L'utente ha appena effettuato il login
            isFirstDataLoad.value = true;
            // Opzionale: pulire i toast vecchi al login
            activeToasts.value = [];
        }
    },
    { immediate: true } // Esegue immediatamente all'avvio
);


/**
 * Logica principale: Individua e mostra i nuovi toast.
 */
watch(
    allNotificheGrouped,
    (currentStores) => {
        // Se non è autenticato o se le liste non sono state ancora caricate, usciamo.
        if (!authStore.isAuthenticated) return;

        const plcIds = ['PLC1', 'PLC2', 'PLC3'];
        let newToastsAdded = false;

        if (isFirstDataLoad.value) {
            // Fase di Inizializzazione (solo dopo il login): Memorizza le lunghezze attuali.
            plcIds.forEach(id => {
                initialLengths.value[id] = currentStores[id].length;
            });
            isFirstDataLoad.value = false;
            // Usciamo dopo l'inizializzazione, attendendo il prossimo cambiamento
          return;
        }

        plcIds.forEach(id => {
            const currentList = currentStores[id];
            const oldLength = initialLengths.value[id];
            const newLength = currentList.length;

            if (newLength > oldLength) {
                // Trovati nuovi elementi! Poiché sono aggiunti all'inizio:
                const numeroNuoviElementi = newLength - oldLength;

                // Itera SOLTANTO sui nuovi elementi, agli indici da 0 a numeroNuoviElementi-1
                for (let i = 0; i < numeroNuoviElementi; i++) {
                    const nuovoElemento = currentList[i];

                    if (nuovoElemento.id && String(nuovoElemento.id).toLowerCase().startsWith('a')) {
                        activeToasts.value.push({
                            ...nuovoElemento,
                            plcId: id,
                            toastId: generateToastId(),
                        });
                        newToastsAdded = true;
                    }
                }

                // Aggiorna la lunghezza tracciata per il prossimo ciclo di watch
                initialLengths.value[id] = newLength;
            } else if (newLength < oldLength) {
                 // Gestisce la rimozione/reset
                initialLengths.value[id] = newLength;
            }
        });

        if (newToastsAdded) {
            nextTick(() => {
                // Inizializzazione Toast da `initializeAndShowToast`
            });
        }
    },
    { deep: true }
);

// --------------------------------------------------------------------------------
// Gestione Visualizzazione Toast
// --------------------------------------------------------------------------------

function removeToast(toastId: string) {
    activeToasts.value = activeToasts.value.filter(t => t.toastId !== toastId);
}

function initializeAndShowToast(toastElement: HTMLDivElement | null, item: any) {
    if (!toastElement || !item.toastId || toastElement.classList.contains('showing')) return;

    const toastInstance = Toast.getOrCreateInstance(toastElement, {
        autohide: true,
        delay: 5000
    });

    toastElement.addEventListener('hidden.bs.toast', () => {
        removeToast(item.toastId);
    }, { once: true });

    toastInstance.show();
}

const toastContainerClasses = computed(() => {
    const placement = authStore.getToastPlacement;

    if (!authStore.isAuthenticated) {
        return 'd-none';
    }

    if (placement === "" || placement === null) {
        return 'd-none';
    }

    return `toast-container position-fixed p-3 ${placement}`;
});

function goToPlc(id: string) {
  if (id==='PLC1') {
    router.push('/home/plc1')
  }
  if (id==='PLC2') {
    router.push('/home/plc2')
  }
  if (id==='PLC3') {
    router.push('/home/plc3')
  }
}
</script>

<template>
<div :class="toastContainerClasses" style="z-index: 1080;">

    <div
        v-for="item in activeToasts"
        :key="item.toastId"
        :id="`toast-${item.toastId}`"
        class="toast fade"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        :ref="el => initializeAndShowToast(el as HTMLDivElement, item)"
    >
        <div class="toast-header">
            <strong class="me-auto">{{ item.plcId }} - {{ item.id}}</strong>
            <small>{{ item.ora}}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div v-if="item.stato" class="text-danger">allarme attivato</div>
          <div v-if="!item.stato" class="text-success">allarme rientrato</div>
          <button v-if="item.plcId==='PLC1'" @click="goToPlc(item.plcId)" class="btn btn-primary btn-sm mt-2" data-bs-dismiss="toast">go to plc1</button>
          <button v-if="item.plcId==='PLC2'" @click="goToPlc(item.plcId)" class="btn btn-primary btn-sm mt-2" data-bs-dismiss="toast">go to plc2</button>
          <button v-if="item.plcId==='PLC3'" @click="goToPlc(item.plcId)" class="btn btn-primary btn-sm mt-2" data-bs-dismiss="toast">go to plc3</button>
        </div>
    </div>

</div>
</template>

<style scoped>
/* Stili */
</style>
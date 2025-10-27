<script setup lang="ts">
import { computed } from 'vue';
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';

// Inizializza gli Store
const plc1Store = usePlc1Store();
const plc2Store = usePlc2Store();
const plc3Store = usePlc3Store();

// --- NUOVA FUNZIONE IMPLEMENTATA E CORRETTA ---
/**
 * Converte l'ID tecnico dell'allarme/warning nel nome descrittivo.
 * @param technicalName - L'ID tecnico (es. 'aanomaliagenerica', 'wtermico').
 * @returns Il nome descrittivo o l'ID stesso se non mappato.
 */
const getAlarmDisplayName = (technicalName: string): string => {
    // Mappa per allarmi (che di solito iniziano per 'a')
    const map: Record<string, string> = {
        'aAnomaliaGenerica': 'Anomalia Generica',
        'aMotoreNastro': 'Motore Nastro',
        'aMancanzaConsenso': 'Mancanza Consenso',
        'aTemperaturaProdottoAlta': 'Temperatura Prodotto Alta',
        'aEmergenzaInserita': 'Emergenza Inserita',
        'aTemperaturaCpuElevata': 'Temperatura CPU Elevata',
        'aAggraffatriceSpenta': 'Aggraffatrice Spenta',
        'aNastroSpento': 'Nastro Spento',
    };

    // Estendo la mappa per i Warning (che di solito iniziano per 'w')
    // ⭐ AGGIORNAMENTO: Nomi descrittivi dei Warning come richiesto (senza "Warning:")
    const warningMap: Record<string, string> = {
        'wTermico': 'Scatto Termico',
        'wAnomaliaNastro': 'Anomalia Nastro',
        'wMancanzaProdotto': 'Mancanza Prodotto',
        'wPieno': 'Ingresso Prodotto Pieno',
        'wPortelloneAperto': 'Sportello Aperto',
    };

    // Unisce le mappe
    const fullMap = { ...map, ...warningMap };

    // 1. Se esiste una mappatura esatta, la usa.
    if (fullMap[technicalName]) {
        return fullMap[technicalName];
    }

    // 2. Fallback CORRETTO:
    // a) Rimuove il prefisso 'a' o 'w' (case insensitive)
    let displayName = technicalName.replace(/^[aw]/i, '');

    // b) Capitalizza solo la prima lettera della stringa rimanente
    if (displayName.length > 0) {
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
    }

    return displayName;
};
// ------------------------------------


// Funzione utility per formattare il timestamp
const formattedTime = (oraCompleta: string | undefined): string => {
    if (!oraCompleta || typeof oraCompleta !== 'string') {
        return 'N/A';
    }
    // Rimuove millisecondi e fusi orari, sostituendo 'T' con uno spazio
    const pointIndex = oraCompleta.indexOf('.');
    const plusIndex = oraCompleta.indexOf('+');
    let cleanTime = oraCompleta;

    if (pointIndex !== -1) {
        cleanTime = cleanTime.substring(0, pointIndex);
    } else if (plusIndex !== -1) {
        cleanTime = cleanTime.substring(0, plusIndex);
    }

    return cleanTime.replace('T', ' ');
};

// Funzione helper per determinare il tipo di evento
const getEventType = (itemId: string): 'Warning' | 'Allarme' => {
    const lowerId = itemId.toLowerCase();
    // LOGICA: Controlla se l'ID inizia con 'w'
    if (lowerId.startsWith('w')) {
        return 'Warning';
    }
    // Assumiamo che tutto il resto sia un Allarme
    return 'Allarme';
};


// Calcola il log combinato e ordinato di tutte le notifiche (Allarmi e Warning)
const combinedLog = computed(() => {

    // Funzione di utilità per mappare un log da uno store specifico
    const mapLog = (logList: any[], plcId: string) => {
        return logList.map((item: any) => ({
            ...item,
            plcId: plcId,
            // Applica la logica corretta per determinare il tipo
            tipo: getEventType(item.id)
        }));
    };

    // 1. Mappa usando il getter UNIFICATO 'getNotifiche'
    const log1 = mapLog(plc1Store.getNotifiche, 'PLC1');
    const log2 = mapLog(plc2Store.getNotifiche, 'PLC2');
    const log3 = mapLog(plc3Store.getNotifiche, 'PLC3');

    // 2. Combina tutti i log (ALLARMI + WARNINGS)
    const combined = [...log1, ...log2, ...log3];


    // 3. Ordina per 'ora' (Timestamp) in ordine decrescente (il più recente in alto)
    combined.sort((a: any, b: any) => {
        // La funzione localeCompare funziona bene per stringhe ISO 8601 (Timestamp)
        return b.ora.localeCompare(a.ora);
    });

    return combined;
});

</script>

<template>
<div class="container-fluid py-4">
    <div class="card storico-card">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 class="card-title mb-0"><i class="bi bi-clock-history me-2"></i> Storico Allarmi e Warning</h2>
            <span class="badge bg-secondary">Totale Eventi: {{ combinedLog.length }}</span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive log-table-container">
                <table class="table table-striped table-hover table-sm mb-0">
                    <thead class="sticky-top bg-light">
                        <tr>
                            <th style="width: 15%;">Timestamp</th>
                            <th style="width: 10%;">PLC</th>
                            <th style="width: 50%;">Descrizione Evento</th>
                            <th style="width: 15%;">Tipo</th>
                            <th style="width: 10%;" class="text-center">Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="combinedLog.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">Nessun evento storico trovato.</td>
                        </tr>
                        <tr
                            v-for="(log, index) in combinedLog"
                            :key="index"
                            :class="{
                                // Riga evidenziata in base al tipo e allo stato
                                'table-danger': log.tipo === 'Allarme' && log.stato,
                                'table-warning': log.tipo === 'Warning' && log.stato,
                                'table-success': !log.stato && log.tipo === 'Allarme', // Reset Allarme
                                'table-info': !log.stato && log.tipo === 'Warning',   // Reset Warning
                            }"
                        >
                            <td>{{ formattedTime(log.ora) }}</td>
                            <td><span class="badge bg-primary">{{ log.plcId }}</span></td>
                            <!-- QUI USIAMO LA NUOVA FUNZIONE -->
                            <td>{{ getAlarmDisplayName(log.id) }}</td>
                            <td>
                                <span :class="['badge', { 'bg-danger': log.tipo === 'Allarme', 'bg-warning text-dark': log.tipo === 'Warning' }]">
                                    {{ log.tipo }}
                                </span>
                            </td>
                            <td class="text-center">
                                <span :class="['badge', { 'bg-danger': log.stato, 'bg-success': !log.stato }]">
                                    {{ log.stato ? 'ATTIVO/INIZIO' : 'RITORNO/FINE' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
/* Variabili e stili per l'integrazione con il tema HMI */
:root {
  --color-primary: #14265a;
  --color-background: #F0F8FF;
  --color-card-bg: #FFFFFF;
}

.bg-primary {
    background-color: var(--color-primary) !important;
}

.bg-secondary {
    background-color: #6c757d !important;
}

.container-fluid {
    /* Assumiamo che ci sia un padding di base per lo spazio dell'header */
    padding-top: 3px !important;
    background-color: var(--color-background);
    min-height: 100vh;
}

.storico-card {
    max-width: 1400px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-weight: 600;
    font-size: 1.5rem;
}

.log-table-container {
    /* Limita l'altezza della tabella e la rende scrollabile */
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.log-table-container thead th {
    /* Fissa l'intestazione della tabella */
    position: sticky;
    top: 0;
    z-index: 10;
    background-color: #f8f9fa;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

.table th, .table td {
    vertical-align: middle;
    padding: 0.75rem;
}

/* Stili di riga per gli stati */
.table-danger { background-color: #f8d7da !important; }
.table-warning { background-color: #fff3cd !important; }
.table-success { background-color: #d4edda !important; }
.table-info { background-color: #d1ecf1 !important; }
</style>

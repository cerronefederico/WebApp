<script setup lang="ts">
import {computed, ref} from 'vue';
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


const flagPlc = ref('');
const flagEvento =ref('');
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
    let combined = [...log1, ...log2, ...log3];


    // 3. Ordina per 'ora' (Timestamp) in ordine decrescente (il più recente in alto)
    combined.sort((a: any, b: any) => {
        // La funzione localeCompare funziona bene per stringhe ISO 8601 (Timestamp)
        return b.ora.localeCompare(a.ora);
    });

    if(flagPlc.value==='plc1'){
      combined = combined.filter(log => log.plcId === 'PLC1');
    }
    if(flagPlc.value==='plc2'){
      combined = combined.filter(log => log.plcId === 'PLC2');
    }
    if(flagPlc.value==='plc3'){
      combined = combined.filter(log => log.plcId === 'PLC3');
    }
    if(flagEvento.value==='AAG'){
      combined = combined.filter(log => log.id === 'aAnomaliaGenerica');
    }
    if(flagEvento.value==='AMN'){
      combined = combined.filter(log => log.id === 'aMotoreNastro');
    }
    if(flagEvento.value==='AMC'){
      combined = combined.filter(log => log.id === 'aMancanzaConsenso');
    }
    if(flagEvento.value==='ATPA'){
      combined = combined.filter(log => log.id === 'aTemperaturaProdottoAlta');
    }
    if(flagEvento.value==='AEI'){
      combined = combined.filter(log => log.id === 'aEmergenzaInserita');
    }
    if(flagEvento.value==='ATCE'){
      combined = combined.filter(log => log.id === 'aTemperaturaCpuElevata');
    }
    if(flagEvento.value==='AAS'){
      combined = combined.filter(log => log.id === 'aAggraffatriceSpenta');
    }
    if(flagEvento.value==='ANS'){
      combined = combined.filter(log => log.id === 'aNastroSpento');
    }
    if(flagEvento.value==='WST'){
      combined = combined.filter(log => log.id === 'wTermico');
    }
    if(flagEvento.value==='WAN'){
      combined = combined.filter(log => log.id === 'wAnomaliaNastro');
    }
    if(flagEvento.value==='WMP'){
      combined = combined.filter(log => log.id === 'wMancanzaProdotto');
    }
    if(flagEvento.value==='WIPP'){
      combined = combined.filter(log => log.id === 'wPieno');
    }
    if(flagEvento.value==='WSA'){
      combined = combined.filter(log => log.id === 'wPortelloneAperto');
    }
    return combined;
});
function chooseAllPlc() {
  flagPlc.value='';
}
function choosePlc1() {
  flagPlc.value='plc1';
}
function choosePlc2() {
  flagPlc.value='plc2';
}
function choosePlc3() {
  flagPlc.value='plc3';
}
function chooseAllEvent(){
  flagEvento.value='';
}
function chooseAAGEvent(){
  flagEvento.value='AAG';
}
function chooseAMNEvent(){
  flagEvento.value='AMN';
}
function chooseAMCEvent(){
  flagEvento.value='AMC';
}
function chooseATPAEvent(){
  flagEvento.value='ATPA';
}
function chooseAEIEvent(){
  flagEvento.value='AEI';
}
function chooseATCEEvent(){
  flagEvento.value='ATCE';
}
function chooseAASEvent(){
  flagEvento.value='AAS';
}
function chooseANSEvent(){
  flagEvento.value='ANS';
}
function chooseWSTEvent(){
  flagEvento.value='WST';
}
function chooseWANEvent(){
  flagEvento.value='WAN';
}
function chooseWMPEvent(){
  flagEvento.value='WMP';
}
function chooseWIPPEvent(){
  flagEvento.value='WIPP';
}
function chooseWSAEvent(){
  flagEvento.value='WSA';
}

</script>

<template>
<div class="container-fluid py-4">
    <div class="card shadow-lg storico-card">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 class="card-title mb-0"><i class="bi bi-clock-history me-2"></i> Storico Allarmi e Warning</h2>
            <span class="badge bg-secondary">Totale Eventi: {{ combinedLog.length }}</span>
        </div>

        <div class="card-body p-0">
            <div class="table-responsive log-header-container">
                <table class="table table-sm mb-0 log-header-table">
                    <thead>
                        <tr>
                            <th style="width: 15%;">Timestamp</th>
                            <th class="dropdown" style="width: 10%;">
                                <a
                                    class="btn btn-secondary dropdown-toggle bg-transparent text-dark fw-bold"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    data-bs-display="static"
                                >Plc</a>
                              <ul class="dropdown-menu">
                                <li><a v-on:click="chooseAllPlc" :class="flagPlc === '' ? 'dropdown-item active' : 'dropdown-item'" href="#">tutti i plc</a></li>
                                <li><a v-on:click="choosePlc1" :class="flagPlc === 'plc1' ? 'dropdown-item active' : 'dropdown-item'" href="#">plc1</a></li>
                                <li><a v-on:click="choosePlc2" :class="flagPlc === 'plc2' ? 'dropdown-item active' : 'dropdown-item'" href="#">plc2</a></li>
                                <li><a v-on:click="choosePlc3" :class="flagPlc === 'plc3' ? 'dropdown-item active' : 'dropdown-item'" href="#">plc3</a></li>
                              </ul>
                            </th>
                            <th class="dropdown" style="width: 50%;">
                                <a
                                  class="btn btn-secondary dropdown-toggle bg-transparent text-dark fw-bold"
                                  href="#"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  data-bs-display="static"
                              >Descrizione evento</a>
                              <ul class="dropdown-menu">
                                <li><a v-on:click="chooseAllEvent" :class="flagEvento === '' ? 'dropdown-item active' : 'dropdown-item'" href="#">tutti gli eventi</a></li>
                                <li><a v-on:click="chooseAAGEvent" :class="flagEvento === 'AAG' ? 'dropdown-item active' : 'dropdown-item'" href="#">Anomalia Generica</a></li>
                                <li><a v-on:click="chooseAMNEvent" :class="flagEvento === 'AMN' ? 'dropdown-item active' : 'dropdown-item'" href="#">Motore Nastro</a></li>
                                <li><a v-on:click="chooseAMCEvent" :class="flagEvento === 'AMC' ? 'dropdown-item active' : 'dropdown-item'" href="#">Mancanza Consenso</a></li>
                                <li><a v-on:click="chooseATPAEvent" :class="flagEvento === 'ATPA' ? 'dropdown-item active' : 'dropdown-item'" href="#">Temperatura Prodotto Alta</a></li>
                                <li><a v-on:click="chooseAEIEvent" :class="flagEvento === 'AEI' ? 'dropdown-item active' : 'dropdown-item'" href="#">Emergenza Inserita</a></li>
                                <li><a v-on:click="chooseATCEEvent" :class="flagEvento === 'ATCE' ? 'dropdown-item active' : 'dropdown-item'" href="#">Temperatura CPU Elevata</a></li>
                                <li><a v-on:click="chooseAASEvent" :class="flagEvento === 'AAS' ? 'dropdown-item active' : 'dropdown-item'" href="#">Aggraffatrice Spenta</a></li>
                                <li><a v-on:click="chooseANSEvent" :class="flagEvento === 'ANS' ? 'dropdown-item active' : 'dropdown-item'" href="#">Nastro Spento</a></li>
                                <li><a v-on:click="chooseWSTEvent" :class="flagEvento === 'WST' ? 'dropdown-item active' : 'dropdown-item'" href="#">Scatto Termico</a></li>
                                <li><a v-on:click="chooseWANEvent" :class="flagEvento === 'WAN' ? 'dropdown-item active' : 'dropdown-item'" href="#">Anomalia Nastro</a></li>
                                <li><a v-on:click="chooseWMPEvent" :class="flagEvento === 'WMP' ? 'dropdown-item active' : 'dropdown-item'" href="#">Mancanza Prodotto</a></li>
                                <li><a v-on:click="chooseWIPPEvent" :class="flagEvento === 'WIPP' ? 'dropdown-item active' : 'dropdown-item'" href="#">Ingresso Prodotto Pieno</a></li>
                                <li><a v-on:click="chooseWSAEvent" :class="flagEvento === 'WSA' ? 'dropdown-item active' : 'dropdown-item'" href="#">Sportello Aperto</a></li>
                              </ul>
                            </th>
                            <th style="width: 15%;">Tipo</th>
                            <th style="width: 10%;" class="text-center">Stato</th>
                        </tr>
                    </thead>
                </table>
            </div>

            <div class="table-responsive log-content-container">
                <table class="table table-striped table-hover table-sm mb-0 log-content-table">
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
                            <td style="width: 15%;">{{ formattedTime(log.ora) }}</td>
                            <td style="width: 10%;"><span class="badge bg-primary">{{ log.plcId }}</span></td>
                            <td style="width: 50%;">{{ getAlarmDisplayName(log.id) }}</td>
                            <td style="width: 15%;">
                                <span :class="['badge', { 'bg-danger': log.tipo === 'Allarme', 'bg-warning text-dark': log.tipo === 'Warning' }]">
                                    {{ log.tipo }}
                                </span>
                            </td>
                            <td style="width: 10%;" class="text-center">
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


.container-fluid {
  margin-top: -20px;
    background-color: var(--color-background);
}

.storico-card {
    max-width: 1400px;
    margin: 0 auto;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.card-title {
    font-weight: 600;
    font-size: 1.5rem;
}

/* ⭐ NUOVO: Questo div ora contiene solo l'intestazione e NON DEVE SCORRERE */
.log-header-container {
    /* Rimuovi l'overflow, lascia che i dropdown si espandano liberamente */
    overflow: visible;
}

/* ⭐ NUOVO: Questo div gestisce l'altezza fissa e lo scorrimento del contenuto */
.log-content-container {
    max-height: calc(100vh - 260px); /* Altezza leggermente ridotta per fare spazio all'intestazione separata */
    overflow: auto;
}

/* Intestazione: assicuriamoci che lo sfondo sia visibile e non scorra */
.log-header-table thead th {
    /* Rimosso position: sticky/top/z-index perché la tabella non scorre più */
    background-color: #f8f9fa;
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

/* Contenuto: rimuovi il margine superiore che crea spazio tra le due tabelle */
.log-content-table {
    margin-top: -1px; /* Solitamente aiuta a unire visivamente i bordi */
}

/* ⭐ FIX AGGIORNATO: Assicuriamo che il dropdown sia sopra il div che scorre */
.log-header-container .dropdown-menu {
    /* Lo z-index è necessario per assicurare che il menu si sovrapponga a tutto */
    z-index: 9999 !important;
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
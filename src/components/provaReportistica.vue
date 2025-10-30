<template>
  <div class="report-container">

    <div class="card p-4 mb-4 shadow-sm filter-block">
      <div class="row align-items-end g-3">

        <div class="col-md-auto">
          <label for="reportType" class="form-label fw-bold">Tipo Report</label>
          <select class="form-select" id="reportType" v-model="reportType">
            <option value="daily">Report Giornaliero</option>
            <option value="range">Report Intervallo Date</option>
          </select>
        </div>

        <div class="col-md-auto">
          <label for="startDate" class="form-label fw-bold">{{ reportType === 'daily' ? 'Giorno Selezionato' : 'Data Inizio' }}</label>
          <input type="date" class="form-control" id="startDate" v-model="startDate">
        </div>

        <div class="col-md-auto" v-if="reportType === 'range'">
          <label for="endDate" class="form-label fw-bold">Data Fine</label>
          <input type="date" class="form-control" id="endDate" v-model="endDate">
        </div>

        <div class="col-md-auto">
          <button class="btn btn-primary" @click="fetchReportData" :disabled="isLoading">
            <i v-if="isLoading" class="spinner-border spinner-border-sm me-2"></i>
            <i v-else class="bi bi-search me-2"></i>
            Genera Report
          </button>
        </div>

      </div>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
      <p class="mt-2 text-secondary">Caricamento dati di reportistica per {{ plcId }}...</p>
    </div>

    <div v-else>
      <p v-if="filteredReportData.length > 0 || filteredContatoriData.length > 0 || filteredNotificheData.length > 0" class="text-muted small">
          Stati filtrati: **{{ filteredReportData.length }}** record | Contatori filtrati: **{{ filteredContatoriData.length }}** record | Notifiche filtrate: **{{ filteredNotificheData.length }}** record
      </p>

      <h3 class="report-section-title">Riepilogo Prestazioni</h3>
      <div class="row g-4 mb-5">

        <div class="col-md-3">
          <div class="kpi-card text-center shadow-sm">
            <p class="kpi-label">Produzione Totale (Pezzi)</p>
            <h3 class="kpi-value text-primary">{{pezziTotali}}</h3> </div>
        </div>

        <div class="col-md-3">
          <div class="kpi-card text-center shadow-sm">
            <p class="kpi-label">Velocità Media</p>
            <h3 class="kpi-value text-success">{{ velocitaMedia }}</h3> </div>
        </div>

        <div class="col-md-3">
          <div class="kpi-card text-center shadow-sm">
            <p class="kpi-label">Temperatura Media</p>
            <h3 class="kpi-value text-info">{{ temperaturaMedia }}</h3> </div>
        </div>

        <div class="col-md-3">
          <div class="kpi-card text-center shadow-sm">
            <p class="kpi-label">Allarmi/Warning Totali</p>
            <h3 class="kpi-value text-danger">{{ allarmiTotali }}</h3> </div>
        </div>
      </div>

      <h3 class="report-section-title">Analisi Temporale e Stato Macchina</h3>
      <div class="row g-4 mb-5">

        <div class="col-lg-6">
          <div class="card shadow-sm chart-card">
            <div class="card-header bg-light text-primary fw-bold">Produzione Oraria (Pezzi in Più)</div>
            <div class="card-body">

              <div v-if="!isLoading && produzioneOrariaData.length > 0">
                  <apexchart
                      type="bar"
                      :options="chartOptions"
                      :series="chartSeries"
                      height="350"
                  ></apexchart>
              </div>
              <div v-else-if="!isLoading" class="chart-placeholder">
                  Nessun dato di produzione oraria disponibile nel periodo selezionato.
              </div>
              <div v-else class="chart-placeholder">
                  Caricamento Grafico...
              </div>

            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card shadow-sm chart-card">
            <div class="card-header bg-light text-primary fw-bold">Andamento Temperatura CPU nel Tempo</div>
            <div class="card-body">
              <div v-if="!isLoading && temperaturaAndamentoData.length > 0">
                <apexchart
                    type="line"
                    :options="temperatureChartOptions"
                    :series="temperatureChartSeries"
                    height="350"
                ></apexchart>
              </div>
              <div v-else-if="!isLoading" class="chart-placeholder">
                  Nessun dato di temperatura disponibile nel periodo selezionato.
              </div>
              <div v-else class="chart-placeholder">
                  Caricamento Grafico...
              </div>
              </div>
          </div>
        </div>
      </div>

      <h3 class="report-section-title">Dettaglio Allarmi e Warning</h3>
      <div class="row g-4 mb-5">
          <div class="col-lg-5">
              <div class="card shadow-sm chart-card">
                  <div class="card-header bg-light text-primary fw-bold">Ripartizione Tipi di Allarme/Warning</div>
                  <div class="card-body">
                      <div class="chart-placeholder">Grafico a Torta / Anello (Placeholder - basato su Notifiche)</div>
                  </div>
              </div>
          </div>

          <div class="col-lg-7">
              <div class="card shadow-sm chart-card">
                  <div class="card-header bg-light text-primary fw-bold">Tabella Dettaglio Eventi Storici</div>
                  <div class="card-body">
                      <div class="table table-responsive overflow-auto" style="max-height: 250px">
                          <table class="table table-striped table-sm">
                              <thead>
                                  <tr>
                                      <th>Num.</th>
                                      <th>Codice</th>
                                      <th>Data/Ora Inizio</th>
                                      <th>Stato</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-if="logAllarmiTotali.length === 0">
                                      <td colspan="5" class="text-center text-secondary">Nessuna notifica trovata nel periodo.</td>
                                  </tr>
                                  <tr v-if="logAllarmiTotali.length !== 0" v-for="(item, index) in logAllarmiTotali" :key="index">
                                      <td>{{index + 1}}</td>
                                      <td>{{item.id}}</td>
                                      <td>{{item.ora}}</td>
                                      <td>{{item.stato}}</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, defineProps, ref, watch} from 'vue';
import {usePlc1Store, usePlc2Store, usePlc3Store} from "@/stores/index.js";
import VueApexCharts from "vue3-apexcharts";

const apexchart = VueApexCharts;

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

const props = defineProps({
  plcId: {
    type: String,
    required: true,
  }
});

const reportType = ref('daily');
const startDate = ref(getTodayDate());
const endDate = ref(getTodayDate());
const isLoading = ref(false);

const filteredReportData = ref([]);
const filteredContatoriData = ref([]);
const filteredNotificheData = ref([]);

const pezziTotali = ref(0);
const velocitaMedia = ref(0);
const temperaturaMedia = ref(0);
const allarmiTotali = ref(0);


function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function getRawData(dataType) {
    let store;
    switch (props.plcId) {
        case 'PLC1': store = plc1; break;
        case 'PLC2': store = plc2; break;
        case 'PLC3': store = plc3; break;
        default: return [];
    }

    if (dataType === 'stati') {
        return store.getStati || [];
    } else if (dataType === 'contatori') {
        return store.getContatori || [];
    } else if (dataType === 'notifiche') {
        return store.getNotifiche || [];
    }
    return [];
}


function getPrecedingRecord(data, startDateString) {
    if (!data || data.length === 0) {
        return null;
    }

    const startTimestamp = new Date(`${startDateString}T00:00:00.000Z`).getTime();

    for (let i = 0; i < data.length; i++) {
        const itemTimestamp = new Date(data[i].ora).getTime();
        if (itemTimestamp < startTimestamp) {
            return data[i];
        }
    }

    return null;
}


function filterDataByTimeRange(data, startDateString, finalEndDateString, includePreceding = false) {
    if (!data || data.length === 0) {
        return [];
    }

    const startTimestamp = new Date(`${startDateString}T00:00:00.000Z`).getTime();
    const nextDay = new Date(`${finalEndDateString}T00:00:00.000Z`);
    nextDay.setDate(nextDay.getDate() + 1);
    const endTimestamp = nextDay.getTime();

    let filtered = data.filter(item => {
        const itemTimestamp = new Date(item.ora).getTime();
        return itemTimestamp >= startTimestamp && itemTimestamp < endTimestamp;
    });

    if (includePreceding) {
        const precedingRecord = getPrecedingRecord(data, startDateString);

        if (precedingRecord) {
            filtered.push(precedingRecord);
        }
    }

    return filtered;
}


function setPezziTotali() {
  if(filteredContatoriData.value.length > 0) {
      pezziTotali.value = (filteredContatoriData.value[0].contatorepezzitotale || 0) - (filteredContatoriData.value[filteredContatoriData.value.length - 1].contatorepezzitotale || 0);
  } else {
      pezziTotali.value = 0;
  }
}

function calcolaVelocitaMedia() {
  if(filteredContatoriData.value.length > 0) {
    const listaDati = filteredContatoriData.value;
    const sommaVelocita = listaDati.reduce((sum, item) => {
      const velocita = item.velocitaproduzionepezziminuto || 0;
      return sum + velocita;
    }, 0);
    velocitaMedia.value = (sommaVelocita/ listaDati.length).toFixed(2);
  } else {
      velocitaMedia.value = 0;
  }
}

function calcolaTemperaturaMedia() {
    if(filteredContatoriData.value.length > 0) {
    const listaDati = filteredContatoriData.value;
    const sommaTemperatura = listaDati.reduce((sum, item) => {
      const temperatura = item.temperaturacpu || 0;
      return sum + temperatura;
    }, 0);
    temperaturaMedia.value = (sommaTemperatura/ listaDati.length).toFixed(2);
  } else {
      temperaturaMedia.value = 0;
  }
}

function contaAllarmiTotali() {
    let listaDati = filteredNotificheData.value.filter(item => item.stato);
    allarmiTotali.value = listaDati.length;
}

const logAllarmiTotali = computed(() => {
   return filteredNotificheData.value.filter(item => item.stato);
});

function updateAllKPIs() {
    setPezziTotali();
    calcolaVelocitaMedia();
    calcolaTemperaturaMedia();
    contaAllarmiTotali();
}


function calcolaProduzioneOraria() {
    if (filteredContatoriData.value.length === 0) {
        return [];
    }

    const datiCrescentiArrotondati = [...filteredContatoriData.value]
        .sort((a, b) => new Date(a.ora).getTime() - new Date(b.ora).getTime())
        .map(item => {
            const dataOra = new Date(item.ora);
            dataOra.setMinutes(0, 0, 0);

            return {
                oraArrotondata: dataOra.toISOString(),
                contatore: item.contatorepezzitotale || 0,
            };
        });

    const gruppiOrari = {};

    datiCrescentiArrotondati.forEach(item => {
        const chiaveOra = item.oraArrotondata;
        if (!gruppiOrari[chiaveOra]) {
            gruppiOrari[chiaveOra] = [];
        }
        gruppiOrari[chiaveOra].push(item);
    });

    const startReport = new Date(`${startDate.value}T00:00:00Z`);
    const tempEnd = new Date(`${endDate.value}T00:00:00Z`);
    tempEnd.setDate(tempEnd.getDate() + 1);
    const endReport = tempEnd;

    const risultatiFinali = [];

    let ultimoContatoreValido = 0;
    if (filteredContatoriData.value.length > 0) {
        ultimoContatoreValido = filteredContatoriData.value[filteredContatoriData.value.length - 1].contatorepezzitotale || 0;
    }

    let contatoreDiInizioCorrente = ultimoContatoreValido;
    let ultimoContatoreDiProduzione = ultimoContatoreValido;

    let currentHour = new Date(startReport);

    while (currentHour.getTime() < endReport.getTime()) {
        const oraISO = currentHour.toISOString();
        const gruppo = gruppiOrari[oraISO];

        let contatoreDiFineCorrente = contatoreDiInizioCorrente;
        let pezziProdotti = 0;

        if (gruppo && gruppo.length > 0) {

            contatoreDiInizioCorrente = ultimoContatoreDiProduzione;

            contatoreDiFineCorrente = gruppo[gruppo.length - 1].contatore;

            pezziProdotti = contatoreDiFineCorrente - contatoreDiInizioCorrente;

            ultimoContatoreDiProduzione = contatoreDiFineCorrente;

        } else {
            pezziProdotti = 0;
            contatoreDiFineCorrente = contatoreDiInizioCorrente;
        }

        risultatiFinali.push({
            x: oraISO,
            y: pezziProdotti,
        });

        currentHour.setHours(currentHour.getHours() + 1);

        contatoreDiInizioCorrente = ultimoContatoreDiProduzione;
    }

    return risultatiFinali;
}

const produzioneOrariaData = computed(() => {
    return calcolaProduzioneOraria();
});

const chartOptions = computed(() => ({
    chart: {
        id: 'hourly-production-chart',
        type: 'bar',
        toolbar: {
            show: true
        }
    },
    xaxis: {
        type: 'datetime',
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMM',
                day: 'dd MMM',
                hour: 'HH:mm'
            },
            style: {
                fontSize: '10px'
            }
        },
        title: {
            text: 'Ora di Riferimento'
        }
    },
    yaxis: {
        title: {
            text: 'Pezzi Prodotti nell\'Ora'
        },
        labels: {
            formatter: function (val) {
                return val.toFixed(0);
            }
        }
    },
    dataLabels: {
        enabled: true,
        formatter: function (val) {
            return val.toFixed(0);
        }
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        }
    },
    plotOptions: {
        bar: {
            columnWidth: '80%',
            colors: {
                ranges: [
                    {
                        from: -9999999,
                        to: -0.0001,
                        color: '#dc3545'
                    }
                ],
                allowMultipleSeriesInSameRect: true,
            }
        }
    },
    colors: ['#17a2b8']
}));

const chartSeries = computed(() => [{
    name: "Pezzi Prodotti",
    data: produzioneOrariaData.value
}]);

// ----------------------------------------------------------------------
// NUOVE FUNZIONI PER IL GRAFICO DELLA TEMPERATURA
// ----------------------------------------------------------------------

function calcolaTemperaturaAndamento() {
    if (filteredContatoriData.value.length === 0) {
        return [];
    }

    // 1. Ordina i dati dal più vecchio al più recente (necessario per un grafico a linea temporale corretto)
    // Dato che il filtro 'filterDataByTimeRange' inverte l'ordine, li riordiniamo per ora crescente.
    // L'ultimo elemento (più vecchio) è lo stato iniziale, il primo (più recente) è lo stato finale.
    const datiOrdinati = [...filteredContatoriData.value].sort((a, b) => new Date(a.ora).getTime() - new Date(b.ora).getTime());

    const reportStartTimestamp = new Date(`${startDate.value}T00:00:00Z`).getTime();

    // Calcola l'ora di fine (fine giornata o ora corrente se la data è oggi)
    let finalEndDate = endDate.value;
    if (reportType.value === 'daily') {
        finalEndDate = startDate.value;
    }
    const todayDate = getTodayDate();
    let reportEndTimestamp;

    if (finalEndDate === todayDate) {
        // Se il giorno finale è oggi, l'end time è l'ora attuale
        reportEndTimestamp = new Date().getTime();
    } else {
        // Altrimenti, è la mezzanotte del giorno successivo
        const nextDay = new Date(`${finalEndDate}T00:00:00Z`);
        nextDay.setDate(nextDay.getDate() + 1);
        reportEndTimestamp = nextDay.getTime();
    }


    let temperaturaAndamento = [];

    // Gestione del singolo elemento per la linea orizzontale
    if (datiOrdinati.length === 1) {
        const temperatura = datiOrdinati[0].temperaturacpu || 0;

        // Aggiungi un punto all'inizio dell'intervallo
        temperaturaAndamento.push({
            x: reportStartTimestamp,
            y: temperatura
        });

        // Aggiungi un secondo punto alla fine dell'intervallo per disegnare una linea orizzontale
        temperaturaAndamento.push({
            x: reportEndTimestamp,
            y: temperatura
        });

        return temperaturaAndamento;
    }

    // Gestione di più elementi
    datiOrdinati.forEach(item => {
        const timestamp = new Date(item.ora).getTime();
        const temperatura = item.temperaturacpu || 0;

        // Inserisce solo i punti che sono all'interno dell'intervallo scelto dall'utente
        if (timestamp >= reportStartTimestamp && timestamp <= reportEndTimestamp) {
             temperaturaAndamento.push({
                x: timestamp,
                y: temperatura
            });
        }
    });

    // Aggiunge il punto iniziale se non è già presente nel primo record filtrato
    const primoRecordNelRange = datiOrdinati.find(item => new Date(item.ora).getTime() >= reportStartTimestamp);

    if (primoRecordNelRange && new Date(primoRecordNelRange.ora).getTime() > reportStartTimestamp) {
        // Cerca il record che precede il reportStartTimestamp (stato iniziale)
        const recordPrecedente = datiOrdinati.slice(0, datiOrdinati.indexOf(primoRecordNelRange))
            .filter(item => new Date(item.ora).getTime() < reportStartTimestamp)
            .pop(); // Prende l'ultimo record precedente (il più vicino al reportStartTimestamp)

        if (recordPrecedente) {
            // Aggiunge un punto all'inizio del grafico con il valore precedente
            temperaturaAndamento.unshift({
                x: reportStartTimestamp,
                y: recordPrecedente.temperaturacpu || 0
            });
        } else if(temperaturaAndamento.length > 0) {
            // Se non c'è un record precedente, ma ci sono dati, usa il valore del primo dato trovato nel range
             temperaturaAndamento.unshift({
                x: reportStartTimestamp,
                y: temperaturaAndamento[0].y
            });
        }
    }

    // Aggiunge l'ultimo punto per estendere la linea fino alla fine dell'intervallo
    if (temperaturaAndamento.length > 0 && temperaturaAndamento[temperaturaAndamento.length - 1].x < reportEndTimestamp) {
        const lastTemp = temperaturaAndamento[temperaturaAndamento.length - 1].y;

        // Aggiungi un punto alla fine dell'intervallo con l'ultimo valore di temperatura
        temperaturaAndamento.push({
            x: reportEndTimestamp,
            y: lastTemp
        });
    }


    return temperaturaAndamento;
}

const temperaturaAndamentoData = computed(() => {
    return calcolaTemperaturaAndamento();
});

const temperatureChartOptions = computed(() => ({
    chart: {
        id: 'temperature-line-chart',
        type: 'line',
        toolbar: {
            show: true
        },
        zoom: {
            enabled: true
        }
    },
    stroke: {
        curve: 'stepline', // Usa 'stepline' per mostrare i cambi di stato (temperatura) nel tempo
        width: 3
    },
    markers: {
        size: 0 // Nessun marcatore per i punti dati
    },
    xaxis: {
        type: 'datetime',
        min: new Date(`${startDate.value}T00:00:00Z`).getTime(),
        max: (function() {
             let finalEndDate = endDate.value;
             if (reportType.value === 'daily') {
                 finalEndDate = startDate.value;
             }
             const todayDate = getTodayDate();
             if (finalEndDate === todayDate) {
                 return new Date().getTime(); // Ora corrente
             } else {
                 const nextDay = new Date(`${finalEndDate}T00:00:00Z`);
                 nextDay.setDate(nextDay.getDate() + 1);
                 return nextDay.getTime(); // Mezzanotte del giorno successivo
             }
         })(),
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMM',
                day: 'dd MMM',
                hour: 'HH:mm'
            },
            style: {
                fontSize: '10px'
            }
        },
        title: {
            text: 'Data e Ora'
        },
        tooltip: {
            enabled: false
        }
    },
    yaxis: {
        title: {
            text: 'Temperatura CPU (°C)'
        },
        labels: {
            formatter: function (val) {
                return val.toFixed(1);
            }
        }
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm:ss'
        },
        y: {
            formatter: function (val) {
                return val.toFixed(1) + ' °C';
            }
        }
    },
    colors: ['#ffc107'] // Colore giallo/arancio di warning/info
}));

const temperatureChartSeries = computed(() => [{
    name: "Temperatura CPU",
    data: temperaturaAndamentoData.value
}]);

// ----------------------------------------------------------------------
// FINE NUOVE FUNZIONI PER IL GRAFICO DELLA TEMPERATURA
// ----------------------------------------------------------------------


const fetchReportData = async () => {
    let finalEndDate = endDate.value;
    if (reportType.value === 'daily') {
        finalEndDate = startDate.value;
    }

    if (startDate.value && finalEndDate && startDate.value > finalEndDate) {
        alert("Attenzione: La Data Inizio non può essere successiva alla Data Fine.");
        return;
    }

    isLoading.value = true;

    const rawStati = getRawData('stati');
    filteredReportData.value = filterDataByTimeRange(rawStati, startDate.value, finalEndDate, true);

    const rawContatori = getRawData('contatori');
    filteredContatoriData.value = filterDataByTimeRange(rawContatori, startDate.value, finalEndDate, true);

    const rawNotifiche = getRawData('notifiche');
    filteredNotificheData.value = filterDataByTimeRange(rawNotifiche, startDate.value, finalEndDate, false);

    updateAllKPIs();

    isLoading.value = false;
};


fetchReportData();

watch(() => props.plcId, () => {
    fetchReportData();
});

watch([startDate, endDate, reportType], (newValues, oldValues) => {
    if (reportType.value === 'daily' && startDate.value !== endDate.value) {
        endDate.value = startDate.value;
        return;
    }

    if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1] || newValues[2] !== oldValues[2]) {
        fetchReportData();
    }
});

</script>

<style scoped>
:root {
  --color-primary: #14265a;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
}

.report-container {
    padding: 1rem;
}

.report-section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-primary);
    border-bottom: 2px solid #dee2e6;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    margin-top: 2rem;
}

.filter-block {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
}

.kpi-card {
    background-color: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1.5rem;
    height: 100%;
}

.kpi-label {
    font-size: 0.9rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
}

.kpi-value {
    font-size: 2.2rem;
    font-weight: 700;
}

.chart-card {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    height: 100%;
}

.card-header {
    background-color: #f8f9fa !important;
    border-bottom: 1px solid #dee2e6;
}

.chart-placeholder {
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #adb5bd;
    border: 2px dashed #e9ecef;
    border-radius: 4px;
    font-style: italic;
    background-color: #f8f9fa;
}
</style>
<script setup>
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { usePlc1Store, usePlc2Store, usePlc3Store} from '@/stores/index';

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();


function getAlignedSeries() {

    const formatData = (items, plcIndex) => {
        return items.map(item => {
            const oraDB = item.ora;
            const oraUTCForzata = oraDB.replace(' ', 'T').slice(0, -3) + 'Z';
            const time = new Date(oraUTCForzata).getTime();

            return {
                time: time,
                value: item.contatorepezzitotale,
                plc: plcIndex
            };
        });
    };

    const allData = [
        ...formatData(plc1.getContatori, 1),
        ...formatData(plc2.getContatori, 2),
        ...formatData(plc3.getContatori, 3)
    ].sort((a, b) => a.time - b.time);

    if (allData.length === 0) return { PLC1: [], PLC2: [], PLC3: [] };

    const firstTime = allData[0].time;
    const zeroTime = firstTime - 5000;

    const alignedTimeline = [];
    const seriesData = {
        PLC1: [],
        PLC2: [],
        PLC3: []
    };

    const initialPoint = {
        time: zeroTime,
        PLC1: 0,
        PLC2: 0,
        PLC3: 0
    };
    alignedTimeline.push(initialPoint);

    let lastValues = {
        PLC1: 0,
        PLC2: 0,
        PLC3: 0
    };

    const uniqueTimestamps = [...new Set(allData.map(item => item.time))].sort((a, b) => a - b);

    uniqueTimestamps.forEach(currentTime => {
        let currentValues = { ...lastValues, time: currentTime };
        const updates = allData.filter(item => item.time === currentTime);

        updates.forEach(update => {
            currentValues[`PLC${update.plc}`] = update.value;
        });

        alignedTimeline.push(currentValues);
        lastValues = currentValues;
    });

    alignedTimeline.forEach(point => {
        seriesData.PLC1.push([point.time, point.PLC1]);
        seriesData.PLC2.push([point.time, point.PLC2]);
        seriesData.PLC3.push([point.time, point.PLC3]);
    });

    return seriesData;
}


const alignedData = getAlignedSeries();

// 🚀 NUOVA LOGICA: Calcolo del massimo dinamico
let maxTotalValue = 0;
[alignedData.PLC1, alignedData.PLC2, alignedData.PLC3].forEach(series => {
    if (series.length > 0) {
        const currentMax = Math.max(...series.map(point => point[1]));
        if (currentMax > maxTotalValue) {
            maxTotalValue = currentMax;
        }
    }
});

const dynamicMax = maxTotalValue;

// 🚀 NUOVA LOGICA: Ordina le serie per valore massimo decrescente per evitare sovrapposizioni
const rawSeries = [
    { name: 'PLC1', data: alignedData.PLC1, originalMax: Math.max(0, ...alignedData.PLC1.map(p => p[1])) },
    { name: 'PLC2', data: alignedData.PLC2, originalMax: Math.max(0, ...alignedData.PLC2.map(p => p[1])) },
    { name: 'PLC3', data: alignedData.PLC3, originalMax: Math.max(0, ...alignedData.PLC3.map(p => p[1])) }
];

// Ordina le serie in base al valore massimo (dal più grande al più piccolo)
// La serie con il valore più basso verrà disegnata per ultima (sopra le altre)
const orderedSeries = rawSeries.sort((a, b) => b.originalMax - a.originalMax);

const series = computed(() => {

    // Controlla che alignedData.value esista e non sia vuoto
    if (!alignedData.value || alignedData.value.PLC1.length === 0) {
        return [];
    }


    return orderedSeries.map(s => ({ name: s.name, data: s.data }));
});



const chartOptions = ref({
    chart: {
        type: 'area',
        height: 400,
        stacked: false, // Lasciato a false per aree sovrapposte ma distinte
        toolbar: {
            show: true
        },

    },
    // 🎨 NUOVI COLORI E ORDINE CORRETTO DEI COLORI
    colors: ['#CED4DC', '#00E396', '#8A2BE2'], // I colori devono seguire l'ordine delle serie ordinate
    dataLabels: {
        enabled: false
    },
    tooltip: {
        x: {
            format: 'dd MMM yyyy HH:mm:ss'
        }
    },
    stroke: {
        curve: 'stepline'
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
        }
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'left'
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        min: 0,
        max: Math.ceil(dynamicMax / 5000) * 5000,
        labels: {
            formatter: function (val) {
                return val ? val.toLocaleString() : val;
            }
        }
    }
});

</script>

<template>
  <div class="area-chart-container">
    <VueApexCharts
        type="area"
        height="400"
        :options="chartOptions"
        :series="series"
    />
  </div>
</template>

<style scoped>
.area-chart-container {
    padding: 10px;
    background-color: var(--color-card-bg);
    border-radius: 8px;
}
</style>
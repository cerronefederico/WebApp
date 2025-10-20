<template>
<div class="card shadow-sm">

    <div class="card-header bg-primary text-white">
      <div class="hstack gap-3">
  <div class="p-2">Dati Contatori</div>
  <div class="ms-auto">Ultimo Aggiornamento: {{formattedLastUpdate}}</div>
  </div>
    </div>

    <div class="row g-4 p-2">

      <div class="col-12 col-md-6">
        <div class="card bg-primary text-white shadow">
          <div class="card-body">
            <h5 class="card-title">Produzione Totale</h5>
            <p class="card-text fs-1 fw-bold">{{props.plcStore.getContatori[0].contatorepezzitotale}}</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card bg-info text-white shadow">
          <div class="card-body">
            <h5 class="card-title">Produzione Parziale</h5>
            <p class="card-text fs-1 fw-bold">{{props.plcStore.getContatori[0].contatorepezziparziale}}</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card shadow">
          <div class="card-header bg-light">
            Produzione Oraria
          </div>
          <div class="card-body text-center ">
            <apexchart
              type="radialBar"
              height="300"
              :options="gaugeOptions"
              :series="gaugeSeries"
            ></apexchart>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card shadow">
          <div class="card-header bg-light">
            Temperatura CPU con Allarme
          </div>
          <div class="card-body">
            <apexchart
              type="bar"
              height="250"
              :options="columnOptions"
              :series="columnSeries"
            ></apexchart>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';
// Rimosso: import { usePlc1Store} from '@/stores/index';
import VueApexCharts from 'vue3-apexcharts'; // Aggiunto se non presente

// ⭐ Definisco la prop per ricevere lo store
const props = defineProps({
  plcStore: {
    type: Object,
    required: true,
  },
});

const formattedLastUpdate = computed(() => {
    // Uso props.plcStore
    const oraCompleta = props.plcStore.getContatori[0]?.ora;

    if (!oraCompleta || typeof oraCompleta !== 'string') {
        return 'N/A';
    }

    const puntoIndex = oraCompleta.indexOf('.');

    if (puntoIndex !== -1) {
        return oraCompleta.substring(0, puntoIndex).replace('T', ' ');
    }

    const plusIndex = oraCompleta.indexOf('+');
    if (plusIndex !== -1) {
        return oraCompleta.substring(0, plusIndex).replace('T', ' ');
    }

    return oraCompleta.replace('T', ' ');
});

// --- Logica dei Grafici (Dati Reattivi) ---
const MAX_VELOCITA = 800; // Definisci la tua costante massima qui

const gaugeSeries = computed(() => {
  // Uso props.plcStore
  const valoreCorrente = props.plcStore.getContatori[0].velocitaproduzionepezziminuto || 0;
  const percentuale = (valoreCorrente / MAX_VELOCITA) * 100;
  return [Math.min(percentuale, 100)];
});


const gaugeOptions = {
    chart: {type: 'radialBar' },
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: { background: '#e7e7e7', strokeWidth: '97%', margin: 5 },
           total: {
                show: true,
                max: 800,
                formatter: function (w) {
                    return 800;
                }
            },
            dataLabels: {
                name: { show: true,
                  offsetY: -15,
                },
                value: {
                    // La logica di formattazione non è ottimale qui.
                    // Se ApexCharts calcola il valore dal 100%, la formula dovrebbe essere corretta.
                    formatter: function(val) { return parseFloat(val)/100*800; },
                    fontSize: '30px',
                    show: true,
                  offsetY: -1,
                }
            }
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
        }
    },
    labels: ['Pezzi al Minuto'],
};

// 2. COLONNA CON MARCATORE (BAR: Temperatura CPU)
const columnSeries = computed(() => {
  // Uso props.plcStore
  return [{
    name: 'Temperatura',
    data: [props.plcStore.getContatori[0].temperaturacpu || 0]
  }];
});

const columnOptions = {
    chart: { type: 'bar', height: 250 },
    annotations: {
        yaxis: [{
            y: 90,
            borderColor: '#FF4560',
            label: {
                borderColor: '#FF4560',
                style: { background: '#FF4560', color: '#fff' },
                text: 'Allarme (90)'
            }
        }]
    },
    plotOptions: {
        bar: { columnWidth: '40%', distributed: true }
    },
    dataLabels: { enabled: true },
    xaxis: { categories: ['Temperatura CPU'] },
    yaxis: { min: 0, max: 100 },
    legend: { show: false }
};
</script>

<style scoped>
.card-text {
  padding-top: 10px;
}
</style>
<template>
  <div class="container my-4">
    <h1 class="mb-4">Dashboard Dati PLC (PLC1)</h1>

    <div class="row g-4">

      <div class="col-12 col-md-6">
        <div class="card bg-primary text-white shadow">
          <div class="card-body">
            <h5 class="card-title">Produzione Totale</h5>
            <p class="card-text fs-1 fw-bold">{{plc1.getContatori[0].contatorepezzitotale}}</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="card bg-info text-white shadow">
          <div class="card-body">
            <h5 class="card-title">Produzione Parziale</h5>
            <p class="card-text fs-1 fw-bold">{{plc1.getContatori[0].contatorepezziparziale}}</p>
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
import { computed } from 'vue';
// Importa gli Store Pinia
import { usePlc1Store} from '@/stores/index';

// Inizializza gli Store. Sono automaticamente reattivi.
const plc1 = usePlc1Store();

// --- Logica dei Grafici (Dati Reattivi) ---
const MAX_VELOCITA = 800; // Definisci la tua costante massima qui

const gaugeSeries = computed(() => {
  const valoreCorrente = plc1.getContatori[0].velocitaproduzionepezziminuto || 0;
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
                    formatter: function(val) { return parseFloat(val)/100*800; }, // Rimosso un ref non necessario, formattazione semplice
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
            shade: 'dark', // Corretto 'darck' in 'dark'
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
  // Restituisce la temperatura CPU come serie per ApexCharts
  // Assumo che plc1.temperaturaCpu contenga il valore.
  return [{
    name: 'Temperatura',
    data: [plc1.getContatori[0].temperaturacpu || 0]
  }];
});

const columnOptions = {
    chart: { type: 'bar', height: 250 },
    // Impostazioni per trasformare la colonna in un punto con marcatore
    annotations: {
        yaxis: [{
            y: 90, // Valore di allarme statico
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
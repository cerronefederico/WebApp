<script setup>
import { ref, computed, defineProps, watch } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
  plcStore: {
    type: Object,
    required: true,
  },
});

const currentPlc = computed(() => props.plcStore);

const plcId = computed(() => {
  // Pinia espone l'ID dello store tramite $id
  return currentPlc.value.$id ? currentPlc.value.$id.toUpperCase() : 'PLC Sconosciuto';
});
// Mappa degli Allarmi (ABBREVIATA)
const alarmMap = {
    aanomaliagenerica : {"Anomalia Generica" : "#66bb6a"},
    amotorenastro : {"Anomalia Motore Nastro" : "#ff0000"},
    amancanzaconsenso : {" Mancanza Consenso" : "#665300"},
    atemperaturaprodottoalta : {"Temp. Prodotto Alta" : "#290000"},
    aemergenzainserita : {"Emergenza Inserita" : "#55fffa"},
    atemperaturacpuelevata : {"Temp. CPU Elevata" : "#ff0ff0"},
    aaggraffatricespenta : {"Aggraffatrice Spenta" : "#550ff0"},
    anastrospento : {"Anomalia Nastro Spento" : "#000ff0"},
};

const yCategories = Object.values(alarmMap).map(item => Object.keys(item)[0]);

function processChartData() {
  const list = currentPlc.value.getStati;

  const resultData = [];
  const alarmsWithActivity = new Set();

  for (let key of Object.keys(alarmMap)) {
    const alarmName = Object.keys(alarmMap[key])[0];
    const fillColor = Object.values(alarmMap[key])[0];
    let flag = 0;
    let indexI = 0;
    let indexF = 0;

    for (let i = list.length-1; i >= 0; i--) {
      const currentState = list[i][key];

      if(flag === 0) {
        if (currentState === true) {
          indexI = i;
          flag = 1;
        }
      } else if (flag === 1) {
        if (currentState === false){
          indexF = i;
          flag = 2;
        }
      }

      if (flag === 2) {
        resultData.push({
          x: alarmName,
          y: [new Date(list[indexI].ora).getTime(),new Date(list[indexF].ora).getTime()],
          fillColor: fillColor,
        });
        alarmsWithActivity.add(alarmName);
        flag = 0;
      }

      if(i === 0 && flag === 1){
        resultData.push({
          x: alarmName,
          y: [new Date(list[indexI].ora).getTime(),new Date().getTime()],
          fillColor: fillColor,
        })
        alarmsWithActivity.add(alarmName);
      }
    }
  }

  const now = new Date().getTime();
  const minimalSpan = 1;

  for (let alarmName of yCategories) {
      if (!alarmsWithActivity.has(alarmName)) {
          resultData.push({
              x: alarmName,
              y: [now, now + minimalSpan],
              fillColor: 'transparent',
          });
      }
  }

  return resultData;
}


const series = computed(() => {
  if (!currentPlc.value || !currentPlc.value.getStati) return [{data: []}];

  const processed = processChartData();
  return [{
    data: processed
  }];
});


const chartOptions = ref({
  title:{
    text: 'Allarmi',
  },
  chart: {
    height: 450,
    type: 'rangeBar',
    toolbar: {
      show: true
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '80%',
      borderRadius: 4,
      dataLabels: {
        hideOverflowingLabels: true,
      }
    },
  },
  xaxis: {
    type: 'datetime',
    title: {
      text: 'Periodo di Attività'
    },
    labels: {
        style: {
            fontSize: '10px'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm dd MMM',
          minute: 'HH:mm:ss dd MMM'
        }
    }
  },
  yaxis: {
    title: {
      text: 'Allarme'
    },
    categories: yCategories,
    labels: {
      style: {
        fontSize: '10px',
        width: '200px',
      },
      trim: false,
    }
  },
  grid: {
    xaxis: {
      lines: {
        show: true
      }
    }
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
      const name = data.x;
      const duration = data.y[1] - data.y[0];

      if (duration < 100) {
          return (
            '<div class="p-2 bg-white text-gray-800 rounded-lg shadow-xl">' +
            '<div><b>Allarme:</b> ' + name + '</div>' +
            '<div>Nessuna Attività Recente nel Periodo.</div>' +
            '</div>'
          );
      }

      const start = new Date(data.y[0]).toLocaleString();
      const end = new Date(data.y[1]).toLocaleString();

      return (
        '<div class="p-3 bg-white text-gray-800 rounded-lg shadow-xl">' +
        '<div><b>Allarme:</b> ' + name + '</div>' +
        '<div><b>Inizio:</b> ' + start + '</div>' +
        '<div><b>Fine:</b> ' + end + '</div>' +
        '</div>'
      );
    }
  }
});

</script>
<template>
  <div class="container">
    <div class="card shadow-sm">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Attivazioni Allarmi {{plcId}}</h5>
      </div>
      <div class="card-body" style="max-height: 500px;">
        <VueApexCharts
          type="rangeBar"
          height="450"
          :options="chartOptions"
          :series="series"
          :key="plcId"
        ></VueApexCharts>
      </div>
    </div>
  </div>
</template>
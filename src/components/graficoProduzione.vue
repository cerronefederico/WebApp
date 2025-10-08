<script setup>
import { ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

function generateDayWiseTimeSeries(baseval, count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = baseval;
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
}

const series = ref([
    {
        name: 'South',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 60 })
    },
    {
        name: 'North',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 20 })
    },
    {
        name: 'Central',
        data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 15 })
    }
]);

const chartOptions = ref({
    chart: {
        type: 'area',
        height: 250,
        stacked: true,
        toolbar: {
            show: true
        },
        events: {
            selection: function (chart, e) {
                console.log(new Date(e.xaxis.min))
            }
        },
    },
    colors: ['#008FFB', '#00E396', '#CED4DC'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'monotoneCubic'
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
});

</script>

<template>
  <div class="area-chart-container">
    <VueApexCharts
        type="area"
        height="250"
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
</style>>
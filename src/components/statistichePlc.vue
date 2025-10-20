<template>
<ul class="list-group">
    <li class="list-group-item">{{plc1.getStati[0]}}//{{plc1.getContatori[0]}}</li>
  <li class="list-group-item">{{time}}</li>
  <li v-for="item in plc1.getStati" class="list-group-item">{{item.atemperaturacpuelevata}}</li>
    </ul>
</template>

<script>
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';
import { useWebSocketStore } from '@/stores/webSoket';



export default {
  setup() {
    const plc1 = usePlc1Store();
    const plc2 = usePlc2Store();
    const plc3 = usePlc3Store();

    const wsStore = useWebSocketStore();
               const oraDB = plc1.getStati[0].ora;
            const oraUTCForzata = oraDB.replace(' ', 'T').slice(0, -6) + 'Z';
            const time = new Date("2025-10-16 13:00:00.000Z").getTime();

    return {
      plc1,
      plc2,
      plc3,
      wsStore,
      time
    };
  }
};
</script>

<style scoped>

</style>
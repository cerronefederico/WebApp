<template>
<ul class="list-group">
    <li class="list-group-item">{{plc1.getStati[0]}}//{{plc1.getContatori[0]}}</li>
  <li v-for="item in plc1.getNotifiche" class="list-group-item">{{item.id}}</li>
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

    return {
      plc1,
      plc2,
      plc3,
      wsStore
    };
  }
};
</script>

<style scoped>

</style>
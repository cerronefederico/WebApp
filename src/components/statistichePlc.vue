<template>
<ul class="list-group">
    <li class="list-group-item">{{plc1.getStati}}//{{plc1.getContatori}}</li>
     <li class="list-group-item">{{plc2.getStati}}//{{plc2.getContatori}}</li>
     <li class="list-group-item">{{plc3.getStati}}//{{plc3.getContatori}}</li>
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
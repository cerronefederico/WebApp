<template>
<ul class="list-group">
    <li class="list-group-item">
    {{plc1.getAcceso}} {{plc1.getBlocco}} {{plc1.getRegime}} {{plc1.getWTermico}} {{plc1.getWAnomaliaNastro}} {{plc1.getWMancanzaProdotto}} {{plc1.getWPieno}} {{plc1.getWPortelloneAperto}} {{plc1.getAAnomaliaGenerica}} {{plc1.getAMotoreNastro}} {{plc1.getAMancanzaConsenso}} {{plc1.getATemperaturaProdottoAlta}} {{plc1.getAEmergenzaInserita}} {{plc1.getATemperaturaCpuElevata}} {{plc1.getAAggraffatriceSpenta}} {{plc1.getANastroSpento}} {{plc1.getContatorePezziTotale}} {{plc1.getContatorePezziParziale}} {{plc1.contatorePezziParzialiBackup}} {{plc1.getVelocitaProduzionePezziMinuto}} {{plc1.getTemperaturaCpu}}
    </li>
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
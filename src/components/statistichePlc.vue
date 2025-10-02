<template>
<ul class="list-group">
    <li class="list-group-item">
    {{plc1.getAcceso}} {{plc1.getBlocco}} {{plc1.getRegime}}/ {{plc1.getWTermico}} {{plc1.getWAnomaliaNastro}} {{plc1.getWMancanzaProdotto}} {{plc1.getWPieno}} {{plc1.getWPortelloneAperto}}/ {{plc1.getAAnomaliaGenerica}} {{plc1.getAMotoreNastro}} {{plc1.getAMancanzaConsenso}} {{plc1.getATemperaturaProdottoAlta}} {{plc1.getAEmergenzaInserita}} {{plc1.getATemperaturaCpuElevata}} {{plc1.getAAggraffatriceSpenta}} {{plc1.getANastroSpento}} / {{plc1.getContatorePezziTotale}} {{plc1.getContatorePezziParziale}} {{plc1.getContatorePezziParzialeBackup}} {{plc1.getVelocitaProduzionePezziMinuto}} {{plc1.getTemperaturaCpu}}
    </li>
     <li class="list-group-item">
    {{plc2.getAcceso}} {{plc2.getBlocco}} {{plc2.getRegime}}/ {{plc2.getWTermico}} {{plc2.getWAnomaliaNastro}} {{plc2.getWMancanzaProdotto}} {{plc2.getWPieno}} {{plc2.getWPortelloneAperto}}/ {{plc2.getAAnomaliaGenerica}} {{plc2.getAMotoreNastro}} {{plc2.getAMancanzaConsenso}} {{plc2.getATemperaturaProdottoAlta}} {{plc2.getAEmergenzaInserita}} {{plc2.getATemperaturaCpuElevata}} {{plc2.getAAggraffatriceSpenta}} {{plc2.getANastroSpento}} / {{plc2.getContatorePezziTotale}} {{plc2.getContatorePezziParziale}} {{plc2.getContatorePezziParzialeBackup}} {{plc2.getVelocitaProduzionePezziMinuto}} {{plc2.getTemperaturaCpu}}
    </li>
     <li class="list-group-item">
    {{plc3.getAcceso}} {{plc3.getBlocco}} {{plc3.getRegime}}/ {{plc3.getWTermico}} {{plc3.getWAnomaliaNastro}} {{plc3.getWMancanzaProdotto}} {{plc3.getWPieno}} {{plc3.getWPortelloneAperto}}/ {{plc3.getAAnomaliaGenerica}} {{plc3.getAMotoreNastro}} {{plc3.getAMancanzaConsenso}} {{plc3.getATemperaturaProdottoAlta}} {{plc3.getAEmergenzaInserita}} {{plc3.getATemperaturaCpuElevata}} {{plc3.getAAggraffatriceSpenta}} {{plc3.getANastroSpento}} / {{plc3.getContatorePezziTotale}} {{plc3.getContatorePezziParziale}} {{plc3.getContatorePezziParzialeBackup}} {{plc3.getVelocitaProduzionePezziMinuto}} {{plc3.getTemperaturaCpu}}
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
<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import PlcElement from "@/components/plcElement.vue";
import SearchBar from "@/components/searchBar.vue";
import { computed } from 'vue';
import { usePlc1Store, usePlc2Store, usePlc3Store } from '@/stores/index';

const plc1 = usePlc1Store();
const plc2 = usePlc2Store();
const plc3 = usePlc3Store();

const totalAlerts = computed(() => {return plc1.getNumeroAllarmi + plc2.getNumeroAllarmi + plc3.getNumeroAllarmi;});
const totalWarnings = computed(() => {return plc1.getNumeroWarning + plc2.getNumeroWarning + plc3.getNumeroWarning;});
const totalOnline = computed(() => {
  let cont=0;
  if(plc1.getAcceso){cont++;}
  if(plc2.getAcceso){cont++;}
  if(plc3.getAcceso){cont++;}
  return cont;
});
</script>

<template>
<header class="app-header-fixed">
   <div class="header-left">
    <MenuHamburgher></MenuHamburgher>
     <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#searchModal">
        Ricerca&nbsp;<i class="bi bi-search"></i>
      </button>
    </div>
    <div class="header-center">
    <h1>ModuView</h1>
    </div>

  <MenuAccount></MenuAccount>
</header>
  <SearchBar></SearchBar>

  <main class="main-content-area">
        <div class="global-summary d-flex justify-content-center gap-3 mb-5">

        <span class="badge rounded-pill bg-danger shadow-sm p-3 fs-6">
            <i class="bi bi-bell-fill"></i> Total Alerts: {{totalAlerts}}
        </span>

        <span class="badge rounded-pill bg-warning text-dark shadow-sm p-3 fs-6">
            <i class="bi bi-exclamation-square-fill"></i> Total Warnings: {{totalWarnings}}
        </span>

        <span class="badge rounded-pill bg-success shadow-sm p-3 fs-6">
            <i class="bi bi-check-circle-fill"></i> Systems Online: {{totalOnline}}
        </span>

    </div>
        <PlcElement></PlcElement>
  </main>
</template>

<style scoped>
.app-header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1.2rem 1.2rem;
  height:auto;

  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(125,125,125,1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-left {
  flex-shrink: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-width: 0;
}

.header-center {
  flex-grow: 1;
  text-align: center;
  padding: 0 0.5rem;
  min-width: 0;
}
.main-content-area{
  display: block;
  width: 100%;
  padding: 0;
  margin: 100px auto 0 auto;
}
.app-header-fixed > :last-child{
  flex-shrink: 1;
  min-width: 0;
}
h1 {
  margin: 0;
  /* La funzione clamp() controlla il ridimensionamento del font */
  font-size: clamp(1.2rem, 3vw, 2.5rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>

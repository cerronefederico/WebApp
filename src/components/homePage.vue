<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import PlcElement from "@/components/plcElement.vue";
import SearchBar from "@/components/searchBar.vue";
</script>

<template>
  <div style="position: absolute; top:20px; left: 700px;">
    <h1>ModuView</h1>
  </div>
  <MenuAccount></MenuAccount>
  <MenuHamburgher></MenuHamburgher>
  <SearchBar></SearchBar>
  <PlcElement></PlcElement>
</template>

<style scoped>

</style>
<script setup lang="ts">
import MenuAccount from "@/components/menuAccount.vue";
import MenuHamburgher from "@/components/menuHamburgher.vue";
import PlcElement from "@/components/plcElement.vue";
import SearchBar from "@/components/searchBar.vue";
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

  <MenuAccount class="top-0 end-0"></MenuAccount>
</header>
  <SearchBar></SearchBar>

  <main class="main-content-area">
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
  justify-content: space-between; /* Mantiene spazio tra i tre blocchi (Left, Center, Right) */
  align-items: center;
  background-color: rgba(125,125,125,0.7);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1%;
}
.main-content-area{
  display: flex;
  width: 96%;
  max-width: 1400px;
  margin-left:auto;
  margin-right: auto;
  margin-top:100px;
  flex-direction: column;
  gap: 15px;
}


</style>
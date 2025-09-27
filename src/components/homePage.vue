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

  <MenuAccount></MenuAccount>
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
  justify-content: space-between;
  align-items: center;
  background-color: rgba(125,125,125,0.7);
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
  paddind: 0 0.5rem;
  min-width: 0;
}
.main-content-area{
  display: flex;
  width: 96%;
  max-width: 1400px;
  margin-top:100px;
  flex-direction: column;
  gap: 15px;
  align-items: center;
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
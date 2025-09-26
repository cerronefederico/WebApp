<script setup lang="ts">

</script>

<template>
<div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="searchModalLabel">Cerca PLC...</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Cosa cerchi?" aria-label="Search">
          <button class="btn btn-primary" type="submit">Cerca</button>
        </form>
      </div>
    </div>
  </div>
</div>

</template>

<style scoped>

</style>
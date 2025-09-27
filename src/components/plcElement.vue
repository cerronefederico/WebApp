<script setup lang="ts">

</script>


<template>
<div class="row row-cols-md-3 mx-auto mt-5 p-4 " style="width: 1200px;background-color:rgba(125,125,125,0.7)">
  <div class="col position-relative">
    <div class="card mb-3 bg-gray shadow-2xl">
  <div class="row g-0">
    <div class="col-md-4">

    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title1</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>
  </div>
  <div class="col">
    <div class="card mb-3">
  <div class="row g-0">
    <div class="col-md-4">

    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title2</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>
  </div>
  <div v-if="control" class="col">
    <div class="card mb-3" style="max-width: 540px;">
  <div class="row g-0">
    <div class="col-md-4">

    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title3</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <button type="button" class="btn btn-primary">Visualizza</button>
      </div>
    </div>
  </div>
</div>
  </div>




</div>

</template>

<script>
export default {
  name: 'PlcElement',
  data() {
    return {
      control: true
    };
  },
}
</script>

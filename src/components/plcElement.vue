<script setup lang="ts">

</script>


<template>
    <div class="row row-cols-1 d-flex justify-content-center g-4" style="max-width: 1200px; width: 90%;">
      <div class="col mb-4">
        <div class="card h-100 shadow-lg">
          <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="280" preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">PLC1</h5>
            <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
          </div>
        </div>
      </div>
      <div class="col mb-4">
        <div class="card h-100 shadow-lg">
          <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="280" preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">PLC2</h5>
            <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
          </div>
        </div>
      </div>
      <div class="col mb-4">
        <div class="card h-100 shadow-lg">
          <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="280" preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">PLC3</h5>
            <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
            <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
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

<script setup lang="ts">

</script>


<template>
    <div class="mx-auto" style="max-width: 600px; width: 90%;">
        <div class="card h-100 shadow-lg mb-4">
          <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="280" preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">PLC1</h5>
            <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <div class="status-row d-flex justify-content-between align-items-center mt-2">

              <div class="status-indicators d-flex gap-3">

                <span class="text-danger">
                  <i class="bi bi-x-octagon-fill"></i> Alert: {{ plcData[0].alertCount }}
                </span>

                <span class="text-warning">
                  <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{ plcData[0].warningCount }}
                </span>

              </div>
              </div>
            <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
          </div>
        </div>
        <div class="card h-100 shadow-lg mb-4">
          <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="280" preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">PLC2</h5>
            <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>

            <div class="status-row d-flex justify-content-between align-items-center mt-2">

              <div class="status-indicators d-flex gap-3">

                <span class="text-danger">
                  <i class="bi bi-x-octagon-fill"></i> Alert: {{ plcData[1].alertCount }}
                </span>

                <span class="text-warning">
                  <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{ plcData[1].warningCount }}
                </span>

              </div>
              </div>
            <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
          </div>
        </div>
        <div class="card h-100 shadow-lg mb-4">
          <svg aria-label="Placeholder: Image cap" class="bd-placeholder-img card-img-top" height="280" preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg"><title>Placeholder</title><rect width="100%" height="100%" fill="#868e96"></rect><text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text></svg>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">PLC3</h5>
            <p class="card-text flex-grow-1">This is a longer card with supporting text below as a natural lead-in to additional content.</p>

            <div class="status-row d-flex justify-content-between align-items-center mt-2">

              <div class="status-indicators d-flex gap-3">

                <span class="text-danger">
                  <i class="bi bi-x-octagon-fill"></i> Alert: {{ plcData[2].alertCount }}
                </span>

                <span class="text-warning">
                  <i class="bi bi-exclamation-triangle-fill"></i> Warning: {{ plcData[2].warningCount }}
                </span>

              </div>
              </div>
            <button type="button" class="btn btn-primary mt-2 ms-auto">Visualizza</button>
          </div>
        </div>
      </div>
</template>

<script>
export default {
  name: 'PlcElement',
  data() {
    return {
      control: true,
      plcData: [
        {id: 'PLC1', alertCount: 0, warningCount: 5},
        {id: 'PLC2', alertCount: 2, warningCount: 0},
        {id: 'PLC3', alertCount: 0, warningCount: 6},
      ]
    };
  },
}
</script>

<style>
.status-indicators {
    font-size: 0.9rem;
    font-weight: 500;
}</style>



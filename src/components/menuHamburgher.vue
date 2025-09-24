<template>
  <div class="position-fixed top-0 start-0 m-3 z-index-100">
    <button
      class="btn btn-outline-dark btn-lg"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#menuHamburger"
      aria-controls="offcanvasExample"
    >
      <i class="bi bi-list"></i>
    </button>

    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="menuHamburger"
      aria-labelledby="menuHamburgerLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="menuHamburgerLabel">Gestione rapida</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
        </button>
      </div>
      <div class="offcanvas-body">
        <div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item list-group-item-action">Opzione 1</li>
            <li class="list-group-item list-group-item-action">Opzione 2</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>





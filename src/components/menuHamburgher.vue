<template>
  <div class="z-index-100 menu-wrapper">
    <button
      class="btn btn-outline-dark btn-lg"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#menuHamburger"
      aria-controls="menuHamburger"
    >
      <i class="bi bi-list"></i>
    </button>

    <div
      class="offcanvas offcanvas-start menu-offcanvas"
      tabindex="-1"
      id="menuHamburger"
      aria-labelledby="menuHamburgerLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="menuHamburgerLabel">Navigazione HMI</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div class="offcanvas-body p-0">

        <div class="menu-section">
            <h6 class="menu-title">Dashboard</h6>
            <ul class="list-group list-group-flush custom-list">
                <li class="list-group-item list-group-item-action">
                    <router-link to="/home" class="menu-item"><i class="bi bi-house-door"></i> Home (PLC Status)</router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <router-link to="/alarms" class="menu-item"><i class="bi bi-bell"></i> Allarmi Attivi</router-link>
                </li>
            </ul>
        </div>

        <hr class="menu-divider">

        <div class="menu-section">
            <h6 class="menu-title">Storici e Analisi</h6>
            <ul class="list-group list-group-flush custom-list">
                <li class="list-group-item list-group-item-action">
                    <router-link to="/history/plc-data" class="menu-item"><i class="bi bi-database-up"></i> Dati di Produzione</router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <router-link to="/history/alarms" class="menu-item"><i class="bi bi-clock-history"></i> Storico Allarmi</router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <router-link to="/report" class="menu-item"><i class="bi bi-bar-chart"></i> Reportistica Completa</router-link>
                </li>
            </ul>
        </div>

        <hr class="menu-divider">

        <div class="menu-section">
            <h6 class="menu-title">Sistema</h6>
            <ul class="list-group list-group-flush custom-list">
                <li class="list-group-item list-group-item-action">
                    <router-link to="/user-profile" class="menu-item"><i class="bi bi-person-circle"></i> Il Mio Profilo</router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <router-link to="/settings" class="menu-item"><i class="bi bi-gear"></i> Impostazioni di Sistema</router-link>
                </li>
            </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
// Nessuna logica complessa necessaria
</script>

<style scoped>
/* Il menu offcanvas deve adottare i colori del tema globale */
.menu-offcanvas {
    /* Usa lo sfondo card per l'offcanvas, che si adatta a dark/light */
    background-color: var(--color-card-bg) !important;
    color: var(--color-text-primary);
}


.menu-title {
    color: var(--color-accent); /* Colore primario per il titolo di sezione */
    font-weight: bold;
    margin-top: 15px;
    margin-bottom: 5px;
    padding: 0 15px;
    font-size: 1rem;
}

.custom-list {
    /* Rimuove i bordi del list-group-flush per i nostri stili */
    border: none !important;
}

/* Stile per il singolo elemento del menu (il wrapper del router-link) */
.list-group-item {
    padding: 0 !important; /* Gestiamo il padding direttamente sul router-link */
    background-color: transparent !important; /* Per ereditare lo sfondo del body offcanvas */
    color: var(--color-text-primary);
    border: none !important;
}

.menu-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    text-decoration: none;
    color: var(--color-text-primary);
    transition: background-color 0.2s, color 0.2s;
    font-size: 1.05rem;
    width: 100%; /* Assicura che sia cliccabile su tutta la larghezza */
}

.menu-item:hover,
.router-link-active {
    background-color: var(--color-background-secondary); /* Sfondo più scuro/chiaro al passaggio */
    color: var(--color-accent); /* Colore accento per l'item attivo */
}

.menu-item i {
    margin-right: 12px;
    font-size: 1.2em;
}

.menu-divider {
    border-top: 1px solid var(--color-border);
    margin: 15px 0;
    opacity: 0.5;
}
</style>
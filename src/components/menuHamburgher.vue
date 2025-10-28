<script setup>
import { nextTick } from 'vue'; // Importiamo nextTick per garantire l'esecuzione dopo l'update del DOM
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Chiude il pannello Offcanvas (simulando un click sul bottone di chiusura di Bootstrap).
 * Usiamo nextTick per assicurarci che il routing sia completato o in corso prima di chiudere.
 */
const closeOffcanvas = () => {
  // L'ID del tuo offcanvas è 'menuHamburger'
  const offcanvasElement = document.getElementById('menuHamburger');

  if (offcanvasElement) {
    // Trova il bottone di chiusura all'interno dell'offcanvas
    const closeButton = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');

    // Simula il click sul bottone per attivare la chiusura gestita da Bootstrap JS
    if (closeButton) {
      closeButton.click();
    }
  }
};

/**
 * Gestisce la navigazione e chiude il menu.
 * @param path Il percorso della rotta.
 */
const navigateAndClose = (path) => {
  // Esegue la navigazione
  router.push(path);

  // Chiude l'offcanvas subito dopo la navigazione
  closeOffcanvas();
};
</script>

<template>
  <!-- Rimosso z-index dal div esterno in quanto è gestito dall'offcanvas -->
  <div class="menu-wrapper">
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

        <!-- Sezione Dashboard -->
        <div class="menu-section">
            <h6 class="menu-title">Dashboard</h6>
            <ul class="list-group list-group-flush custom-list">
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/home"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/home')"
                    >
                        <i class="bi bi-house-door"></i> Home (PLC Status)
                    </router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/home/alarms"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/home/alarms')"
                    >
                        <i class="bi bi-bell"></i> Allarmi Attivi
                    </router-link>
                </li>
            </ul>
        </div>

        <hr class="menu-divider">

        <!-- Sezione Storici e Analisi -->
        <div class="menu-section">
            <h6 class="menu-title">Storici e Analisi</h6>
            <ul class="list-group list-group-flush custom-list">
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/history/datiprod"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/history/datiprod')"
                    >
                        <i class="bi bi-database-up"></i> Dati di Produzione
                    </router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/history/alarms"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/history/alarms')"
                    >
                        <i class="bi bi-clock-history"></i> Storico Allarmi
                    </router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/history/report"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/history/report')"
                    >
                        <i class="bi bi-bar-chart"></i> Reportistica Completa
                    </router-link>
                </li>
            </ul>
        </div>

        <hr class="menu-divider">

        <!-- Sezione Sistema -->
        <div class="menu-section">
            <h6 class="menu-title">Sistema</h6>
            <ul class="list-group list-group-flush custom-list">
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/user-profile"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/user-profile')"
                    >
                        <i class="bi bi-person-circle"></i> Il Mio Profilo
                    </router-link>
                </li>
                <li class="list-group-item list-group-item-action">
                    <!-- Modificato: @click chiama la funzione -->
                    <router-link
                        to="/settings"
                        class="menu-item"
                        @click.prevent="navigateAndClose('/settings')"
                    >
                        <i class="bi bi-gear"></i> Impostazioni di Sistema
                    </router-link>
                </li>
            </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Il menu offcanvas deve adottare i colori del tema globale */
/* Larghezza 250px e posizione 120px sotto l'header/searchbar */


/* Forza lo Z-index: il pannello (1060) deve essere sopra il backdrop (1050) */
.offcanvas {
    z-index: 1060 !important;
}

/* **************************************************
 * (Mantieni il resto del tuo stile per colori e link)
 * **************************************************/

/* Il menu offcanvas deve adottare i colori del tema globale */
.menu-offcanvas {
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

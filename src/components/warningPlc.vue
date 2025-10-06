<script setup>
import { defineProps } from 'vue';

// 1. Definizione delle Props usando defineProps
const props = defineProps({
  // La lista di dati che proviene, ad esempio, dalla tua WebSocket Store
  items: {
    type: Array,
    default: () => [
      { id: 1, descrizione: 'Lettura sensore PLC 1', ora: '10:00:15' },
      { id: 2, descrizione: 'Allarme temperatura alta', ora: '10:01:30' },
      { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
        { id: 3, descrizione: 'Ciclo completato', ora: '10:02:45' },
      // Aggiungere altri elementi per testare lo scroll
    ]
  }
});

</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header bg-primary text-white">
      Elenco Elementi Variabili
    </div>

    <div class="table-scroll-container">
      <table class="table table-striped table-hover table-sm mb-0">
        <thead>
          <tr>
            <th style="width: 10%;">ID</th>
            <th style="width: 70%;">Descrizione</th>
            <th style="width: 20%;">Ora</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in props.items" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.descrizione }}</td>
            <td>{{ item.ora }}</td>
          </tr>

          <tr v-if="props.items.length === 0">
            <td colspan="3" class="text-center text-muted">Nessun elemento disponibile.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* 2. CSS per la Scorrevolezza */
.table-scroll-container {
  /* Imposta l'altezza massima del riquadro */
  max-height: 300px; /* Scegli l'altezza che preferisci */

  /* Abilita la barra di scorrimento verticale se il contenuto supera maxHeight */
  overflow-y: auto;

  /* Padding laterale opzionale */
  padding: 0 10px;
}

/* IMPORTANTE: Mantiene l'intestazione fissa durante lo scorrimento del corpo della tabella */
.table-scroll-container table thead th {
    position: sticky;
    top: 0;
    background-color: #f8f9fa; /* Colore di sfondo per l'intestazione fissa */
    z-index: 10; /* Assicura che l'intestazione sia sopra i dati */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}
</style>
<template>
<div class="p-2">
    <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Benvenuto {{displayedUser}} <i class="bi bi-person-circle"></i>
        </button>
        <ul class="dropdown-menu">
          <li><router-link to="/home/gestioneProfilo" class="dropdown-item" role="button">Profilo</router-link></li>
            <li><a class="dropdown-item" href="#">Impostazioni</a></li>
            <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item cursor-pointer" @click="logoutAndRedirect">Disconnetti</a></li>
        </ul>
    </div>
</div>
</template>

<script setup>
// Importazioni necessarie
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import {computed} from "vue";

// Inizializzazione (le variabili e le funzioni sono automaticamente disponibili nel template)
const authStore = useAuthStore();
const router = useRouter();

/**
 * Esegue il logout chiamando l'azione di Pinia e poi naviga alla home page.
 */
const logoutAndRedirect = () => {
  // 1. Chiama l'azione di logout
  authStore.logout();

  // 2. Reindirizza l'utente alla pagina iniziale
  router.push('/');
};
const displayedUser = computed(() => {
  const user = authStore.currentUser;
    return user.slice(0, -8);
});
</script>

<style scoped>
/* Aggiungiamo un cursore per indicare che è cliccabile */
.cursor-pointer {
  cursor: pointer;
}
</style>
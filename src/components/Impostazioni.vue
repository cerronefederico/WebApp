<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from "@/stores/auth.js"; // Lo store ora gestisce anche la posizione del Toast
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const userIdKey = computed(() => authStore.currentUser.email || '');

// Logica per il tema (spostata da Profile.vue)
const theme = ref(
    localStorage.getItem(`hmi-theme-${userIdKey.value}`) || 'light'
);

// Logica per la posizione del Toast (spostata da Profile.vue)
const toastPlacement = computed({
    get: () => authStore.getToastPlacement,
    set: (value) => authStore.setToastPlacement(value)
});

const activeTab = ref('settings'); // Imposta 'settings' come tab predefinita

// Logica di gestione tema (spostata da Profile.vue)
const applyTheme = (currentTheme) => {
    const container = document.getElementById('app-container');

    if (container) {
        container.classList.toggle('dark-mode', currentTheme === 'dark');
        document.body.classList.toggle('dark-bg', currentTheme === 'dark');
    }
};

onMounted(() => {
  applyTheme(theme.value);
});

// Logica di salvataggio preferenze (spostata da Profile.vue)
const savePreferences = () => {
    applyTheme(theme.value);

    localStorage.setItem(`hmi-theme-${userIdKey.value}`, theme.value);

    console.log('Preferenze salvate:', theme.value, authStore.getToastPlacement);
    alert('Preferenze HMI salvate con successo!');
};

// Logica di logout (spostata da Profile.vue)
const handleLogout = () => {
    authStore.logout();
    alert('Logout effettuato. Reindirizzamento al login.');
    router.push('/');
};

// Logica di modifica password (spostata da Profile.vue)
const resetPassword = ref('');
const flagResetPassword = ref(false);
const flagPassword1 = ref(false);

function mostraPassword1() {
  flagPassword1.value = !flagPassword1.value;
}

async function reimpostaPassword() {
  if (resetPassword.value.trim()==="") {
    alert("password vuota");
    return null;
  }
  try {
    flagResetPassword.value=true;
    const response = await fetch('http://localhost:8000/api/cangePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: authStore.currentUser.email,
        password: resetPassword.value,
      }),
    });
    if (response.ok) {
      alert("password modificata");
      authStore.logout();
      router.push('/');
      flagResetPassword.value=false;
    }else {
      alert("errore");
      flagResetPassword.value=false;
    }

  }catch(error) {
    alert("errore");
    flagResetPassword.value=false;
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="header">
      <h2><i class="fas fa-cogs"></i> Impostazioni Utente</h2>
      </div>

    <div class="tabs-nav">
      <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
        <i class="fas fa-desktop"></i> Interfaccia HMI
      </button>
      <button :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
        <i class="fas fa-lock"></i> Sicurezza
      </button>
    </div>

    <div v-if="activeTab === 'settings'" class="tab-content">
      <h3 class="section-title">Personalizzazione Interfaccia</h3>

      <div class="setting-item">
        <label for="theme">Tema Grafico:</label>
        <select id="theme" v-model="theme" class="form-control">
          <option value="light">Chiaro</option>
          <option value="dark">Scuro (Ideale per notturna)</option>
        </select>
      </div>
      <div class="setting-item">
        <form class="w-100">
          <div class="mb-3">
            <label for="selectToastPlacement">Posizione Notifiche Toast</label>
            <select class="form-select mt-2" id="selectToastPlacement" v-model="toastPlacement">
              <option value="">Non mostrare (disabilitato)</option>
              <option value="top-0 start-0">In alto a sinistra</option>
              <option value="top-0 start-50 translate-middle-x">In alto al centro</option>
              <option value="top-0 end-0">In alto a destra</option>
              <option value="top-50 start-0 translate-middle-y">A metà a sinistra</option>
              <option value="top-50 start-50 translate-middle">Al centro dello schermo</option>
              <option value="top-50 end-0 translate-middle-y">A metà a destra</option>
              <option value="bottom-0 start-0">In basso a sinistra</option>
              <option value="bottom-0 start-50 translate-middle-x">In basso al centro</option>
              <option value="bottom-0 end-0">In basso a destra</option>
            </select>
          </div>
        </form>
      </div>

      <button @click="savePreferences" class="btn-primary mt-4">Salva Preferenze</button>
    </div>

    <div v-else-if="activeTab === 'security'" class="tab-content">
      <h3 class="section-title">Modifica Credenziali</h3>

      <div class="password-form-box">
        <p class="text-muted">Il cambio password richiede una re-autenticazione.</p>
        <div class="input-group">
          <div class="d-flex">
        <input :type="flagPassword1 ? 'text' : 'password'" placeholder="Nuova Password" class="form-control mb-3" v-model="resetPassword">
              <i v-if="flagPassword1" v-on:click="mostraPassword1" class="btn bi bi-eye"></i>
              <i v-if="!flagPassword1" v-on:click="mostraPassword1" class="btn bi bi-eye-slash"></i>
          </div>
        </div>
        <button v-on:click="reimpostaPassword" class="btn-secondary">Aggiorna Password</button>
      </div>

      <hr class="my-4">

      <h3 class="section-title">Uscita</h3>
      <button @click="handleLogout" class="btn-danger">
        <i class="fas fa-sign-out-alt"></i> Esegui Logout
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Copia gli stili specifici da Profile.vue per mantenere l'aspetto */
.profile-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 25px;
    background-color: var(--color-card-bg, #fff);
    color: var(--color-text-primary, #343a40);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--color-border, #f0f0f0);
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.tabs-nav {
    display: flex;
    border-bottom: 1px solid var(--color-border, #ddd);
    margin-bottom: 20px;
}

.tabs-nav button {
    background: none;
    border: none;
    padding: 12px 20px;
    cursor: pointer;
    font-size: 1em;
    color: var(--color-text-primary, #6c757d);
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
}

.tabs-nav button:hover {
    color: var(--color-accent, #007bff);
}

.tabs-nav button.active {
    color: var(--color-accent, #007bff);
    border-bottom: 3px solid var(--color-accent, #007bff);
    font-weight: bold;
}

.tab-content {
    padding: 20px 0;
}

.section-title {
    border-left: 4px solid var(--color-accent, #007bff);
    padding-left: 10px;
    margin-bottom: 20px;
    color: var(--color-text-primary, #343a40);
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px;
    background-color: var(--color-background-secondary, #f8f9fa);
    border-radius: 5px;
}

.form-control {
    padding: 8px;
    border: 1px solid var(--color-border, #ced4da);
    border-radius: 4px;
    width: 250px;
    background-color: var(--color-card-bg, #fff);
    color: var(--color-text-primary, #343a40);
}

.btn-primary, .btn-secondary, .btn-danger {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.btn-primary { background-color: var(--color-accent, #007bff); color: white; }
.btn-secondary { background-color: #6c757d; color: white; }
.btn-danger { background-color: #dc3545; color: white; }
.btn-primary:hover { background-color: var(--color-accent-dark, #0056b3); }
.btn-danger:hover { background-color: #c82333; }
</style>

<style>
:root {
    --color-background: #f4f7f9;
    --color-background-secondary: #f8f9fa;
    --color-card-bg: #ffffff;
    --color-text-primary: #343a40;
    --color-border: rgb(213,210,210);
    --color-accent: #007bff;
    --color-accent-dark: #0056b3;
}

.dark-bg {
    background-color: #1a1a1a !important;
}

.dark-mode {
    --color-background: #2b2b2b;
    --color-background-secondary: #3c3c3c;
    --color-card-bg: #343434;
    --color-text-primary: #f0f0f0;
    --color-border: #ffffff;
    --color-accent: #81c784;
    --color-accent-dark: #66bb6a;
}

body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    transition: background-color 0.3s, color 0.3s;
}

#app-container {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    min-height: 100vh;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';

const currentUserId = ref('MarioRossi_ID123');

const user = ref({
    name: 'Mario',
    surname: 'Rossi',
    role: 'Manutentore',
    email: 'mario.rossi@azienda.it',
    theme: localStorage.getItem(`hmi-theme-${currentUserId.value}`) || 'light',
});

const activeTab = ref('info');

const applyTheme = (theme) => {
    const container = document.getElementById('app-container');

    if (container) {
        container.classList.toggle('dark-mode', theme === 'dark');
        document.body.classList.toggle('dark-bg', theme === 'dark');
    }
};

onMounted(() => {
    applyTheme(user.value.theme);
});


const handleLogout = () => {
    console.log('Utente disconnesso.');
    alert('Logout effettuato. Reindirizzamento al login.');
};

const savePreferences = () => {
    applyTheme(user.value.theme);

    localStorage.setItem(`hmi-theme-${currentUserId.value}`, user.value.theme);

    console.log('Preferenze salvate:', user.value);
    alert('Preferenze HMI salvate con successo!');
};
</script>

<template>
  <div class="profile-container">
    <div class="header">
      <h2><i class="fas fa-user-circle"></i> Gestione Profilo</h2>
      <p class="role-badge" :class="user.role.toLowerCase()">Ruolo: {{ user.role }}</p>
    </div>

    <div class="tabs-nav">
      <button :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">
        <i class="fas fa-id-badge"></i> Dettagli
      </button>
      <button :class="{ active: activeTab === 'settings' }" @click="activeTab = 'settings'">
        <i class="fas fa-cogs"></i> Impostazioni HMI
      </button>
      <button :class="{ active: activeTab === 'security' }" @click="activeTab = 'security'">
        <i class="fas fa-lock"></i> Sicurezza
      </button>
    </div>

    <div v-if="activeTab === 'info'" class="tab-content">
      <h3 class="section-title">Informazioni Personali</h3>
      <div class="info-group">
        <label>Nome Completo:</label> <span>{{ user.name }} {{ user.surname }}</span>
      </div>
      <div class="info-group">
        <label>Email:</label> <span>{{ user.email }}</span>
      </div>
      <div class="info-group">
        <label>Livello Accesso:</label> <span class="fw-bold">{{ user.role }}</span>
      </div>
    </div>

    <div v-else-if="activeTab === 'settings'" class="tab-content">
      <h3 class="section-title">Personalizzazione Interfaccia</h3>

      <div class="setting-item">
        <label for="theme">Tema Grafico:</label>
        <select id="theme" v-model="user.theme" class="form-control">
          <option value="light">Chiaro</option>
          <option value="dark">Scuro (Ideale per notturna)</option>
        </select>
      </div>

      <button @click="savePreferences" class="btn-primary mt-4">Salva Preferenze</button>
    </div>

    <div v-else-if="activeTab === 'security'" class="tab-content">
      <h3 class="section-title">Modifica Credenziali</h3>

      <div class="password-form-box">
        <p class="text-muted">Il cambio password richiede una re-autenticazione.</p>
        <input type="password" placeholder="Nuova Password" class="form-control mb-3">
        <button class="btn-secondary">Aggiorna Password</button>
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

.role-badge {
    padding: 5px 12px;
    border-radius: 5px;
    font-weight: bold;
    color: white;
    font-size: 0.9em;
}
.manutentore { background-color: #007bff; }
.operatore { background-color: #28a745; }
.amministratore { background-color: #dc3545; }


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

.info-group {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px dashed var(--color-border, #eee);
}

.info-group label {
    font-weight: 600;
    width: 200px;
    color: var(--color-text-primary, #495057);
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
/* Stili GLOBALI PER IL TEMA (Da inserire globalmente nell'app) */
:root {
    --color-background: #f4f7f9;
    --color-background-secondary: #f8f9fa;
    --color-card-bg: #ffffff;
    --color-text-primary: #343a40;
    --color-border: #e0e0e0;
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
    --color-border: #555555;
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
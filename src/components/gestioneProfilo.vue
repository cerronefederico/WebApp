<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// 1. Definisce la chiave univoca per localStorage
// Prende l'email direttamente dallo store. Se lo store è null, usa una stringa vuota o un fallback.
const userIdKey = computed(() => authStore.currentUser || '');

const ruolo = computed(() => {
    const userIdentifier = authStore.currentUser;

    // Verifica se l'identificativo utente (l'email in questo caso) è esattamente 'admin' (case-insensitive)
    if (userIdentifier && userIdentifier.toLowerCase() === 'admin@ing.com') {
        return 'Amministratore'; // Ruolo 'Amministratore'
    } else {
        return 'Manutentore'; // Ruolo di default
    }
});

// 2. Mantiene la logica del tema (theme) localmente
// Il tema viene inizializzato con la preferenza salvata in localStorage, usando l'email come chiave.
const theme = ref(
    localStorage.getItem(`hmi-theme-${userIdKey.value}`) || 'light'
);

// 3. Rimosse le variabili 'currentUserId' e 'user' fittizie.
//    L'unico dato utente utilizzato è 'authStore.currentUser' per l'email e la chiave del tema.

const activeTab = ref('info');

const applyTheme = (currentTheme) => {
    const container = document.getElementById('app-container');

    if (container) {
        container.classList.toggle('dark-mode', currentTheme === 'dark');
        document.body.classList.toggle('dark-bg', currentTheme === 'dark');
    }
};

const utenti = ref([]);

onMounted(async () => {
  // Applica il tema salvato al mount
  applyTheme(theme.value);
  // Carica la lista degli utenti
  await fetchUtenti();
});

const fetchUtenti = async () => {
  const data = await listUtenti();
  if (data) {
    utenti.value = data;
  }
}


const handleLogout = () => {
    authStore.logout();
    alert('Logout effettuato. Reindirizzamento al login.');
    router.push('/');
};

const savePreferences = () => {
    applyTheme(theme.value);

    // Salva il tema usando l'ID utente/email Pinia come chiave
    localStorage.setItem(`hmi-theme-${userIdKey.value}`, theme.value);

    console.log('Preferenze salvate:', theme.value);
    alert('Preferenze HMI salvate con successo!');
};

const listUtenti = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/listaUtenti', {
          method: 'GET',
    });

    // Gestione della risposta:
    if (!response.ok) {
        throw new Error(`Errore HTTP! Stato: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Errore durante il recupero della lista utenti:', error);
    // Gestione dell'errore (e.g., mostrare un messaggio all'utente)
  }
};
const newEmail = ref('');
const newPassword = ref('');
let adding = ref(false);
let deleting = ref(false);

async function addUtente() {
    // 1. Validazione base
    if (!newEmail.value.trim() || !newPassword.value.trim()) {
        alert('Per favore, inserisci sia l\'email che la password.');
        return;
    }

    const emailToSend = `${newEmail.value}@ing.com`; // Ricostruisce l'email completa

    try {
      adding.value=true;
      const response = await fetch('http://localhost:8000/api/register', { // Endpoint FastAPI per la registrazione
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // N.B. In un'applicazione reale, dovresti inviare qui il token di accesso
                // dell'amministratore per autorizzare questa operazione!
            },
            body: JSON.stringify({
                email: emailToSend,
                password: newPassword.value,
                // Aggiungere qui eventuali altri campi come 'ruolo' se necessario
            }),
      });

        // 2. Gestione della risposta
        if (response.ok) {

            // Aggiorna la lista degli utenti
            await fetchUtenti();
            adding.value= false;

            alert(`Utente ${emailToSend} aggiunto con successo!`);
            // Resetta i campi input
            newEmail.value = '';
            newPassword.value = '';


        } else {
            // Estrai l'errore dal corpo della risposta se possibile
            const errorData = await response.json();
            alert(`Errore nell'aggiunta utente: ${errorData.detail || response.statusText}`);
            adding.value = false;
        }

    } catch (error) {
        adding = false;
        alert('Si è verificato un errore di connessione con il server.');
    }
}

async function deleteUtente(email) {
  try {
     const response = await fetch('http://localhost:8000/api/delete', { // Endpoint FastAPI per la registrazione
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // N.B. In un'applicazione reale, dovresti inviare qui il token di accesso
                // dell'amministratore per autorizzare questa operazione!
            },
            body: JSON.stringify({
                email: email,
                password: '',
            }),
        });
     if (response.ok) {
       await fetchUtenti();
       alert(`Utente ${email} deleted`);
     }
  }catch(error) {
    alert('Si è verificato un errore di connessione con il server.');
  }
}
</script>

<template>
  <div class="profile-container">
    <div class="header">
      <h2><i class="fas fa-user-circle"></i> Gestione Profilo</h2>
      <p class="role-badge" :class="{'bg-success': ruolo === 'Amministratore'}">Ruolo: {{ruolo}}</p>
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
      <button v-if="ruolo==='Amministratore'" :class="{ active: activeTab === 'admin' }" @click="activeTab = 'admin'">
        <i class="fas fa-lock"></i> Admin
      </button>
    </div>

    <div v-if="activeTab === 'info'" class="tab-content">
      <h3 class="section-title">Informazioni Personali</h3>
      <div class="info-group">
        <label>Email:</label> <span>{{ authStore.currentUser }}</span>
      </div>
      <div class="info-group">
        <label>Livello Accesso:</label>
        <div class="text text-primary" :class="{'text text-success': ruolo === 'Amministratore'}">{{ruolo}}</div>
        <span class="fw-bold" ></span>
      </div>
    </div>

    <div v-else-if="activeTab === 'settings'" class="tab-content">
      <h3 class="section-title">Personalizzazione Interfaccia</h3>

      <div class="setting-item">
        <label for="theme">Tema Grafico:</label>
        <select id="theme" v-model="theme" class="form-control">
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

    <div v-else-if="activeTab === 'admin'" class="tab-content">
      <h3 class="section-title">Lista utenti</h3>
      <div class="card">
        <div class="card-body">
          <div class="container-fluid overflow-auto" style="max-height: 500px;">
          <ul class="list-group">
            <li v-for="utente in utenti" class="list-group-item">
              <div class="d-flex mb-3">
              <div class="me-auto p-2">{{utente["email"]}}</div>
              <div class="p-2"><button v-on:click="deleteUtente(utente['email'])" v-if="utente['email'] !== 'admin@ing.com'" class="bi bi-slash-circle bg-white"></button></div>
            </div>
            </li>
          </ul>
          </div>
        </div>
      </div>
      <button class="btn btn-primary mt-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">Aggiungi utente</button>

    </div>



  </div>

<div class="offcanvas offcanvas-bottom" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasBottomLabel">Inserisci credenziali</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>

  <div class="offcanvas-body">
    <div class="d-flex justify-content-around">
      <div>
        <label for="inputEmail" class="form-label visually-hidden">Email</label>

        <div class="input-group">
          <input type="text" class="form-control" id="inputEmail" v-model="newEmail" placeholder="nomeutente">

          <span class="input-group-text">@ing.com</span>
        </div>
      </div>
      <div>
        <label for="inputPassword" class="form-label visually-hidden">Password</label>
        <input type="text" class="form-control" id="inputPassword" v-model="newPassword" placeholder="Password">
      </div>
      <div>
        <button v-on:click="addUtente" type="button" class="btn btn-primary">
          Conferma
          <span v-if="adding" class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
          <span class="visually-hidden" role="status">Loading...</span>
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
/* Stili invariati, ma ho rimosso le classi non più usate per i ruoli */
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
    background-color: #007bff;
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
/* Stili GLOBALI PER IL TEMA (Lasciati invariati) */
:root {
    --color-background: #f4f7f9;
    --color-background-secondary: #f8f9fa;
    --color-card-bg: #ffffff;
    --color-text-primary: #343a40;
    --color-border: rgb(213, 210, 210);
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
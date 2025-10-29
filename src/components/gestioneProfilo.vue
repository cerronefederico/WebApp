<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// Rimosso: logica di 'theme' e 'toastPlacement'

const ruolo = computed(() => {
    const userIdentifier = authStore.currentUser.email;

    if (userIdentifier && userIdentifier.toLowerCase() === 'admin@ing.com') {
        return 'Amministratore';
    } else {
        return 'Manutentore';
    }
});

const activeTab = ref('info');

// Rimosso: funzione 'applyTheme' e 'savePreferences'
const applyTheme = (currentTheme) => {
    const container = document.getElementById('app-container');

    if (container) {
        container.classList.toggle('dark-mode', currentTheme === 'dark');
        document.body.classList.toggle('dark-bg', currentTheme === 'dark');
    }
};

const utenti = ref([]);

onMounted(async () => {
  // Ho lasciato applyTheme, ma dovrai gestirlo globalmente o tramite lo store se non usi più 'theme' qui.
  // Per ora, lo lascio vuoto.
  await fetchUtenti();
});

const fetchUtenti = async () => {
  const data = await listUtenti();
  if (data) {
    utenti.value = data;
  }
}

// Rimosso: handleLogout, reimpostaPassword (spostati in Impostazioni.vue)
const handleLogout = () => {
    authStore.logout();
    alert('Logout effettuato. Reindirizzamento al login.');
    router.push('/');
};

const listUtenti = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/listaUtenti', {
          method: 'GET',
    });

    if (!response.ok) {
        throw new Error(`Errore HTTP! Stato: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Errore durante il recupero della lista utenti:', error);
  }
};
const newEmail = ref('');
const newPassword = ref('');
let adding = ref(false);
let deleting = ref('');

async function addUtente() {
    if (!newEmail.value.trim() || !newPassword.value.trim()) {
        alert('Per favor, inserisci sia l\'email che la password.');
        return;
    }

    const emailToSend = `${newEmail.value}@ing.com`;

    try {
      adding.value=true;
      const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: emailToSend,
                password: newPassword.value,
            }),
      });

        if (response.ok) {

            await fetchUtenti();
            adding.value= false;

            alert(`Utente ${emailToSend} aggiunto con successo!`);
            newEmail.value = '';
            newPassword.value = '';

        } else {
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
    deleting.value = email;
     const response = await fetch('http://localhost:8000/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: '',
            }),
        });
     if (response.ok) {
       await fetchUtenti();
       deleting.value = '';
       alert(`Utente ${email} deleted`);
     }
  }catch(error) {
    deleting.value='';
    alert('Si è verificato un errore di connessione con il server.');
  }
}

const flagPassword = ref(false);

function mostraPassword() {
  flagPassword.value = !flagPassword.value;
}

// Rimosso: flagPassword1, mostraPassword1, resetPassword, flagResetPassword (spostati in Impostazioni.vue)
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
      <button v-if="ruolo==='Amministratore'" :class="{ active: activeTab === 'admin' }" @click="activeTab = 'admin'">
        <i class="fas fa-user-shield"></i> Admin
      </button>
    </div>

    <div v-if="activeTab === 'info'" class="tab-content">
      <h3 class="section-title">Informazioni Personali</h3>
      <div class="info-group">
        <label>Email:</label> <span>{{ authStore.currentUser.email }}</span>
      </div>
      <div class="info-group align-items-center">
        <label>Password:</label>
      <div class="form-control d-flex">

        <span v-if="!flagPassword" class="text-secondary">
            <span v-for="i in authStore.currentUser.password.length" :key="i">*</span>
        </span>
        <span v-if="flagPassword">{{ authStore.currentUser.password }}</span>

        <div class="ms-auto">
            <button v-if="flagPassword" @click="mostraPassword" class="btn p-0 bi bi-eye" type="button"></button>

            <button v-if="!flagPassword" @click="mostraPassword" class="btn p-0 bi bi-eye-slash" type="button"></button>
        </div>
    </div>
      </div>
      <div class="info-group">
        <label>Livello Accesso:</label>
        <div class="text text-primary" :class="{'text text-success': ruolo === 'Amministratore'}">{{ruolo}}</div>
        <span class="fw-bold" ></span>
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
              <div class="d-flex align-items-center">
              <div class="me-auto ">{{utente["email"]}}</div>
            <div class="d-flex align-items-center"> <div v-if="deleting === utente['email']" class="spinner-border" role="status">
                 <span class="visually-hidden">Loading...</span>
                  </div>
                  <button v-on:click="deleteUtente(utente['email'])" v-if="utente['email'] !== 'admin@ing.com'" class="bi bi-slash-circle bg-white ms-1"></button>
          </div>
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
/* (Gli stili rimangono invariati per coerenza, anche se i selettori non coprono più 'settings'/'security') */
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
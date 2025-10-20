<template>
  <div class="d-flex justify-content-center align-items-start h-100 w-100 pt-5">

    <div class="d-flex flex-column align-items-center" style="max-width: 400px; width: 100%">

      <div class="text-center mb-5" style="margin-bottom: 30px">
        <img src="/img/logoLogin.png" alt="Logo Applicazione" class="logo-login">
      </div>

      <div
        class="card p-4 shadow-lg"
        style="max-width: 400px; width: 100%; border:none;"
        ref="loginCard"
      >
        <h2 class="card-title text-center mb-4">Accedi</h2>
        <form @submit.prevent="handleLogin">

          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              :class="{'is-invalid' : showError}"
              id="email"
              v-model="email"
              required
              placeholder="esempio@ing.com"
              :disabled="isLoggingIn" />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              :class="{'is-invalid' : showError}"
              id="password"
              v-model="password"
              required
              placeholder="Inserisci la password"
              :disabled="isLoggingIn" />
          </div>
           <div v-if="showError" class="invalid-feedback d-block mb-3 animate__animated animate__fadeIn">
              Credenziali non valide. Riprova.
          </div>

          <div class="d-grid gap-2">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoggingIn"
            >
              <span v-if="isLoggingIn" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoggingIn ? 'Accesso in corso...' : 'Accedi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'; // Aggiungiamo useRouter per l'accesso reattivo al router

export default {
  name: 'LoginComponent',
  setup() {
    // Ottiene un riferimento allo store di autenticazione
    const authStore = useAuthStore();
    // Ottiene il router
    const router = useRouter();

    // Non restituiamo più authStore nel setup, lo usiamo direttamente
    // nel contesto setup per accedere alle actions, ma lo lasciamo per chiarezza
    return { authStore, router };
  },
  data() {
    return {
      email: '',
      password: '',
      showError: false,
      isLoggingIn: false,
      loginUrl: 'http://localhost:8000/api/login'
    };
  },
  methods: {
    // Funzione per eseguire l'animazione di scuotimento
    triggerShakeAnimation() {
      const card = this.$refs.loginCard;
      if (card) {
        card.classList.add('animate__animated', 'animate__shakeX', 'animate__faster');
        setTimeout(() => {
          card.classList.remove('animate__animated', 'animate__shakeX', 'animate__faster');
        }, 800);
      }
    },

    // ⭐ FUNZIONE CRITICAMENTE AGGIORNATA
    async handleLogin() {
      this.showError = false;
      this.isLoggingIn = true;

      const credentials = {
        email: this.email,
        password: this.password
      };

      try {
        const response = await fetch(this.loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        });

        if (response.ok) {
          // 1. LOGIN RIUSCITO (Stato HTTP 200-299)
          const data = await response.json();

          const accessToken = data.access_token;
          const userEmail = data.user_email; // ⭐ NUOVO: Estrai l'email

          if (accessToken && userEmail) {
            // ⭐ PUNTO CHIAVE: Chiama setToken con DUE argomenti
            this.authStore.setToken(accessToken, userEmail);

            // Usiamo il router da setup per una migliore pratica in Vue 3
            this.router.push('/home');
          } else {
             // Il server non ha restituito i dati attesi (token o email)
             console.error("Dati di login incompleti ricevuti dal server.");
             throw new Error("Dati di login incompleti.");
          }

        } else if (response.status === 401 || response.status === 403) {
          // 2. CREDENZIALI NON VALIDE (401 Unauthorized)
          this.showError = true;
          this.triggerShakeAnimation();

        } else {
          // 3. ALTRO ERRORE (es. 500 Internal Server Error)
          console.error(`Errore durante il login: Stato ${response.status}`);
          this.showError = true;
          this.triggerShakeAnimation();
        }

      } catch (error) {
        // 4. ERRORE DI RETE
        console.error('Errore durante il tentativo di login:', error);
        this.showError = true;

      } finally {
        this.isLoggingIn = false;
      }
    }
  }
};
</script>
<style scoped>
.shadow-lg {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
.logo-login {
  max-width: 350px;
  height: auto;
}

.animate__faster {
  --animate-duration: 0.8s;
}
</style>
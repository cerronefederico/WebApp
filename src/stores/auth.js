import { defineStore } from 'pinia';

// Chiavi per il Local Storage
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

// Helper per recuperare i dati utente persistenti
function getInitialUser() {
  try {
    const userString = localStorage.getItem(AUTH_USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    // In caso di errore nel parsing, pulisce la chiave e ritorna null
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Stato iniziale: tenta di recuperare il token
    token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
    // Recupera l'utente se i dati sono stati salvati in precedenza
    user: getInitialUser(),
  }),
  actions: {
    /**
     * Imposta il token di accesso E l'email dell'utente, ricevuti dal server.
     * @param {string} authToken - Il token JWT.
     * @param {string} user - L'email dell'utente (proveniente dalla risposta del server).
     */
    setToken(authToken, user) {
      this.token = authToken;
      this.user =  user; // Popola lo stato 'user' con l'email

      // Salva entrambi i dati in Local Storage per la persistenza
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(this.user));
    },

    // Metodo per il logout
    logout() {
      this.user = null;
      this.token = null;

      // Rimuove entrambe le chiavi dal Local Storage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);

      // Nota: la navigazione dovrebbe avvenire nel componente o nel router guard
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token, // True se c'è un token
    currentUser: (state) => state.user, // Contiene { email: '...' } o null
    authToken: (state) => state.token,
  }
});
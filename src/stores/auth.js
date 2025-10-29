import { defineStore } from 'pinia';

// Chiavi per il Local Storage
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';
const TOAST_PLACEMENT_KEY_BASE = 'hmi-toast-placement-'; // Chiave base per le preferenze
const DEFAULT_PLACEMENT = 'bottom-0 end-0';

// Helper per recuperare i dati utente persistenti
function getInitialUser() {
  try {
    const userString = localStorage.getItem(AUTH_USER_KEY);
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

// Helper per ottenere la chiave univoca del Local Storage per le preferenze
function getUserIdPlacementKey(user) {
    return user?.email ? TOAST_PLACEMENT_KEY_BASE + user.email : null;
}

// Helper per recuperare la posizione del toast
function getInitialPlacement(user) {
    const key = getUserIdPlacementKey(user);
    if (key) {
        const saved = localStorage.getItem(key);
        // Ritorna il valore salvato, o il default se non esiste, o la stringa vuota se salvata (per nascondere)
        return saved === null ? DEFAULT_PLACEMENT : saved;
    }
    return DEFAULT_PLACEMENT;
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    const user = getInitialUser();
    return {
      token: localStorage.getItem(AUTH_TOKEN_KEY) || null,
      user: user,
      // 🚀 Nuovo: Aggiunto lo stato reattivo per la posizione del toast
      toastPlacement: getInitialPlacement(user),
    }
  },
  actions: {
    setToken(authToken, user) {
      this.token = authToken;
      this.user =  user;

      // Salva entrambi i dati in Local Storage per la persistenza
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(this.user));

      // 🚀 Nuovo: Inizializza o ripristina la preferenza toast dopo il login
      this.toastPlacement = getInitialPlacement(this.user);
    },

    logout() {
      this.user = null;
      this.token = null;
      this.toastPlacement = DEFAULT_PLACEMENT; // Resetta lo stato del toast

      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    },

    /**
     * 🚀 Nuovo: Azione per cambiare e salvare la posizione del toast
     * @param {string} newPlacement - La nuova classe di posizionamento del toast.
     */
    setToastPlacement(newPlacement) {
        this.toastPlacement = newPlacement;

        const userIdKey = getUserIdPlacementKey(this.user);
        if (userIdKey) {
            // Salva su Local Storage per la persistenza
            localStorage.setItem(userIdKey, newPlacement);
        }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    authToken: (state) => state.token,
    // 🚀 Nuovo: Getter per accedere alla posizione del toast
    getToastPlacement: (state) => state.toastPlacement,
  }
});
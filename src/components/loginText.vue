<template>
  <div class="d-flex justify-content-center align-items-start h-100 w-100 pt-5">

    <div class="d-flex flex-column align-items-center" style="max-width: 400px; width: 100%">

      <div class="text-center mb-5" style="margin-bottom: 30px">
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
            />
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
            />
          </div>
           <div v-if="showError" class="invalid-feedback d-block mb-3 animate__animated animate__fadeIn">
              Credenziali non valide. Riprova.
          </div>
          <div class="d-grid gap-2">
            <button type="submit" class="btn btn-primary">Accedi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginComponent',
  data() {
    return {
      email: '',
      password: '',
      showError: false
    };
  },
  methods: {
    // Funzione per eseguire l'animazione di scuotimento
    triggerShakeAnimation() {
      const card = this.$refs.loginCard;
      if (card) {
        // Aggiunge le classi di Animate.css per lo shake
        card.classList.add('animate__animated', 'animate__shakeX', 'animate__faster');

        // Rimuove le classi dopo l'esecuzione dell'animazione (ca. 0.8s)
        setTimeout(() => {
          card.classList.remove('animate__animated', 'animate__shakeX', 'animate__faster');
        }, 800);
      }
    },

    handleLogin() {
      this.showError = false;
      const isEmailInvalid = this.email !== 'a@a';
      const isPasswordInvalid = this.password !== 'a';
      if (isEmailInvalid || isPasswordInvalid) {

        this.showError = true
        this.triggerShakeAnimation();
      } else {

        this.$router.push('/home');
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
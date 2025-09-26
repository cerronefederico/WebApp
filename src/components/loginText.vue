<template>
  <div class="d-flex justify-content-center align-items-center h-100 w-100">
    <div class="card p-4 shadow-lg" style="max-width: 400px; width: 100%; border:none;">
      <h1 class="text-center mb-4" style="max-width: 400px; width: 100%;border:none;">
        **PLC Monitor**
      </h1>

      <h2 class="card-title text-center mb-4">Accedi</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control" :class="{'is-invalid' :emailValid}"
            id="email"
            v-model="email"
            required
            placeholder="esempio@ing.com"
          />
        </div>
        <div v-if="!emailValid" class="invalid-feedback">email non valida</div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control" :class="{'is-invalid' :passwordValid}"
            id="password"
            v-model="password"
            required
            placeholder="Inserisci la password"
          />
          <div v-if="!passwordValid" class="invalid-feedback">passwords do not match</div>
        </div>
        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary">Accedi</button>
        </div>
      </form>
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
      emailValid: false,
      passwordValid: false
    };
  },
  methods: {
    handleLogin() {
      this.emailValid = false;
      this.passwordValid = false;
      if(this.email!=='a@a'){
        this.emailValid = true;
      }
      if(this.password!=='a'){
        this.passwordValid = true;
      }
      if(this.email==='a@a' && this.password==='a'){
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
</style>
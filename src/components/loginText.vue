<template>
  <div style="position: absolute; top:220px; right: 100px;">
    <div class="card text-bg-dark p-4 shadow-sm">
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
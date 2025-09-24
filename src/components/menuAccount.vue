<template>
<div class="position-fixed top-0 end-0 m-3">
    <div class="dropdown">
        <button class="btn btn-outline-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Benvenuto Giovanni <i class="bi bi-person-circle"></i>
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Profilo</a></li>
            <li><a class="dropdown-item" href="#">Impostazioni</a></li>
            <li><hr class="dropdown-divider"></li>
            <li v-on:click="disconnessione"><a class="dropdown-item logout-button" href="#">Disconnetti</a></li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
  methods: {
    disconnessione(){
      this.$router.push('/');
    }
  }
}
</script>
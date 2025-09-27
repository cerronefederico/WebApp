<template>
<ul class="list-group">
  <li class="list-group-item">
    contatore pezzi totale {{item.contatore}}
  </li>
  <li class="list-group-item">A second item</li>
  <li class="list-group-item">A third item</li>
  <li class="list-group-item">A fourth item</li>
  <li class="list-group-item">And a fifth one</li>
</ul>
</template>
<script>
import axios from "axios";

export default {
  name: 'StatistichePlc',
  data() {
    return {
      items: []
    };
  },
  mounted() {
    this.getItems();
  },
  methods: {
    async getItems() {
      try {
        const response = await axios.get('http://localhost:5000/plc1/getContatori');
        this.items = response.data;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style scoped>

</style>
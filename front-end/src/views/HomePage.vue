<template>
  <div class="home">
    <h1>Bienvenue sur la page d'accueil</h1>
    <p>Ceci est votre point de départ après la connexion ou l'inscription.</p>
    <button @click="incrementAndLog">Ajoute +1</button>
    <button v-if="count > 5" @click="decrement">Enlève 1</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'HomePage',
  setup() {
    const count = ref(0);

    function incrementAndLog() {
      count.value++;
      console.log(count.value);
    }

    function decrement() {
      if (count.value > 0) {
        count.value--;
        console.log(count.value);
      }
    }

    return {
      count,
      incrementAndLog,
      decrement,
    };
  },
};
</script>

<style scoped>
/* Styles spécifiques à Home */
</style>

<template>
    <div class="login">
      <h2>Connexion</h2>
      <form @submit.prevent="login">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginPage',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      login() {
        // Logique de connexion
        alert('Tentative de connexion');
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles spécifiques à Login */
  </style>
  
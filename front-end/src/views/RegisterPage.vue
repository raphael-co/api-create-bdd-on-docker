<template>
  <div class="register-container">


    <RegisterForm />


    <cardRegister />
  </div>
</template>
  
<script>
import RegisterForm from '../components/form/RegisterForm.vue'; // Assurez-vous que le chemin d'importation est correct
import cardRegister from '../components/card/cardRegister.vue'; // Assurez-vous que le chemin d'importation est correct
export default {
  name: 'RegisterPage',
  components: {
    RegisterForm,
    cardRegister
  },
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      Test: ''
    };
  },
  methods: {
    register() {
      // Logique d'inscription
      alert('Tentative d\'inscription');
    },
  },
};
</script>
  
<style scoped>
/* Styles spécifiques à Register */
.register-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  min-height: 100vh;
}

@media (max-width: 900px) {
  .register-container {
    flex-direction: column;
    gap: 20px;
    padding: 20px 0px;
    /* min-height: 100vh; */
    /* Change la direction de row à column pour les petits écrans */
  }
}

.register,
.registerInfo {
  background-color: white;
  height: 400px;
  width: 400px;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed;
  border-color: black;
}
</style>
  
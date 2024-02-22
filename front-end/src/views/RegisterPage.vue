<template>
  <AnimatedBackground>
    <div class="register-container">
      <div class="form-container">
        <RegisterForm />
        <cardRegister />
      </div>
    </div>
  </AnimatedBackground>
</template>
  
<script>
import RegisterForm from '../components/form/RegisterForm.vue';
import cardRegister from '../components/card/cardRegister.vue';
import AnimatedBackground from "../components/AnimatedBackground/AnimatedBackground.vue";
export default {
  name: 'RegisterPage',
  components: {
    RegisterForm,
    cardRegister,
    AnimatedBackground
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



.form-container {

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

@media (max-width: 900px) {
  .form-container {
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
  
<template>
  <!-- <AnimatedBackground> -->
    <!-- <ToggleSwitchTheme /> -->
    <div class="register-container">
      <div class="form-container">
        <RegisterForm />
        <cardRegister />
      </div>
    </div>
  <!-- </AnimatedBackground> -->
</template>
  
<script>
import RegisterForm from '../components/form/RegisterForm.vue';
import cardRegister from '../components/card/cardRegister.vue';
// import AnimatedBackground from "../components/AnimatedBackground/AnimatedBackground.vue";
export default {
  name: 'RegisterPage',
  components: {
    RegisterForm,
    cardRegister
    // AnimatedBackground
  }
};
</script>
  
<style scoped>

</style>
  
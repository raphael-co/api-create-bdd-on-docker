<template>
  <AnimatedBackground v-if="true">
    <div class="login-page">
      <div class="form-container">
        <LoginForm />
      </div>

    </div>
  </AnimatedBackground>
</template>

<script>
import LoginForm from '../components/form/LoginForm.vue';
import AnimatedBackground from "../components/AnimatedBackground/AnimatedBackground.vue";

export default {
  name: 'LoginPage',
  components: {
    AnimatedBackground,
    LoginForm
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>

<template>
  <div class="login-container">
    <h2 class="cardTitle">Working Sign In</h2>
    <form @submit.prevent="register">
      <InputComponent label="Email" v-model="credentials.mail" placeholder="Entrez du texte" />

      <InputComponent label="Password" v-model="credentials.password" placeholder="Entrez du password" />

      <InputComponent label="Confirm the password" v-model="credentials.confirmPassword"
        placeholder="Entrez du confirmPassword" />

        <InputComponent label="token admin" v-model="credentials.tokenAdmin"
        placeholder="Entrez le tokenAdmin" />
 
      <button class="btnRegister" type="submit">Register</button>
      <p>You have an account? <a class="goRegister" href="/login">Sign Up</a></p>
    </form>
  </div>
</template>

<script>
import InputComponent from '../input/textInput.vue';
import { userService } from '../../request/userService';
import { useRouter } from 'vue-router';

export default {
  components: {
    InputComponent
  },
  data() {
    const router = useRouter();
    return {
      credentials: {
        mail: '',
        password: '',
        confirmPassword: '',
        tokenAdmin: '',
      },
      router
    };
  },
  methods: {
    register() {
      userService.register(this.credentials, this.router)
        .then(data => {
          console.log('Login successful:', data);
          // Redirect or manage login state as needed
        })
        .catch(error => {
          console.error('Login failed:', error);
          // Handle error (e.g., show error message)
        });
    }
  }
};
</script>

<style scoped>

</style>

<template>
  <div class="login-container">
    <h2>Working Sign In</h2>
    <form @submit.prevent="register">
      <InputComponent label="Email" v-model="credentials.mail" placeholder="Entrez du texte" />

      <InputComponent label="Password" v-model="credentials.password" placeholder="Entrez du password" />

      <InputComponent label="Confirm the password" v-model="credentials.confirmPassword"
        placeholder="Entrez du confirmPassword" />
      <div class="checkbox-container">
        <input type="checkbox" id="remember-me">
        <label for="remember-me">Remember Me</label>
      </div>
      <button type="submit">Register</button>
      <p>You have an account? <a href="/login">Sign Up</a></p>
    </form>
  </div>
</template>

<script>
import InputComponent from '../input/textInput.vue';
import { userService } from '../../request/userService';

export default {
  components: {
    InputComponent
  },
  data() {
    return {
      credentials: {
        mail: '',
        password: '',
        confirmPassword: ''
      },
    };
  },
  methods: {
    register() {
      userService.register(this.credentials)
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
.login-container {
  width: 100%;
  max-width: 400px;
  height: 100%;
  max-height: 410px;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  text-align: center;
}

.input-container {
  margin-bottom: 1rem;
}

input[type=text],
input[type=password] {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #4169e1;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #324cb0;
}

a {
  color: #4169e1;
}
</style>

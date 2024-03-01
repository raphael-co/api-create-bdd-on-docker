<template>
    <div class="login-container">
        <h2>Working Sign In</h2>
        <form @submit.prevent="login">

            <InputComponent label="Email" v-model="credentials.mail" placeholder="Entrez du texte" />

            <InputComponent label="Password" v-model="credentials.password" placeholder="Entrez du password" />

            <!-- <div class="checkbox-container">
                <input type="checkbox" id="remember-me">
                <label for="remember-me">Remember Me</label>
            </div> -->
            <button class="buttonLogin" type="submit">Sign In</button>
            <p>Don't have an account? <a class="goRegister" href="/register">Register</a></p>
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
                password: ''
            },
        };
    },
    methods: {
        login() {
            console.log('Logging in with:', this.credentials);

            userService.login(this.credentials)
                .then(data => {
                    console.log('Login successful:', data);
                    this.$router.push({ name: 'HomePage' });
                })
                .catch(error => {
                    console.error('Login failed:', error);
                    // Handle error (e.g., show error message)
                });
        }
    }
};
</script>
  
<style scoped></style>
  
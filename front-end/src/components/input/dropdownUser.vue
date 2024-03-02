<template>
    <div class="user-menu">
        <div class="menu-button-container">
            <button class="menu-button" id="user-menu-button" @click="toggleMenu" ref="button">
                <span class="visually-hidden">Open user menu</span>
                <img class="user-avatar" src="../../assets/avatar.png" alt="">
            </button>
        </div>

        <div class="dropdown-menu-user" aria-labelledby="user-menu-button" v-show="isMenuOpen" ref="menu">
            <!-- <a class="dropdown-item"><ToggleSwitchTheme /></a> -->
            <a @click="logoutBtn" class="dropdown-item logout">Sign out</a>
        </div>
    </div>
</template>


  
<script>
import { useRouter } from 'vue-router';
import { userService } from '../../request/userService';
// import ToggleSwitchTheme from '../toggle-switch/toggle-switch-theme.vue';

export default {
    name: "DropdownUser",
    components: {
        // ToggleSwitchTheme
    },
    data() {
        const router = useRouter();

        return {
            isMenuOpen: false,
            router
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        handleClickOutside(event) {
            // Assurez-vous que le menu et le bouton existent et sont cliquables
            const menu = this.$el.querySelector('.dropdown-menu-user');
            const button = this.$el.querySelector('.menu-button');

            if (menu && !menu.contains(event.target) && button && !button.contains(event.target)) {
                this.isMenuOpen = false;
            }
        },
        logoutBtn() {
            userService.logout(this.router);
        },
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
}
</script>


  
<style>

</style>
  
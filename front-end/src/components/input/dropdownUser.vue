<template>
    <div class="user-menu">
        <div class="menu-button-container">
            <button class="menu-button" id="user-menu-button" @click="toggleMenu" ref="button">
                <span class="visually-hidden">Open user menu</span>
                <img class="user-avatar" src="../../assets/avatar.png" alt="">
            </button>
        </div>

        <div class="dropdown-menu-user" aria-labelledby="user-menu-button" v-show="isMenuOpen" ref="menu">
            <a href="#" class="dropdown-item">Settings</a>
            <a @click="logoutBtn" class="dropdown-item logout">Sign out</a>
        </div>
    </div>
</template>


  
<script>
import { useRouter } from 'vue-router';
import { userService } from '../../request/userService';

export default {
    name: "DropdownUser",
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
.user-menu {
    position: relative;
    margin-left: 12px;
}

.logout{
    background-color: transparent;
    color: #ff5c88 !important;
    cursor: pointer;
}
.logout:hover{
    background-color: rgba(241, 163, 182, 0.464) !important;
}
.menu-button {
    display: flex;
    align-items: center;
    position: relative;
    max-width: max-content;
    padding: 0;
    background-color: transparent;
    /* gray-800 */
    border-radius: 9999px;
    /* rounded-full */
    color: white;
    font-size: 0.875rem;
    /* text-sm */
    border: none;
    cursor: pointer;
}

.menu-button:focus {
    outline: none;
    /* Simulate ring-offset-color and ring with box-shadow */
}


.user-avatar {
    height: 4rem;
    /* h-8 */
    width: 4rem;
    /* w-8 */
    border-radius: 9999px;
    background-color: transparent;
    /* rounded-full */
}

.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}

.dropdown-menu-user {
    /* Hide dropdown by default, show/hide with JS */
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 8px;
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 5px 5px 2px 0 rgba(0, 0, 0, 0.05);
    z-index: 10;
    width: 150px;
}

.dropdown-item {
    display: block;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    /* text-sm */
    color: #374151;
    /* text-gray-700 */
    text-decoration: none;
}

.dropdown-item:hover,
.dropdown-item:focus {
    background-color: #f3f4f6;
    /* bg-gray-100 */
}
</style>
  
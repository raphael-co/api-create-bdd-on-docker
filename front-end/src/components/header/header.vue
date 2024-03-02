<template>
    <div class="header">
        <div @click="goHomme" class="logo"><img src="../../assets/logoDocker.png" alt="logo" /></div>
        <!-- <button @click="logoutBtn" class="logout-btn">Déconnecter</button> -->
        <DropdownUser />
    </div>
</template>
<script>
import { userService } from '../../request/userService';
import { useRouter } from 'vue-router';
import DropdownUser from '../input/dropdownUser.vue';

export default {
    name
        : 'HeaderComp',
    components: {
        DropdownUser
    },
    setup() {
        const router = useRouter();

        function goHomme() {
            router.push({ name: 'HomePage' });
        }
        function logoutBtn() {
            userService.logout(router)
        }
        return {
            logoutBtn,
            goHomme
        };
    },
};
</script>
  
<style scoped>
/* Styles pour l'en-tête */

</style>

  
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
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0 0 0;
    /* Ajustez selon vos besoins */
}


.logo {
    width: 150px;
    cursor: pointer;
}

.logo img {
    width: 100%;
}

.logout-btn {
    padding: 10px 20px;
    /* Ajustez selon vos besoins */
    cursor: pointer;
    background-color: #f44336;
    /* Couleur rouge pour le bouton de déconnexion */
    color: white;
    border: none;
    border-radius: 5px;
}

/* Responsive */
@media (max-width: 768px) {
    .home-page {
        padding: 0 50px;
        /* Ajustement du padding pour les écrans plus petits */
    }

    /* Ajoutez ici d'autres styles responsive si nécessaire */
}
</style>

  
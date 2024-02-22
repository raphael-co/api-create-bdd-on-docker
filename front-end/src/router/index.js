import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import { userService } from '@/request/userService';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
        meta: {
            requiresAuth: true,
            backgroundImage: `url(${require('@/assets/LoginBackground.svg')})`
        } // Utilisez require pour les assets
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
        meta: {
            requiresAuth: false,
            backgroundImage: `url(${require('@/assets/LoginBackground.svg')})`
        }
    },
    {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage,
        meta: {
            requiresAuth: false,
            backgroundImage: `url(${require('@/assets/LoginBackground.svg')})`
        }
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});

// Appliquez un arrière-plan pour chaque route en utilisant les métadonnées définies
router.beforeEach((to, from, next) => {

    const isAuthRequired = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = userService.getToken(); // Vérifie si l'utilisateur est connecté

    if (to.meta.backgroundImage) {
        // Appliquer l'image de fond
        console.log(to.meta.backgroundImage);
        // document.body.style.background = `${to.meta.backgroundColor}`;
        document.body.style.backgroundImage = to.meta.backgroundImage;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';
    } else {
        document.body.style.backgroundImage = ''; // Appliquer un arrière-plan par défaut ou le supprimer
    }

    if (isAuthenticated && (to.name === 'LoginPage' || to.name === 'RegisterPage')) {
        next({ name: 'HomePage' }); // Rediriger vers la page d'accueil
    } else if (isAuthRequired && !isAuthenticated) {
        next({ name: 'LoginPage' }); // Rediriger vers la page de connexion
    } else {
        next(); // Dans tous les autres cas, continuer normalement
    }
});

export default router;

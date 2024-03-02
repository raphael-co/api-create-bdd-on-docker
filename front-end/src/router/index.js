import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import { userService } from '@/request/userService';
import IdBddPage from '../views/IdBddPage.vue';
import CreateBddPage from '../views/CreateBddPage.vue';

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
        meta: {
            requiresAuth: true,
        } // Utilisez require pour les assets
    },
    {
        path: '/:idBdd',
        name: 'IdBddPage',
        component: IdBddPage,
        meta: {
            requiresAuth: true,
        } // Utilisez require pour les assets
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage,
        meta: {
            requiresAuth: false,
            // backgroundImage: `url(${require('@/assets/LoginBackground.svg')})`
        }
    },
    {
        path: '/register',
        name: 'RegisterPage',
        component: RegisterPage,
        meta: {
            requiresAuth: false,
            // backgroundImage: `url(${require('@/assets/LoginBackground.svg')})`
        }
    }, {
        path: '/create',
        name: 'CreateBddPage',
        component: CreateBddPage,
        meta: {
            requiresAuth: true,
            // backgroundImage: `url(${require('@/assets/LoginBackground.svg')})`
        }
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});


function updateDocumentHeight() {
    // Vous pourriez vouloir ajuster un élément spécifique ou une variable CSS ici
    // par exemple:
    setTimeout(() => {
        const totalHeight = `${document.documentElement.scrollHeight}px`;
        console.log(totalHeight);
        document.documentElement.style.setProperty('--total-height', totalHeight);
    }, 100);
}

// Appliquez un arrière-plan pour chaque route en utilisant les métadonnées définies
router.beforeEach((to, from, next) => {
    // const useDark = window.matchMedia("(prefers-color-scheme: dark)");
    const isAuthRequired = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = userService.getToken(); // Vérifie si l'utilisateur est connecté
    // console.log(useDark.matches);

    // let theme;

    // if (localStorage.getItem('theme') === 'dark') {
    //     document.body.style.backgroundColor = 'black';
    //     theme = 'dark';
    // } else if (localStorage.getItem('theme') === 'light') {
    //     document.body.style.backgroundColor = 'white';
    //     theme = 'light';

    // } else if (useDark.matches) {
    //     document.body.style.backgroundColor = 'black';
    //     localStorage.setItem('theme', 'dark');
    //     theme = 'dark';
    // }
    // else {
    //     document.body.style.backgroundColor = 'white';
    //     localStorage.setItem('theme', 'light');
    //     theme = 'light';
    // }


    // const themeStyleUrl = theme === 'dark' ? `http://localhost:8080//css/dark.css` : `http://localhost:8080/css/light.css`

    // let themeLink = document.getElementById('theme-style');

    // if (!themeLink) {
    //     themeLink = document.createElement('link');
    //     themeLink.id = 'theme-style';
    //     themeLink.rel = 'stylesheet';
    //     document.head.appendChild(themeLink);
    // }

    // themeLink.href = themeStyleUrl;

    if (to.meta.backgroundImage) {
        // Appliquer l'image de fond
        console.log(to.meta.backgroundImage);
        // document.body.style.background = `${to.meta.backgroundColor}`;
        document.body.style.backgroundImage = to.meta.backgroundImage;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center center';
    } else {
        // document.body.style.backgroundImage = ''; // Appliquer un arrière-plan par défaut ou le supprimer
    }

    if (isAuthenticated && (to.name === 'LoginPage' || to.name === 'RegisterPage')) {
        next({ name: 'HomePage' }); // Rediriger vers la page d'accueil
    } else if (isAuthRequired && !isAuthenticated) {
        next({ name: 'LoginPage' }); // Rediriger vers la page de connexion
    } else {
        next(); // Dans tous les autres cas, continuer normalement
    }
});

router.afterEach(() => {
    // Mise à jour de la hauteur après chaque changement de route
    updateDocumentHeight();
});

export default router;

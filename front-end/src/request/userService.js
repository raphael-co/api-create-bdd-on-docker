// userService.js
import axios from 'axios';

export function showLoader() {
    // Ajoute la classe 'show' à l'élément du loader
    document.getElementById('loader').classList.add('show');
}

export function hideLoader() {
    // Retire la classe 'show', ce qui cache le loader
    document.getElementById('loader').classList.remove('show');
}
export function showToast(message, type, duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.classList.add('toast', type);
    toast.textContent = message;

    container.appendChild(toast);

    // Afficher le toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100); // Un léger délai pour permettre la transition CSS

    // Masquer et supprimer le toast après 'duration' millisecondes
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('transitionend', () => {
            // Vérifiez si le parent existe avant de supprimer
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }, duration);
}
export const userService = {

    isAuthenticated() {
        return !!sessionStorage.getItem('authToken');
    },
    getToken() {
        return sessionStorage.getItem('authToken');
    },

    saveToken(token) {
        const bearer_token = `Bearer ${token}`
        sessionStorage.setItem('authToken', bearer_token);
    },

    removeToken() {
        sessionStorage.removeItem('authToken');
    },
    async login(credentials) {
        showLoader();
        try {
            const response = await axios.post('http://localhost:3000/user/login', credentials);
            showToast(`Success: ${response.data.user.message}`, "success", 5000);
            this.saveToken(response.data.user.token);
        } catch (error) {
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    showToast(`Erreur: ${error.response.data.message}`, "error", 5000);
                } else if (error.response.data.user && error.response.data.user.message) {
                    showToast(`Erreur: ${error.response.data.user.message}`, "error", 5000);
                } else {
                    showToast("Erreur: Une erreur inconnue est survenue", "error", 5000);
                }
            } else {
                // Gestion d'autres types d'erreurs (e.g., réseau)
                showToast("Erreur de réseau ou réponse indéfinie du serveur", "error", 5000);
            }
        } finally {
            hideLoader();
        }
    },

    async register(credentials) {
        showLoader();
        try {
            const response = await axios.post('http://localhost:3000/user/register', credentials);

            showToast(`Success: ${response.data.user.message}`, "success", 5000);
            this.saveToken(response.data.user.token);
            this.$router.push({ name: 'HomePage' }); // Rediriger l'utilisateur vers la page d'accueil après la connexion
        } catch (error) {
            if (error.response.data.message) {
                showToast(`Erreur: ${error.response.data.message}`, "error", 5000);
            } else {
                showToast(`Erreur: ${error.response.data.user.message}`, "error", 5000);

            }
        } finally {
            hideLoader();
        }
    },
    logout(router) { // Ajoutez `router` en tant que paramètre
        this.removeToken();
        showToast("Vous avez bien été déconnecté", "success", 5000);
        router.push({ name: 'LoginPage' });
    },
    logoutForce(router) { // Ajoutez `router` en tant que paramètre
        this.removeToken();
        showToast("Session expiré", "error", 5000);
        router.push({ name: 'LoginPage' });
    }
};

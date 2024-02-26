// userService.js
import axios from 'axios';
import { userService } from "./userService";
import { showToast, showLoader, hideLoader } from "./userService";
// import hideLoader from "./userService";

export const bddService = {
    // Fonction pour effectuer une requête GET
    async getBddData(router) {

        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };
        return axios.get('http://localhost:3000/bdd', config)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
                if (error.response.status === 401) {
                    showToast("Veuillez vous connecter à nouveau", "error", 5000);
                    userService.logoutForce(router);
                }
                throw error;
            });
    },

    async getBddDataid(router) {

        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };
        return axios.get(`http://localhost:3000/bdd/${router.currentRoute.value.params.idBdd}`, config)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error!', error);
                if (error.response.status === 401) {
                    showToast("Veuillez vous connecter à nouveau", "error", 5000);
                    userService.logoutForce(router);
                }
                throw error;
            });
    },

    async breakdatabase(command, bddId, router) {
        showLoader();
        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };
        // Les données doivent être passées comme deuxième argument de axios.post
        const data = {
            command,
            bddId
        };

        return axios.post(`http://localhost:3000/bdd/break`, data, config)
            .then(response => {
                // Traitement de la réponse
                hideLoader();
                showToast(response.data.user.data, "success", 5000);
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Vérifiez d'abord si error.response et error.response.status existent
                if (error.response && error.response.status === 401) {
                    hideLoader();
                    showToast("Veuillez vous connecter à nouveau", "error", 5000);
                    userService.logoutForce(router);
                } else {
                    // Gestion des autres types d'erreurs
                    hideLoader();
                    showToast("Une erreur est survenue", "error", 5000);
                }
                throw error;
            });
    },

    async restartdatabase(bddId, router) {
        showLoader();
        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };
        // Les données doivent être passées comme deuxième argument de axios.post
        const data = {
            bddId
        };

        return axios.post(`http://localhost:3000/bdd/restart`, data, config)
            .then(response => {
                // Traitement de la réponse
                hideLoader();
                showToast(response.data.user.data, "success", 5000);
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Vérifiez d'abord si error.response et error.response.status existent
                if (error.response && error.response.status === 401) {
                    hideLoader();
                    showToast("Veuillez vous connecter à nouveau", "error", 5000);
                    userService.logoutForce(router);
                } else {
                    // Gestion des autres types d'erreurs
                    hideLoader();
                    showToast("Une erreur est survenue", "error", 5000);
                }
                throw error;
            });
    },
    async deletedatabase(bddId, router) {
        showLoader();
        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };

        return axios.delete(`http://localhost:3000/bdd/${bddId}`, config)
            .then(response => {
                // Traitement de la réponse
                hideLoader();
                showToast(response.data.user.data, "success", 5000);
                router.push({ name: 'HomePage' });
            })
            .catch(error => {
                console.error('There was an error!', error);
                // Vérifiez d'abord si error.response et error.response.status existent
                if (error.response && error.response.status === 401) {
                    hideLoader();
                    showToast("Veuillez vous connecter à nouveau", "error", 5000);
                    userService.logoutForce(router);
                } else {
                    // Gestion des autres types d'erreurs
                    hideLoader();
                    showToast("Une erreur est survenue", "error", 5000);
                }
                throw error;
            });
    },
    async createDatabase(credentials, router) {
        showLoader();
        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };

        return axios.post(`http://localhost:3000/bdd/create`, credentials, config)
            .then(response => {
                hideLoader();
                showToast(" La base de données a bien été créée", "success", 5000);
                router.push({ name: 'IdBddPage', params: { idBdd: response.data.user.id } });
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    hideLoader();
                    showToast("Veuillez vous connecter à nouveau", "error", 5000);
                    userService.logoutForce(router);
                } else if (error.response && error.response.status === 400) {
                    hideLoader();
                    showToast(error.response.data.message, "error", 5000);

                } else {
                    hideLoader();
                    showToast("Une erreur est survenue", "error", 5000);
                }
                // throw error;
            });
    },

};

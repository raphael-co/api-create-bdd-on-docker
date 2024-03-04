// userService.js
import axios from 'axios';
import { userService } from "./userService";
import { showToast, showLoader, hideLoader } from "./userService";
// import hideLoader from "./userService";

export const url = "http://192.168.1.196:3000";

export const bddService = {
    // Fonction pour effectuer une requête GET
    async getBddData(router) {

        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };
        return axios.get(`${url}/bdd`, config)
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
        return axios.get(`${url}/bdd/${router.currentRoute.value.params.idBdd}`, config)
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

        return axios.post(`${url}/bdd/break`, data, config)
            .then(response => {
                // Traitement de la réponse
                hideLoader();
                showToast(response.data.user.data, "success", 5000);

                if (response.data.user.port) {
                    return response.data.user.port
                }
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

        return axios.post(`${url}/bdd/restart`, data, config)
            .then(response => {
                // Traitement de la réponse
                hideLoader();
                showToast(response.data.user.data, "success", 5000);

                if (response.data.user.port) {
                    return response.data.user.port
                }
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
    async deletedatabase(bddId, deleteConfirmation, router) {
        showLoader();
        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };
        const data = {
            confirmDelete: deleteConfirmation
        };
        return axios.post(`${url}/bdd/delete/${bddId}`, data, config)
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
                } else if (error.response && error.response.status === 400) {
                    hideLoader();
                    showToast(`Erreur: ${error.response.data.message}`, "error", 5000);
                } else {
                    // Gestion des autres types d'erreurs
                    hideLoader();
                    showToast("Une erreur est survenue", "error", 5000);
                }
            });
    },
    async createDatabase(credentials, router) {
        showLoader();
        const config = {
            headers: {
                Authorization: userService.getToken()
            }
        };

        return axios.post(`${url}/bdd/create`, credentials, config)
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
                    console.log(error);
                    showToast(error.response.data.user.message, "error", 5000);

                } else {
                    hideLoader();
                    showToast("Une erreur est survenue", "error", 5000);
                }
                // throw error;
            });
    },

};

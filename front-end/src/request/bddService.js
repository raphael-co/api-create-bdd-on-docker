// userService.js
import axios from 'axios';
import { userService } from "./userService";
import showToast from "./userService";

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
    }
};

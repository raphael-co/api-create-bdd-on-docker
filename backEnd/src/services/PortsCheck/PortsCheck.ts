// DockerService.ts
import { Request, Response } from 'express';
import HashPassword from '../../middlewares/user/HashPassword';
import axios from 'axios';
import crypto from 'crypto';
import { readFileSync } from 'fs';
import { Agent } from 'https';
import path from 'path';

export const freeboxHost = 'http://mafreebox.freebox.fr';
const appToken = '1qY63XGKaztD/CFlsbv2Ty8z5PK4ivEkqrq+V0wNWpRVAEJV7i4bcKaedbNWjizo'; // Votre app_token

const CA_FILES = [
    path.join(__dirname, '../../cert/freebox_ecc_root_ca.pem'),
    path.join(__dirname, '../../cert/freebox_root_ca.pem'),
    path.join(__dirname, '../../cert/iliadbox_ecc_root_ca.pem'),
    path.join(__dirname, '../../cert/iliadbox_rsa_root_ca.pem')
];

const caCerts = CA_FILES.map((filePath) => readFileSync(filePath));

const httpsAgent = new Agent({
    ca: caCerts,
});


export class PortsCheck {
    static test = async (req: Request, res: Response) => {
        const newPassword = await HashPassword.hashPassword(req.body.password);
        res.send({
            success: true,
            message: newPassword,
            token: null,
        });
    };

    static openSession = async () => {
        try {
            // Obtenir le challenge
            let response = await axios.get(`${freeboxHost}/api/v8/login/`);
            const challenge = response.data.result.challenge;

            // Créer la réponse cryptographique avec le challenge et l'app_token
            const hmac = crypto.createHmac('sha1', appToken).update(challenge).digest('hex');

            // Envoyer la réponse pour ouvrir une session
            response = await axios.post(`${freeboxHost}/api/v8/login/session/`, {
                app_id: 'api-bdd-docker', // Votre app_id
                password: hmac
            });

            // Si la connexion est réussie, stocker le session_token
            const sessionToken = response.data.result.session_token;

            return sessionToken;
        } catch (error) {
            console.error('Erreur lors de l\'ouverture de la session :', error);
            throw new Error('Erreur lors de l\'ouverture de la session');
        }
    };

    static fetchApiVersion = async () => {
        try {
            const response = await axios.get(`${freeboxHost}/api_version`);
            // Affiche les informations de version de l'API
            return {
                success: true,
                message: response.data,
                token: null,
            };
        } catch (error) {
            console.error('Erreur lors de la récupération de la version de l\'API:', error);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }

    static registerBox = async () => {
        try {
            const response = await axios.post(`${freeboxHost}/api/v8/login/authorize/`, {
                app_id: 'api-bdd-docker',
                app_name: 'api-create-bdd-on-docker',
                app_version: '1.0',
                device_name: 'MacBook Pro Raph',
            });
            return {
                success: true,
                message: response.data,
                token: null,
            };
            // Sauvegardez result.app_token et result.track_id pour les étapes suivantes
        } catch (error) {
            console.error('Erreur lors de la récupération de la version de l\'API:', error);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }

    static trackAuthorizationStatus = async () => {
        try {
            const response = await axios.get(`${freeboxHost}/api/v8/login/authorize/12`);

            return {
                success: true,
                message: response.data,
            }
        } catch (error) {
            console.error('Erreur lors du suivi du statut d\'autorisation:', error);
            return {
                success: false,
                message: (error as Error).message
            };
        }
    }

    static checkPortAvailability = async (port: number = 10001): Promise<boolean> => {
        try {

            const sessionToken = await PortsCheck.openSession(); // Récupère le sessionToken via la méthode que vous définissez
            // Récupérer la liste des redirections existantes
            const response = await axios.get(`${freeboxHost}/api/v4/fw/redir/`, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });

            // Vérifier si le port est déjà utilisé
            const portRedirections = response.data.result;
            const isPortAvailable = !portRedirections.some((redirection: { wan_port_start: number; wan_port_end: number; lan_port: number; }) => {
                return (redirection.wan_port_start <= port && port <= redirection.wan_port_end) ||
                    (redirection.lan_port === port);
            });
            
            return isPortAvailable;
        } catch (error) {
            console.error('Erreur lors de la vérification de la disponibilité du port :', error);

            return false;
        }
    };

    static isPortEnabled = async (port: number): Promise<boolean> => {
        const sessionToken = await PortsCheck.openSession(); // Obtient le sessionToken
    
        try {
            const response = await axios.get(`${freeboxHost}/api/v4/fw/redir/`, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });
    
            // Trouver la redirection spécifique par port
            const redirection = response.data.result.find((r: { lan_port: number }) => r.lan_port === port);
            if (!redirection) {
                console.log('Redirection de port non trouvée');
                return false; // Si aucune redirection correspondante n'est trouvée, retourne false
            }
    
            // Vérifier si la redirection est activée
            return redirection.enabled; // Retourne true si la redirection est activée, sinon false
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'état de la redirection de port:', error);
            throw new Error('Erreur lors de la vérification de l\'état de la redirection'); // Ou retourner false selon la manière de gérer les erreurs dans votre application
        }
    };
    

    static openPort = async (port: number,ContainerId: string) => {
        const sessionToken = await PortsCheck.openSession(); 

        try {

            if (await PortsCheck.checkPortAvailability(port) === false) {
                return {
                    success: false,
                    message: 'Le port est déjà utilisé',
                };

            }
            
            const response = await axios.post(`${freeboxHost}/api/v8/fw/redir/`, {
                enabled: true,
                ip_proto: 'tcp',
                lan_ip: '192.168.1.196',
                wan_port_start: port,
                wan_port_end: port,
                lan_port: port,
                comment: `Port ${port} bdd`,
            }, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
                httpsAgent: httpsAgent,
            });

            if (!response.data.success) {
                return {
                    success: response.data.success,
                    message: response.data.msg,
                    error_code: response.data.error_code
                };
            }
            return {
                success: response.data.success,
                message: 'Redirection de port ajoutée avec succès',
                data: response.data
            };
        } catch (error) {
            console.log(error);

            return {
                success: false,
                message: 'Erreur lors de l\'ajout de la redirection de port',
                error: error
            };
        }
    }

    static closePort = async (port: number) => {
        const sessionToken = await PortsCheck.openSession(); // Assume this method obtains a session token
    
        try {
            const redirectionsResponse = await axios.get(`${freeboxHost}/api/v4/fw/redir/`, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });
    
            const redirection = redirectionsResponse.data.result.find((r: { lan_port: number; comment: string | string[]; }) => r.lan_port === port);
            if (!redirection) {
                return {
                    success: false,
                    message: 'Redirection non trouvée pour fermeture',
                };
            }
    
            const deleteResponse = await axios.delete(`${freeboxHost}/api/v4/fw/redir/${redirection.id}`, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });
    
            return {
                success: true,
                message: 'Redirection de port supprimée avec succès',
                data: deleteResponse.data
            };
        } catch (error) {
            console.log(error);
    
            return {
                success: false,
                message: 'Erreur lors de la suppression de la redirection de port',
                error: error
            };
        }
    };

    static suspendPort = async (port: number, value : boolean) => {
        const sessionToken = await PortsCheck.openSession(); 

        try {
            const redirectionsResponse = await axios.get(`${freeboxHost}/api/v4/fw/redir/`, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });
    
            const redirection = redirectionsResponse.data.result.find((r: { lan_port: number }) => r.lan_port === port);
            if (!redirection) {
                return {
                    success: false,
                    message: 'Redirection non trouvée pour suspension',
                };
            }
    
            const updateResponse = await axios.put(`${freeboxHost}/api/v4/fw/redir/${redirection.id}`, {
                enabled: value,
            }, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });
    
            // console.log('Redirection de port suspendue avec succès', updateResponse.data);
            return {
                success: true,
                message: 'Redirection de port suspendue avec succès',
                data: updateResponse.data
            };
        } catch (error) {
            console.log(error);
    
            return {
                success: false,
                message: 'Erreur lors de la suspension de la redirection de port',
                error: error
            };
        }
    };
    
    static checkSession = async () => {
        const sessionToken = await PortsCheck.openSession(); // Récupère le sessionToken via la méthode que vous définissez

        try {
            const response = await axios.get(`${freeboxHost}/api/v8/login/`, {
                headers: {
                    'X-Fbx-App-Auth': sessionToken,
                },
            });
            const isLoggedIn = response.data.result.logged_in;

            return {
                success: true,
                message: isLoggedIn ? 'Session token is valid.' : 'Session token is not valid.',
                isValid: isLoggedIn,
            };
        } catch (error) {
            console.error('Error checking session token validity:', error);
            return {
                success: false,
                message: 'Error checking session token validity.',
                error: error,
            };
        }
    };


}

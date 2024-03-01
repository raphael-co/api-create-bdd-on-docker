# Utilisez la dernière version de Node disponible
FROM node:latest

# Installer les dépendances nécessaires pour ajouter un nouveau dépôt
RUN apt-get update && \
    apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common

# Télécharger et exécuter le script d'installation de Docker
RUN curl -fsSL https://get.docker.com -o get-docker.sh && \
    sh get-docker.sh

# Donner à l'utilisateur node l'accès à Docker
RUN usermod -aG docker node

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (y compris les devDependencies si nécessaire pour la construction)
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Compiler le code TypeScript en JavaScript
RUN npm run build

# Exposer le port de votre application
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["node", "dist/app.js"]

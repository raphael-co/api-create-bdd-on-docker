<template>
    <div class="cardRegister-container">
        <h2>Working Sign In</h2>
        <p>
            L'application conçue offre une solution innovante pour la création et la gestion de bases de données au sein de
            l'environnement Docker. Elle est spécifiquement adaptée pour supporter deux des systèmes de gestion de base de
            données les plus populaires et robustes : PostgreSQL et MariaDB. En privilégiant la facilité d'utilisation,
            cette application automatise le processus de déploiement de bases de données, permettant ainsi aux utilisateurs
            de mettre en place rapidement leur infrastructure de données avec peu d'effort. Une fois la base de données
            créée, l'application génère et fournit à l'utilisateur les informations nécessaires pour se connecter à cette
            dernière. Soulignant l'importance de la sécurité dans la gestion des données, toutes les informations de
            connexion sont cryptées. Cette mesure de sécurité garantit que les accès à la base de données restent sécurisés
            et à l'abri des regards indiscrets, offrant ainsi une couche supplémentaire de protection pour les données
            critiques.
        </p>
    </div>
</template>
  
<script>
export default {
};
</script>
  
<style scoped>
.cardRegister-container {
    width: 100%;
    max-width: 400px;
    height: 410px;
    background: #fff;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}


@media (max-width: 900px) {
    .cardRegister-container {
        max-width: 320px;
        height: 100%;
        max-height: 490px;
;
        /* min-height: 100vh; */
        /* Change la direction de row à column pour les petits écrans */
    }
}

@media (max-width: 380px) {
    .cardRegister-container {
        max-width: 300px;
        max-height: 490px;
        /* min-height: 100vh; */
        /* Change la direction de row à column pour les petits écrans */
    }
}

h2 {
    color: #333;
    text-align: center;
}
</style>
  
<template>
    <div class="IdBddPage-page">
        <div>
            <HeaderComp />
        </div>
        <div class="content">
            <div class="menu">
                <span class="menuChoice" @click="scrollToSection('General')">General</span>
                <span class="menuChoice" @click="scrollToSection('Connection')">connexion</span>
                <span class="menuChoice" @click="scrollToSection('Delete')">delete</span>
            </div>
            <div v-if="data === 'load'" class="cards">
                <CardLoading :bddData="bddDataLoadGeneral" label="General" />
                <CardLoading :bddData="bddDataLoadConnection" label="Connection" />
            </div>

            <div v-if="data === 'loaded'" class="cards">
                <GeneralBddInfoCard :bddData="bddData" />
                <generalBddInfoConnectionsCard :bddData="bddData" />
                <DeleteCard :bddData="bddData" @handleUpdateBddRun="handleUpdateBddRun" />
            </div>
        </div>
    </div>
</template>
  
<script>
import GeneralBddInfoCard from '../components/card/generalBddInfoCard.vue';
import generalBddInfoConnectionsCard from '../components/card/generalBddInfoConnectionsCard.vue';
import CardLoading from '../components/card/cardLoading.vue';
import HeaderComp from '../components/header/header.vue';
import { bddService } from "../request/bddService.js";
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import DeleteCard from '../components/card/deleteCard.vue';

export default {
    name: 'IdBddPage',
    components: {
        GeneralBddInfoCard,
        generalBddInfoConnectionsCard,
        CardLoading,
        HeaderComp,
        DeleteCard
    },
    methods: {
        scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                const headerOffset = 50; // Hauteur de votre en-tête ou tout autre élément que vous souhaitez compenser
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        },

        handleUpdateBddRun(newValue) {
            this.bddData.bddRun = newValue;
        }

    },
    setup() {
        const search = ref(""); // Modifier ici pour utiliser ref
        const router = useRouter();
        const data = ref('load'); // Utilisation de ref pour la réactivité
        const bddData = ref(null);
        const error = ref(null);
        const bddDataLoadGeneral = ["Name", "Created", "Status", "Type", "Version", "Storage"]
        const bddDataLoadConnection = ["Hostname", "Port", "Database", "Type", "Username", "Password"]
        const fetchBddData = () => {
            bddService.getBddDataid(router)
                .then(response => {
                    console.log(response);
                    data.value = 'loaded'; // Mise à jour de la valeur réactive
                    bddData.value = response.user.data; // Assurez-vous que la réponse correspond à ce que vous attendez
                })
                .catch(err => {
                    console.log(err);
                    data.value = 'error';
                    error.value = err;
                });
        };

        // // Appel de fetchBddData au moment de la création du composant
        fetchBddData();

        return {
            data,
            bddData,
            error,
            search,
            bddDataLoadGeneral,
            bddDataLoadConnection
            // fetchBddData
        };

    }

};
</script>
  
  
<style scoped>
.IdBddPage-page {
    display: flex;
    flex-direction: column;
    padding: 0 200px 20px;
    gap: 50px;
}

.menuChoice {
    cursor: pointer;
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: left;
    padding: 5px 10px 5px 5px;
    border-radius: 5px;
}

.menuChoice:hover {
    background-color: #f1f6ff;
}

@media screen and (max-width: 800px) {
    .IdBddPage-page {
        padding: 0 20px 20px;
    }
}

.content {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
}

@media (max-width: 500px) {
    .content {
        flex-direction: column;
        gap: 20px;
        padding: 10px 10px;
    }
}

.cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 85%;
}

.menu {
    position: sticky;
    display: flex;
    flex-direction: column;
    height: 100%;
    top: 30px;
    gap: 20px;
    width: 15%;
}


@media (max-width: 850px) {
    .content {
        flex-direction: column;
        gap: 20px;
        padding: 10px 10px;
    }

    .cards {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    .menu {
        position: static;
        flex-direction: row;
        width: 100%;
        font-size: large;
    }
}
</style>
  
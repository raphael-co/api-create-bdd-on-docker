<template>
  <div class="home-page">
    <div>
      <HeaderComp />
    </div>
    <div class="bdd-container">
      <div>
        <h2>
          Mes Bases de données
        </h2>
      </div>
      <div class="search">
        <inputSearchBdd v-model="search" placeholder='Rechercher une bdd' />
      </div>
      <div v-if="data === 'load'" class="load">
        <PlaceholderGetAllBdd />
      </div>
      <div v-if="data === 'error'" class="error">
        <p>Une erreur est survenie au moment du chargement des base de données</p>
      </div>
      <div v-if="data === 'loaded'" class="loaded">
        <AllBdd :search="search" :bddData="bddData" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import PlaceholderGetAllBdd from "../components/placeholders/placeholderGetAllBdd.vue";
import { bddService } from "../request/bddService.js";
import inputSearchBdd from '../components/input/inputSearchBdd.vue';
import HeaderComp from '../components/header/header.vue';
import { useRouter } from 'vue-router';
import AllBdd from '../components/tab/allBdd.vue';
export default {
  name: 'HomePage',
  components: {
    PlaceholderGetAllBdd,
    inputSearchBdd,
    HeaderComp,
    AllBdd
  },
  setup() {
    const search = ref(""); // Modifier ici pour utiliser ref
    const router = useRouter();
    const data = ref('load'); // Utilisation de ref pour la réactivité
    const bddData = ref(null);
    const error = ref(null);

    const fetchBddData = () => {
      bddService.getBddData(router)
        .then(response => {
          data.value = 'loaded'; // Mise à jour de la valeur réactive
          bddData.value = response.user.data; // Assurez-vous que la réponse correspond à ce que vous attendez
        })
        .catch(err => {
          data.value = 'error';
          error.value = err;
        });
    };

    // // Appel de fetchBddData au moment de la création du composant
    fetchBddData();

    // Exposition des propriétés réactives au template
    return {
      data,
      bddData,
      error,
      search
      // fetchBddData
    };
  },
};
</script>


<style scoped>
/* Styles spécifiques à Home */

.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100%;
  padding: 0 200px;
  gap: 20px;
}

@media (max-width: 900px) {
  .home-page {
    padding: 0 100px;
  }
  h2{
    font-size: large;
  }
}

@media (max-width: 550px) {
  .home-page {
    padding: 0 20px;
  }
}

.search {
  width: 100%;
  display: flex;
}

.bdd-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
</style>

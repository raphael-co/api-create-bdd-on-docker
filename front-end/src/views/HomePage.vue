<template>
  <div class="home-page">
    <div>
      <HeaderComp />
    </div>
    <div class="home-page-bdd-container">
      <div>
        <h2>
          Mes Bases de données
        </h2>
      </div>
      <div class="home-page-search">
        <inputSearchBdd v-model="search" placeholder='Rechercher une bdd' />
        <button @click="goToCreateBdd()" class="add-db-button"><i class="fas fa-database"></i>
          Create Database</button>
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
  methods: {
    goToCreateBdd() {
      this.$router.push('/create');
    }
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
/* 
.btnAdd {
  width: 170px;
} */


</style>

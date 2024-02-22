<template>
    <div class="table-placeholder">
        <!-- Entêtes de colonne -->
        <div class="row">
            <div>Id</div>
            <div>Name</div>
            <div>Status</div>
            <div>Type</div>
        </div>
        <!-- Lignes de données filtrées -->
        <div class="row rows" v-for="(bdd, index) in filteredBddData" :key="index">
            <div>{{ bdd.id ? bdd.id : 'no id' }}</div>
            <div>{{ bdd.Name ? bdd.Name : 'no name' }}</div>
            <div>ok</div>
            <div>{{ bdd.Type ? bdd.Type : 'no type' }}</div>
        </div>
    </div>
</template>
  
<script>
import { computed } from 'vue';

export default {
    name: 'AllBdd',
    props: {
        bddData: Array, // Définissez la prop ici
        search: String
    },
    setup(props) {
        // Computed property pour filtrer bddData basé sur la recherche
        const filteredBddData = computed(() => {
            const trimmedSearch = props.search.trim();
            if (trimmedSearch.length < 2) {
                return props.bddData; // Retourne toutes les données si la recherche est moins de 2 caractères
            }

            // Filtrer bddData basé sur la recherche
            return props.bddData.filter(bdd => {
                return (
                    bdd.id.toString().includes(trimmedSearch) ||
                    bdd.Name.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
                    bdd.Type.toLowerCase().includes(trimmedSearch.toLowerCase())
                );
            });
        });

        return {
            filteredBddData // Exposer la propriété filtrée pour l'utiliser dans le template
        };
    }
};
</script>

  
<style scoped>
.table-placeholder {
    border-radius: 4px;
    width: 100%;
    /* Ajustez à la largeur désirée */
}

.header {
    height: 20px;
    background: #f0f0f0;
    margin-bottom: 10px;
}

.row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
    border-bottom: 0.5px solid #e5e7eb
}

.rows:hover {
    background-color: #e5e7eb;
    cursor: pointer;
}


.cell {
    height: 20px;
    background: #e0e0e0;
    flex-grow: 1;
    margin-right: 10px;
}

.cell:last-child {
    margin-right: 0;
}

.cell:last-child {
    margin-right: 0;
}

/* Animation */
@keyframes loading {
    0% {
        background-color: #e0e0e0;
    }

    50% {
        background-color: #f0f0f0;
    }

    100% {
        background-color: #e0e0e0;
    }
}

.header,
.cell {
    animation: loading 1.5s infinite;
}
</style>
  
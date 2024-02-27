<template>
    <div class="table-placeholder">
        <!-- Entêtes de colonne -->
        <div class="row">
            <div class="celluleRow">Id</div>
            <div class="celluleRow">Name</div>
            <div class="celluleRow">Status</div>
            <div class="celluleRow">Storage</div>
            <div class="celluleRow">Type</div>
        </div>
        <div class="row rows" v-for="(bdd, index) in filteredBddData" :key="index" @click="goToBddPage(bdd.id)">
            <div class="celluleRow">{{ bdd.id ? bdd.id : 'no id' }}</div>
            <div class="celluleRow">{{ bdd.Name ? bdd.Name : 'no name' }}</div>
            <span class="status" style="color: rgb(48, 198, 180)" v-if="bdd?.bddRun"><span
                    style="color: rgb(48, 198, 180);font-size: larger">•</span>
                available</span>
            <span v-else class="status" style="color: rgb(251, 71, 116)"><span
                    style="color: rgb(251, 71, 116);font-size: larger">•</span>
                unavailable</span>
            <div class="celluleRow">{{ bdd.StorageRemaining ? bdd.StorageRemaining : 'no type' }}</div>
            <div class="celluleRow">{{ bdd.Type ? bdd.Type : 'no type' }}</div>
        </div>
    </div>
</template>
  
<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'AllBdd',
    props: {
        bddData: Array, // Définissez la prop ici
        search: String
    },
    setup(props) {
        const router = useRouter();
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

        const goToBddPage = (id) => {
            // Utilisez Vue Router pour naviguer
            router.push({ name: 'IdBddPage', params: { idBdd: id } });
        };
        return {
            filteredBddData,
            goToBddPage
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

.celluleRow {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
}

.status {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
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
    border-bottom: 0.5px solid #e5e7eb;
    font-size: medium
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
  
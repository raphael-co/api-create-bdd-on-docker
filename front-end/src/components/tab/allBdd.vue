<template>
    <div class="table-all-bdd">
        <!-- Entêtes de colonne -->
        <div class="table-all-bdd-row">
            <div class="table-all-bdd-celluleRow">Id</div>
            <div class="table-all-bdd-celluleRow">Name</div>
            <div class="table-all-bdd-celluleRow">status</div>
            <div class="table-all-bdd-celluleRow">Storage</div>
            <div class="table-all-bdd-celluleRow">Type</div>
        </div>
        <div class="table-all-bdd-row table-all-bdd-rows" v-for="(bdd, index) in filteredBddData" :key="index" @click="goToBddPage(bdd.id)">
            <div class="table-all-bdd-celluleRow">{{ bdd.id ? bdd.id : 'no id' }}</div>
            <div class="table-all-bdd-celluleRow">{{ bdd.Name ? bdd.Name : 'no name' }}</div>
            <span class="table-all-bdd-status" style="color: rgb(48, 198, 180)" v-if="bdd?.bddRun"><span
                    style="color: rgb(48, 198, 180);font-size: larger">•</span>
                available</span>
            <span v-else class="table-all-bdd-status" style="color: rgb(251, 71, 116)"><span
                    style="color: rgb(251, 71, 116);font-size: larger">•</span>
                unavailable</span>
            <div class="table-all-bdd-celluleRow">{{ bdd.StorageRemaining ? bdd.StorageRemaining : 'no type' }}</div>
            <div class="table-all-bdd-celluleRow">{{ bdd.Type ? bdd.Type : 'no type' }}</div>
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

</style>
  
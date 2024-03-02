<template>
    <div id="Delete" class="cardDelete-container">
        <div class="cardDelete">
            <div class="infoGeneralDelete">
                <button @click="restartdatabase()" class="btnRestart">Restart Database</button>
            </div>
            <div class="infoGeneralDelete">
                <button v-if="bddData?.bddRun" @click="stopDatabase()" class="btnRestart">Stop Database</button>
                <button v-else @click="startDatabase()" class="btnStart">Start Database</button>
            </div>
            <div class="infoGeneralDelete">
                <button @click="deletedatabase()" class="btnDelete">Delete Database</button>
            </div>
        </div>
    </div>
    <div v-if="showDeleteModal" class="modal">
        <div class="modal-content">
            <h3>Delete Database</h3>
            <hr>
            <p>This action cannot be undone.</p>
            <p>Are you sure you want to delete this database?</p>
            <p>We do not retain backups or snapshots for deleted databases.</p>
            <p>Type <code style="color:#ff5c88 ;">I agree delete this bdd</code> below to confirm.</p>
            <input class="inputDelete" type="text" v-model="deleteConfirmation" placeholder="Type here to confirm">
            <hr>
            <div class="btn-container">
                <button @click="toggleDeleteModal" class="btnCancel">Cancel</button>
                <button @click="confirmDeleteDatabase" :disabled="deleteConfirmation !== 'I agree delete this bdd'"
                    class="btnDelete">Delete Database
                </button>
            </div>
        </div>
    </div>
</template>
  
<script>
import { useRouter } from 'vue-router';
import { bddService } from '../../request/bddService';
export default {
    name: 'deleteCard',
    props: {
        bddData: Object
    },
    data() {
        return {
            showDeleteModal: false,
            deleteConfirmation: '',
        };
    },
    methods: {
        stopDatabase() {
            bddService.breakdatabase('stop', this.bddData.id, this.router)
            this.$emit('handleUpdateBddRun', false);
        },
        startDatabase() {
            bddService.breakdatabase('start', this.bddData.id, this.router)
                .then(port => {
                    this.$emit('handleUpdateBddRun', true);
                    if (port) {
                        this.$emit('handleUpdateBddPort', port); // Émet seulement si le port est retourné
                    }
                })
                .catch(error => {
                    // Gérer l'erreur si nécessaire
                    console.log(error);
                });
        },

        // handleUpdateBddPort

        restartdatabase() {
            bddService.restartdatabase(this.bddData.id, this.router)
                .then(port => {
                    this.$emit('handleUpdateBddRun', true);
                    if (port) {
                        this.$emit('handleUpdateBddPort', port); // Émet seulement si le port est retourné
                    }
                })
                .catch(error => {
                    // Gérer l'erreur si nécessaire
                    console.log(error);
                });
        },

        toggleDeleteModal() {
            this.showDeleteModal = !this.showDeleteModal;
        },

        deletedatabase() {
            this.toggleDeleteModal();
        },

        confirmDeleteDatabase() {
            bddService.deletedatabase(this.bddData.id, this.deleteConfirmation, this.router);
        }
    }, setup() {
        const router = useRouter();

        return {
            router
        };
    }
}
</script>
  
<style scoped>

</style>
  
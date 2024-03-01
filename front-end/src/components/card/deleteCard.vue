<template>
    <div id="Delete" class="cardRegister-container">
        <div class="cardRegister">
            <div class="infoGeneral">
                <button @click="restartdatabase()" class="btnRestart">Restart Database</button>
            </div>
            <div class="infoGeneral">
                <button v-if="bddData?.bddRun" @click="stopDatabase()" class="btnRestart">Stop Database</button>
                <button v-else @click="startDatabase()" class="btnStart">Start Database</button>
            </div>
            <div class="infoGeneral">
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
.cardRegister {
    padding: 15px 60px;
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.btnDelete {
    background-color: #ff5c88;
    color: white;
    border: none;
    padding: 15px 15px;
    cursor: pointer;
    border-radius: 5px;
}

.btnDelete:hover {
    background-color: rgb(251, 71, 116)
}

.btnRestart {
    background-color: transparent;
    color: #ff5c88;
    border: none;
    padding: 15px 15px;
    cursor: pointer;
    border-radius: 5px;
}

.btnStart {
    background-color: transparent;
    color: rgb(48, 198, 180);
    border: none;
    padding: 15px 15px;
    cursor: pointer;
    border-radius: 5px;
}

.btnStart:hover {
    background-color: rgba(175, 240, 232, 0.596);
}

.btnRestart:hover {
    background-color: rgba(241, 163, 182, 0.464);
}

.cardRegister-container {

    width: 100%;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: #374c6f 1px solid;
}

.infoGeneral {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 60px;
    align-items: center
}

@media (max-width: 850px) {
    .cardRegister {
        flex-direction: column;
    }
}

.modal {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    display: flex;
    flex-direction: column;
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content hr {
    width: 100%;
    border: none;
    height: 1px;
    background: #cecece;
}

.btnConfirmDelete {
    background-color: #ff5c88;
    /* ... (rest of your button styles) */
}

.btnDelete:disabled {
    filter: grayscale(20%);
    cursor: not-allowed;
}

.btnDelete:disabled:hover {
    filter: grayscale(20%);
    cursor: not-allowed;
    background-color: #ff5c88;
}

.btn-container {
    display: flex;
    width: 100%;
    justify-content: end;
    gap: 20px;
}

.btnCancel {
    background-color: transparent;
    color: black;
    border: 1px solid #cecece;
    ;
    /* border: none; */
    padding: 15px 15px;
    cursor: pointer;
    border-radius: 5px;
}

.inputDelete {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.inputDelete:focus {
    border-color: #ff5c88;
}
</style>
  
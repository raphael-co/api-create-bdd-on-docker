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
</template>
  
<script>
import { useRouter } from 'vue-router';
import { bddService } from '../../request/bddService';
export default {
    name: 'deleteCard',
    props: {
        bddData: Object
    },
    methods: {
        stopDatabase() {
            // Émettre un événement au parent avec la nouvelle valeur souhaitée
            bddService.breakdatabase('stop', this.bddData.id, this.router)
            this.$emit('handleUpdateBddRun', false);
        },
        startDatabase() {
            // Émettre un événement au parent avec la nouvelle valeur souhaitée
            bddService.breakdatabase('start', this.bddData.id, this.router)
            this.$emit('handleUpdateBddRun', true);
        },

        restartdatabase() {
            bddService.restartdatabase(this.bddData.id, this.router)
            this.$emit('handleUpdateBddRun', true);
        },

        deletedatabase() {
            bddService.deletedatabase(this.bddData.id, this.router)
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
</style>
  
<template>
    <div id="General" class="cardRegister-container">
        <div class="cardRegister">
            <div>
                <h2>
                    General
                </h2>
            </div>
            <hr />
            <div class="infoGeneral">
                <span class="infoTitleGe">Name</span>
                <span>{{ bddData?.Name ? bddData.Name : 'no name' }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Created</span>
                <span>{{ formattedCreateDate }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Status</span>
                <span style="color: rgb(48, 198, 180)" v-if="bddData?.bddRun"><span style="color: rgb(48, 198, 180);font-size: larger">•</span>
                    available</span>
                <span v-else style="color: rgb(251, 71, 116)"><span
                        style="color: rgb(251, 71, 116);font-size: larger">•</span> unavailable</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Type</span>
                <span>{{ bddData?.type ? bddData.type : 'no name' }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Storage</span>
                <span>{{ bddData?.StorageRemaining ? bddData.StorageRemaining : 'no name' }}</span>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'GeneralBddInfoCard',
    props: {
        bddData: Object,
    },
    computed: {
        formattedCreateDate() {
            if (!this.bddData?.createAt) return 'no date';
            const date = new Date(this.bddData?.createAt);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZone: 'UTC'
            });
        }
    }
}
</script>
  
<style scoped>
.cardRegister {
    padding: 15px 60px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.cardRegister hr {
    width: 100%;
    border: #374c6f 1px solid;
}

.cardRegister-container {

    width: 100%;
    /* Utilisez 100% pour la largeur pour s'adapter à la largeur de l'écran */
    /* Optionnel: ajoutez une largeur maximale pour éviter que la carte ne devienne trop large sur les grands écrans */
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border: #374c6f 1px solid;

    /* Centre la carte horizontalement */
}

.infoGeneral {
    display: flex;
    flex-direction: row;
    gap: 10px;
    height: 60px;
    align-items: center
}

@media screen and (max-width: 800px) {
    .infoGeneral {
        flex-direction: column;
    }

    .infoTitleGe {
        width: 100%;
        text-align: center
    }

    h2 {
        width: 100%;
        text-align: center
    }
}

.infoTitleGe {
    width: 120px;
    color: #374c6f;
    font-weight: bold;
    font-size: 18px;
}

h2 {
    color: #374c6f;
    text-align: center;
    float: left;
}
</style>
  
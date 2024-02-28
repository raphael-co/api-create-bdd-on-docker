<template>
    <div id="Connection" class="cardRegister-container">
        <div class="cardRegister">
            <div>
                <h2>
                    Connections
                </h2>
            </div>
            <hr />
            <div class="infoGeneral">
                <span class="infoTitleGe">Hostname</span>
                <span>{{ bddData?.Host ? bddData.Host : 'no name' }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Port</span>
                <span>{{ bddData?.Port ? bddData.Port : 'no name' }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Database</span>
                <span>{{ bddData?.DatabaseName ? bddData.DatabaseName : 'no name'
                }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Type</span>
                <span>{{ bddData?.type ? bddData.type : 'no name' }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Username</span>
                <span>{{ bddData?.Username ? bddData.Username : 'no name' }}</span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Password</span>
                <span style="height: 100%; display: flex; text-align: center; width: 100%;">
                    <TextToggle :text="bddData?.Password ? bddData.Password : 'no name'" />
                </span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">Internal Database URL</span>
                <span style="height: 100%; display: flex; text-align: center; width: 100%;">
                    <TextToggle v-if="bddData.type === 'postgres'"
                        :text="bddData?.Password ? `postgresql://${bddData.Username}:${bddData.Password}@${bddData.Host}:${bddData.Port}/${bddData.DatabaseName}` : 'no name'" />

                    <TextToggle v-if="bddData.type === 'mariadb'"
                        :text="bddData?.Password ? `mariadb://${bddData.Username}:${bddData.Password}@${bddData.Host}:${bddData.Port}/${bddData.DatabaseName}` : 'no name'" />
                </span>
            </div>
            <div class="infoGeneral">
                <span class="infoTitleGe">External Database URL</span>
                <span style="height: 100%; display: flex; text-align: center; width: 100%;">
                    <TextToggle v-if="bddData.type === 'postgres'"
                        :text="bddData?.Password ? `postgresql://${bddData.Username}:${bddData.Password}@<External-IP-or-Domain>:${bddData.Port}/${bddData.DatabaseName}` : 'no name'" />

                    <TextToggle v-if="bddData.type === 'mariadb'"
                        :text="bddData?.Password ? `mariadb://${bddData.Username}:${bddData.Password}@<External-IP-or-Domain>:${bddData.Port}/${bddData.DatabaseName}` : 'no name'" />
                </span>
            </div>

            <div class="infoGeneral">
                <span v-if="bddData.type === 'postgres'" class="infoTitleGe"> PSQL Command</span>
                <span v-if="bddData.type === 'mariadb'" class="infoTitleGe">MYSQL Command</span>
                <span style="height: 100%; display: flex; text-align: center; width: 100%;">
                    <TextToggle v-if="bddData.type === 'postgres'"
                        :text="bddData?.Password ? `psql -h ${bddData.Host} -p ${bddData.Port} -U ${bddData.Username} -d ${bddData.DatabaseName} -W` : 'no name'" />

                    <TextToggle v-if="bddData.type === 'mariadb'"
                        :text="bddData?.Password ? `mysql -h ${bddData.Host} -u ${bddData.Username} -p ${bddData.Password} ${bddData.Port} -D ${bddData.DatabaseName}` : 'no name'" />
                </span>
            </div>
        </div>
    </div>
</template>
  
<script>
import TextToggle from '../input/sliderTextToggle.vue';
export default {
    name: 'generalBddInfoConnectionsCard',
    components: {
        TextToggle
    },
    props: {
        bddData: Object,
    }
};
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


.infoGe {
    height: 100%;
    display: flex;
    width: 100%;
    align-items: center;

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
    align-items: center;
}

.infoGeneral>* {
    min-width: 0;
    /* Ceci permet aux enfants de `.infoGeneral` de ne pas déborder */
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
</style>
  
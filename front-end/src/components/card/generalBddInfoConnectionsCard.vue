<template>
    <div id="Connection" class="cardType-container">
        <div class="cardType">
            <div>
                <h2>
                    Connections
                </h2>
            </div>
            <hr />
            <div class="infoGeneral">
                <span class="infoTitleGe">Hostname</span>
                <span>{{ 'raphael.netgraph.fr' }}</span>
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
                        :text="bddData?.Password ? `raphael.netgraph.fr:${bddData.Port}/:${bddData.DatabaseName}` : 'no name'" />
                    <TextToggle v-if="bddData.type === 'mariadb'"
                    :text="bddData?.Password ? `raphael.netgraph.fr:${bddData.Port}/:${bddData.DatabaseName}` : 'no name'" />
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

</style>
  
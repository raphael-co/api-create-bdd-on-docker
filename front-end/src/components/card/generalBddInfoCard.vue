<template>
    <div id="General" class="cardType-container">
        <div class="cardType">
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
                <span class="infoTitleGe">Version</span>
                <span>{{ bddData?.VersionBdd ? bddData.VersionBdd : 'no name' }}</span>
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

</style>
  
<template>
    <div :id="label" class="cardType-container">
        <div class="cardType">
            <div>
                <h2>
                    {{ label }}
                </h2>
            </div>
            <hr />
            <div class="infoGeneral" v-for="data in bddData" :key="data">
                <span class="infoTitleGe">
                    {{ data }}
                </span>
                <span style="width: 100%">
                    <PlaceholderRowGetAllBdd :cellCount="1" />
                </span>
            </div>
        </div>
    </div>
</template>
  
<script>
import PlaceholderRowGetAllBdd from '../placeholders/placeholderRowGetAllBdd.vue';
export default {
    name: 'cardLoading',
    components: {
        PlaceholderRowGetAllBdd
    },
    props: {
        bddData: Object,
        label: String
    },
}
</script>
  
<style scoped>

</style>
  
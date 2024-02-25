<template>
    <div :id="label" class="cardRegister-container">
        <div class="cardRegister">
            <div>
                <h2>
                    {{ label }}
                </h2>
            </div>
            <hr />
            <div class="infoGeneral" v-for="data in bddData" :key="data">
                <span class="infoTitleGe">
                    {{ data }} :
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
  
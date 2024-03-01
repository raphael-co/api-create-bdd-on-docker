<template>
    <div class="row">
        <div class="cell" v-for="n in cellCount" :key="n"></div>
    </div>
</template>
  
<script>
export default {
    name: 'PlaceholderRowGetAllBdd',
    props: {
        cellCount: {
            type: Number,
            default: 4, // Valeur par défaut de 4
        }
    }
};
</script>
  
<style scoped>

</style>
  
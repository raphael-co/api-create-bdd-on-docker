<template>
    <div class="table-placeholder">
        <!-- <div class="header"></div> -->
        <div class="row">
            <div>Id</div>
            <div>Name</div>
            <div>Status</div>
            <div>Storage</div>
            <div>Type</div>
        </div>
        <PlaceholderRowGetAllBdd :cellCount="5" />
        <PlaceholderRowGetAllBdd :cellCount="5" />
        <PlaceholderRowGetAllBdd :cellCount="5" />
    </div>
</template>
  
<script>
import PlaceholderRowGetAllBdd from "../placeholders/placeholderRowGetAllBdd.vue";
export default {
    name: 'PlaceholderGetAllBdd',
    components: {
        PlaceholderRowGetAllBdd
    },
};
</script>
  
<style scoped>
</style>
  
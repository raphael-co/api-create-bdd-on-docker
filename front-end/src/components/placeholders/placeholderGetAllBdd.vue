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
.table-placeholder {
    border-radius: 4px;
    width: 100%;
    /* Ajustez à la largeur désirée */
}

.header {
    height: 20px;
    background: #f0f0f0;
    margin-bottom: 10px;
}

.row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 60px;
    border-bottom: 0.5px solid #e5e7eb;
    font-size: medium
}

.cell {
    height: 20px;
    background: #e0e0e0;
    flex-grow: 1;
    margin-right: 10px;
}

.cell:last-child {
    margin-right: 0;
}

.cell:last-child {
    margin-right: 0;
}

/* Animation */
@keyframes loading {
    0% {
        background-color: #e0e0e0;
    }

    50% {
        background-color: #f0f0f0;
    }

    100% {
        background-color: #e0e0e0;
    }
}

.header,
.cell {
    animation: loading 1.5s infinite;
}
</style>
  
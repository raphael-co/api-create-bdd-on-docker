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
.row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    /* margin-bottom: 10px; */
    height: 60px;
    border-bottom: 0.5px solid #e5e7eb
}

/* .row:hover {
    background-color: #e5e7eb;
} */

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

.cell {
    animation: loading 1.5s infinite;
}
</style>
  
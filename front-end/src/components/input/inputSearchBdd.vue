<template>
    <input class="inputSearch" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder" :class="inputClass" />
</template>
  
<script>
export default {
    name: 'InputSearchBdd',
    props: {
        modelValue: {
            type: [String, Number],
            default: ''
        },
        type: {
            type: String,
            default: 'text' // Vous pouvez changer ce type par défaut selon les besoins
        },
        placeholder: {
            type: String,
            default: ''
        },
        inputClass: {
            type: String,
            default: '' // Permet de passer des classes CSS personnalisées
        }
    },
    emits: ['update:modelValue'] // Pour supporter v-model
};
</script>
  
<style scoped>


/* Styles spécifiques à Input */
</style>
  
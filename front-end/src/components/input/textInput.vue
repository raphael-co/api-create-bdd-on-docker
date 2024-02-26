<template>
    <div class="input-container">
        <label v-if="label">{{ label }}</label>
        <input :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder" :class="inputClass" />
    </div>
</template>
  
<script>
export default {
    name: 'InputComponent',
    props: {
        label: {
            type: String,
            default: ''
        },
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
  .input-container {
    margin-bottom: 1rem;
  }

input[type=text],
input[type=password] {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

/* Styles spécifiques à Input */
</style>
  
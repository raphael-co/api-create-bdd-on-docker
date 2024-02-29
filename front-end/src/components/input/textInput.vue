<template>
    <div class="input-container">
        <label v-if="label">{{ label }}</label>
        <input class="custom-input" :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder"/>
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
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        inputClass: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue']
};
</script>
  
<style scoped>
.input-container {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
}

.custom-input {
    width: 100%;
    padding: 0.5rem;
    margin-top: 0.25rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}
.custom-input:focus {
    border-color: #4169e1;
}
</style>
  
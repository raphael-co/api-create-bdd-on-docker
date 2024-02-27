<template>
    <div>
        <label for="price" class="custom-label">{{ label }}</label>
        <div class="input-container">
            <input type="text" v-model="inputValue" @input="emitInputValue" name="price" id="price" class="custom-input" :placeholder="placeholder">
        </div>
    </div>
</template>
  
<script>
export default {
    name: "InputForm",
    props: {
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            inputValue: ''
        };
    },
    methods: {
        emitInputValue() {
            this.$emit('updateValue', this.inputValue);
        }
    }
}
</script>

  
<style>
.custom-label {
    display: block;
    font-size: 0.875rem;
    font-weight: medium;
    line-height: 1.5;
    color: #1f2937;
}

.input-container {
    position: relative;
    margin-top: 8px;
    border-radius: 0.375rem;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    display: flex;
}

.currency-symbol {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    padding-left: 12px;
    pointer-events: none;
    color: #6b7280;
}

.custom-input {
    display: block;
    padding: 0.375rem 0.875rem;
    padding-left: 28px;
    padding-right: 80px;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #1f2937;
    background-color: transparent;
    border: none;
    border-radius: 0.375rem;
    box-shadow: inset 0 0 0 1px #d1d5db;
    width: 100%;
    outline: 2px solid transparent;
    outline-offset: 2px;
}

.custom-input::placeholder {
    color: #9ca3af;
}

.custom-input:focus {
    box-shadow: inset 0 0 0 2px #4f46e5;
    /* focus:ring-2 focus:ring-inset focus:ring-indigo-600 */
}
</style>
  
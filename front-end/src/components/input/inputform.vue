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

</style>
  
<template>
    <div class="dropdown-container">
        <button @click="toggleDropdown" ref="dropdownButton" class="dropdown-button">
            {{ selectedOption || 'Select an option' }}
            <span class="dropdown-arrow">&#9662;</span>
        </button>
        <div v-if="isDropdownOpen && options.length > 0" ref="dropdownMenu" class="dropdown-menu">
            <ul style="width: 100%;">
                <li v-for="option in filteredOptions" :key="option" @click="selectOption(option)"
                    :class="{ 'selected': option === selectedOption }">
                    {{ option }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "AssignmentDropdown",
    props: {
        options: {
            type: Array,
            default: () => []
        },
        selectedOption: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isDropdownOpen: false,
        };
    },
    computed: {
        filteredOptions() {
            return this.options.filter(option => option !== this.selectedOption);
        }
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },

    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        selectOption(cardLabel) {
            this.$emit('selectOptions', cardLabel);
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        handleClickOutside(event) {
            const menu = this.$refs.dropdownMenu;
            const button = this.$refs.dropdownButton;

            if (menu && !menu.contains(event.target) && button && !button.contains(event.target)) {
                this.isDropdownOpen = false;
            }
        }
    }
}
</script>
  
<style>

</style>
  
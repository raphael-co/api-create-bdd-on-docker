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
.dropdown-container {
    position: relative;
    width: 200px;
}

.dropdown-button {
    width: 100%;
    text-align: left;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    font-size: 15px;
}

.dropdown-arrow {
    float: right;
}

.dropdown-menu {
    top: 50px;
    position: absolute;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
}

.dropdown-menu ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.dropdown-menu ul li {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.dropdown-menu ul li:last-child {
    border-bottom: none;
}

.dropdown-menu ul li {
    text-decoration: none;
    color: #333;
    display: flex;
    align-items: center;
    font-size: 15px;
}

.dropdown-menu ul li.selected {
    background-color: #007bff;
    color: white;
}

.dropdown-menu ul li.selected a {
    color: white;
}

.dropdown-menu ul li:hover {
    background-color: #5046e5;
    color: #fff;
    cursor: pointer;
}

.option-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}
</style>
  
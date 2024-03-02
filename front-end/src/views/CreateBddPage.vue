<template>
    <div class="createBdd-page">
        <div>
            <HeaderComp />
        </div>
        <div>
            <h2>
                Create Database
            </h2>
        </div>
        <div class="createBdd-form">
            <CardsSelect :cards="cards" @selectCard="selectCard" :selected="selected" />
            <div class="dropdown">
                <AssignmentDropdown :options="options" :selectedOption="selectedOption" @selectOptions="selectOptions" />
            </div>
            <div>
                <InputForm label="Name" placeholder="Name" @updateValue="handleInputValueName" />
            </div>
            <div>
                <InputForm label="Bdd name" placeholder="Bdd name" @updateValue="handleInputValueBddName" />
            </div>
            <div class="dropdown">
                <button class="btnCreate" @click="createdatabase()">Create Database</button>
            </div>
        </div>
    </div>
</template>
  
<script>
import HeaderComp from '../components/header/header.vue';
import CardsSelect from '../components/card/cardsSelect.vue';
import AssignmentDropdown from '../components/input/dropdown.vue';
import InputForm from '../components/input/inputform.vue';
import { useRouter } from 'vue-router';
import { showToast } from "../request/userService";
import { bddService } from "../request/bddService";

export default {
    name: 'CreateBddPage',
    components: {
        HeaderComp,
        CardsSelect,
        AssignmentDropdown,
        InputForm
    },
    data() {
        return {
            selected: null,
            selectedOption: null,
            postgresVersion: ['16', '15', '14', "13", "12"],
            mariadbVersion: ['10.11', '10.10', '10.9', '10.8', '10.7', '10.6', '10.5', '10.4'],
            bddName: '',
            name: '',
            cards: [
                {
                    label: "PostgreSQL",
                    description: "Open-source object-relational database with 1 GB storage.",
                    type: "postgres",
                    storage: "1 GB"
                },
                {
                    label: "MariaDB",
                    description: "Open-source relational database with 1 GB storage, MySQL fork.",
                    type: "mariadb",
                    storage: "1 GB"
                }
            ],
            options: []
        };
    },
    methods: {
        selectCard(cardLabel) {
            this.selected = cardLabel;
            this.options = [];
            this.selectedOption = null;
            if (cardLabel === 'postgres') {
                this.options = this.postgresVersion
            } else if (cardLabel === 'mariadb') {
                this.options = this.mariadbVersion
            }
        },
        handleInputValueBddName(value) {
            this.bddName = value
        },
        handleInputValueName(value) {
            this.name = value
        },
        selectOptions(option) {
            this.selectedOption = option;
        },
        createdatabase() {
            if (!this.name || !this.bddName || !this.selected || !this.selectedOption) {
                showToast("Please fill all the fields", "error", 5000);
            } else if (this.bddName.length < 6) {
                showToast("databaseName must be at least 6 characters long", "error", 5000);
            } else if (this.name.length < 6) {
                showToast("name must be at least 6 characters long", "error", 5000)
            } else {
                bddService.createDatabase({
                    name: this.name,
                    databaseName: this.bddName,
                    type: this.selected,
                    versionBdd: this.selectedOption
                }, this.router);
            }
        }
    }, setup() {
        const router = useRouter();

        return {
            router
        };
    }
}
</script>
  
  
<style scoped>

</style>
  
<template>
    <div v-if="cards" class="cardsSlect-group">
        <div v-for="card in cards" :key="card.label"
            :class="{ 'cardsSlect': selected === card.type, 'cardsNoSlect': selected !== card.type }"
            @click="selectCard(card.type)">
            <span class="cardsSelectLabel cardsText">{{ card.label }}</span>
            <span class="cardsSelectDescription cardsText">{{ card.description }}</span>
            <span class="cardsSelectStorage cardsText">{{ card.storage }}</span>
            <span v-if="selected === card.type" class="cardscCheck">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" fill="currentColor"
                    aria-hidden="true" class="h-6 w-6 text-black">
                    <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clip-rule="evenodd"></path>
                </svg>
            </span>
        </div>
    </div>
</template>
  
<script>
export default {
    name: 'CardsSelect',
    props: {
        cards: Array,
        selected: String
    },
    methods: {
        selectCard(cardLabel) {
            this.$emit('selectCard', cardLabel);
        }
    }
}
</script>
  
  
<style scoped>

</style>
  
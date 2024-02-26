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
.cardsSlect-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 100px;
}

.cardscCheck {
    position: absolute;
    top: 15px;
    right: 30px;
    color: #5046e5;
}

.cardsText {
    width: 100%;
    display: flex;
    align-items: center;
}

.cardsSelectLabel {
    color: #101827;
    display: flex;
}

.cardsSelectDescription {
    color: #6b7280;
}

.cardsSelectStorage {
    color: #101827;
    margin-top: 15px;
}

.cardsSlect {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    max-width: 268px;
    width: 100%;
    border: 2px solid;
    border-color: #5046e5;
    height: 80px;
    border-radius: 0.5rem;
    padding: 15px;
    cursor: pointer;
}

.cardsNoSlect {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    max-width: 268px;
    width: 100%;
    border: 1px solid;
    border-color: #706f7a;
    height: 80px;
    border-radius: 0.5rem;
    padding: 15px;
    cursor: pointer;
}

@media screen and (max-width: 900px) {
    .cardsSlect-group {
        gap: 20px;
    }
    
}
</style>
  
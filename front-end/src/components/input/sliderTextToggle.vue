<template>
    <div class="slider-container">
        <button class="btnInputTextToggle" @click="copyText"> <i class="far fa-copy"></i></button>
        <button :class="['btnInputTextToggle', 'btnInputTextToggleHide', classNamebuton]" @click="toggleText">
            <i :class="showText ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
        <span class="SpanInputTextToggle">
            <template v-if="showText">{{ text }}</template>
            <template v-else>
                <span v-for="n in text.length" :key="n" class="bullet-point">•</span>
            </template>
        </span>
    </div>
</template>
  
<script>
import { showToast } from '../../request/userService.js'
export default {
    name: 'TextToggle',
    props: {
        text: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showText: false,
            buttonText: 'See',
            classNamebuton: 'HideBtn'
        };
    },
    methods: {
        async copyText() {
            try {
                await navigator.clipboard.writeText(this.text);
                showToast('Text copied to clipboard!', "success");
            } catch (err) {
                showToast('Text copied to clipboard!', "error");
                alert('Failed to copy text.');
            }
        },
        toggleText() {
            this.showText = !this.showText;
            this.buttonText = this.showText ? 'Hide' : 'See';
            this.classNamebuton = this.showText ? 'SeeBtn' : 'HideBtn';
        }
    }
};
</script>
  
<style scoped>
.bullet-point {
    margin: 0 2px;
    /* Adjust the 2px value to increase or decrease spacing */
}

.btnInputTextToggle {
    border: none;
    width: 60px;
    height: 100%;
    cursor: pointer;
    /* background-color: white; */
    flex: 0 0 auto;
    /* Ne grandit pas, ne rétrécit pas, basé sur la largeur automatique */

}

.HideBtn {
    background-color: white;
}

.SeeBtn {
    background-color: #92a0c3;
}

.btnInputTextToggleHide {
    margin: 0px 0px 0px 1px;

}

.slider-container {
    width: 100%;
    max-width: 100%;
    /* Empêche l'expansion au-delà de la largeur du parent */
    display: flex;
    align-items: center;
    overflow-x: auto;
    /* Changez en hidden si vous préférez masquer le débordement */
    border-radius: 5px;
    border: 1.5px solid #d0dbf0;
    background: #d0dbf0;
}

.SpanInputTextToggle {
    padding: 0 10px;
    display: flex;
    align-items: center;
    background-color: #d0dbf0;
    font-size: large;
    color: #92a0c3;
    overflow-x: auto;
    white-space: nowrap;
    width: auto;
    height: 100%;

    /* flex-grow: 1; Ajoutez ceci pour permettre au span de prendre toute la largeur disponible */
}

.text-container,
.bullets-container {
    flex: 1;
    /* Permet aux conteneurs de texte et de bullets de prendre tout l'espace disponible */
    overflow: hidden;
    /* Empêche le débordement */
    white-space: nowrap;
}

.hidden {
    display: none;
    /* Cache l'élément */
}
</style>
  
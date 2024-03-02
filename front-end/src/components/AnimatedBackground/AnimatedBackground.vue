<template>
    <div class="area">
        <slot></slot> <!-- Placeholder pour le contenu injecté -->
        <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
</template>
  
<script>
export default {
    name: 'AnimatedBackground',
    // mounted() {
    //     this.updateDocumentHeight();
    //     window.addEventListener('resize', this.updateDocumentHeight);
    // },
    // beforeUnmount() { // Changé de beforeDestroy à beforeUnmount
    //     window.removeEventListener('resize', this.updateDocumentHeight);
    // },
    // methods: {
    //     updateDocumentHeight() {
    //         const totalHeight = `${document.documentElement.scrollHeight}px`;
    //         console.log(totalHeight);
    //         this.$el.style.setProperty('--total-height', totalHeight);
    //     }
    // }
};
</script>

  
<style scoped></style>
  
<template>
    <input type="checkbox" id="toggle_checkbox" @change="toggleTheme" ref="toggleCheckbox">

    <label for="toggle_checkbox">
        <div id="star">
            <div class="star" id="star-1">★</div>
            <div class="star" id="star-2">★</div>
        </div>
        <div id="moon"></div>
    </label>
</template>
  
<script>
export default {
    name: 'ToggleSwitchTheme',
    methods: {
        toggleTheme(event) {
            const isChecked = event.target.checked;
            this.setTheme(isChecked ? 'dark' : 'light');
        },
        setTheme(theme) {
            localStorage.setItem('theme', theme);
            this.applyThemeDirectly(theme); // Adjust this part to directly apply theme
        },
        applyThemeDirectly(theme) {
            const themeUrl = `${process.env.BASE_URL}css/${theme}.css`;

            // Update the href attribute of the link element
            const themeLink = document.getElementById('theme-style');
            if (themeLink) {
                themeLink.href = themeUrl;
            }
        },
        applyTheme() {
            const theme = localStorage.getItem('theme') || 'light'; // Default to 'light' if unspecified
            this.applyThemeDirectly(theme); // Adjusted to use a direct application method
        }
    },
    mounted() {
        this.applyTheme();
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            this.$refs.toggleCheckbox.checked = true;
        }
    },
}

</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
    user-select: none;
}

#toggle_checkbox {
    display: none;
}

label {
    display: block;
    position: relative;
    right: 0;
    left: 0;
    width: 116px;
    height: 30px;
    margin: 0 auto;
    background-color: #77b5fe;
    border-radius: 56px;
    cursor: pointer;
    transition: 0.3s ease background-color;
    overflow: hidden;
}

#star {
    position: absolute;
    top: 7px;
    left: 8px;
    width: 15px;
    height: 15px;
    background-color: #fafd0f;
    transform: scale(1);
    border-radius: 50%;
    transition: 0.3s ease top, 0.3s ease left, 0.3s ease transform, 0.3s ease background-color;
    z-index: 1;
}

#star-1 {
    position: relative;
}

#star-2 {
    position: absolute;
    transform: rotateZ(36deg);
}

.star {
    top: -7px;
    left: -5px;
    font-size: 25px;
    line-height: 28px;
    color: #fafd0f;
    transition: 0.3s ease color;
}

#moon {
    position: absolute;
    bottom: -52px;
    right: 3px;
    width: 28px;
    height: 24px;
    background-color: #transparent;
    border-radius: 50%;
    transition: 0.3s ease bottom;

}

#moon:before {
    content: "";
    position: absolute;
    top: -2px;
    bottom: 0;
    right: 8px;
    width: 28px;
    height: 30px;
    background-color: transparent;
    border-radius: 50%;
    transition: 0.3s ease bottom;
}

#toggle_checkbox:checked+label {
    background-color: #000;
}

#toggle_checkbox:checked+label #star {
    top: 3px;
    left: 90px;
    transform: scale(0.3);
    background-color: yellow;
}

#toggle_checkbox:checked+label .star {
    color: yellow;
}

#toggle_checkbox:checked+label #moon {
    bottom: 4px;
    rotate: 32deg;
    background-color: #fff;
}

#toggle_checkbox:checked+label #moon:before {
    background-color: #000;
}
</style>
  
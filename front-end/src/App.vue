<template>
  <div id="app">
    <div id="toast-container" class="toast-container"></div>
    <div id="loader" class="loader-container">
      <!-- Vous pouvez personnaliser le contenu du loader ici -->
      <span class="loader"></span>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Votre style global */
body {
  margin: 0;
  padding: 0;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.loader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  /* Par défaut, le loader n'est pas affiché */
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  z-index: 1000;
}

/* Classe pour rendre le loader visible */
.loader-container.show {
  display: flex;
}
.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  border: 3px solid;
  border-color: #FFF #FFF transparent transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  border: 3px solid;
  border-color: transparent transparent rgb(50, 50, 50) rgb(50, 50, 50);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotationBack 0.5s linear infinite;
  transform-origin: center center;
}
.loader::before {
  width: 32px;
  height: 32px;
  border-color: #FFF #FFF transparent transparent;
  animation: rotation 1.5s linear infinite;
}
    
@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
@keyframes rotationBack {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
    

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
}

/* Toast individuel */
.toast {
  background-color: #333;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  width: 200px;
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
  transform: translateX(100%);
}

.toast.success {
  background-color: #28a745;
}

.toast.error {
  background-color: #dc3545;
}

.toast.warning {
  background-color: #ffc107;
}

.toast.info {
  background-color: #17a2b8;
}

.toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast.hide {
  opacity: 0;
  transform: translateX(100%);
}</style>

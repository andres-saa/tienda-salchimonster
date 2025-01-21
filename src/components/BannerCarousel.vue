<template>


  <div class="container">

    <Button class="button-left" @click="changeBanner(-1)"> <i class="pi pi-angle-left"></i></Button>

    <div class="slider" :style="`transform: translate(${current_banner.x}%)`">

      <img v-for="img in foodBanners" :src="img.src" alt="" :key="img.x">

    </div>


    <Button class="button-right" @click="changeBanner(1)"> <i class="pi pi-angle-right"></i></Button>


  </div>

</template>

<script setup>
import { Button } from 'primevue';
import { ref } from 'vue';
import { onBeforeUnmount } from 'vue';


const foodBanners = ref({
  1: {
    name: "Banner 1",
    src: "/images/banners/banner-0.jpeg",
    x: 0,
    index: 1
  },
  2: {
    name: "Banner 2",
    src: "/images/banners/banner-1.jpeg",
    x: -100,
    index: 2
  },
  3: {
    name: "Banner 3",
    src: "/images/banners/banner-2.jpeg",
    x: -200,
    index: 3
  },
  4: {
    name: "Banner 4",
    src: "/images/banners/banner-3.jpeg",
    x: -300,
    index: 4
  },

})


const current_banner = ref({
  ...foodBanners.value[1]
},)

let last = 1

const changeBanner = (dir) => {
  const max_value = Object.keys(foodBanners.value).length - 1; // Máximo número de banners
  const min_value = 1; // Índice mínimo

  // Actualizar el índice del banner, asegurándose de que se mantenga en los límites
  let newIndex = current_banner.value.index + dir;

  if (newIndex > max_value) {
    // return; // Salir si el índice está fuera de los límites
    const newv = {
      name: foodBanners.value[last].name,
      src: foodBanners.value[last].src,
      x: -(newIndex + 1) * 100,
      index: newIndex + 1
    }

    // console.log(newv)
    foodBanners.value[`${newIndex + 1}`] = { ...newv }
    last += 1

  }

  if (newIndex < min_value) {
    return; // Salir si el índice está fuera de los límites
  }

  else {
    current_banner.value = foodBanners.value[newIndex];

  }

  // Actualizar el banner actual con el nuevo índice
};




const intervalId = setInterval(() => {
  changeBanner(1);
}, 3000); // 3000 milisegundos = 3 segundos

// Limpiar el intervalo cuando el componente se desmonta
onBeforeUnmount(() => {
  clearInterval(intervalId);
});


</script>

<style scoped>
img {
  width: 100%;
  min-width: 100%;
  aspect-ratio: 16/7;
  object-fit: cover;
}

.slider {
  display: flex;
  z-index: -1;
  transition: all .3s ease;

}

i {
  font-size: xx-large;
}

.container {
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 0rem;
}

.button-left {
  position: absolute;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  left: 1rem;
  padding: .5rem;
  background-color: #00000070;
  /* color: var(--p-primary-color); */
  border: none;
  color: white;
}





.button-right {
  position: absolute;
  aspect-ratio: 1 / 1;
  background-color: #00000070;
  /* color: var(--p-primary-color); */
  color: white;
  border: none;
  border-radius: 50%;
  right: 1rem;
  padding: .5rem;
}



@media (width < 1100px) {
  .button-right {

    right: .5rem;

  }

  .button-left {

    left: .5rem;

  }



}
</style>

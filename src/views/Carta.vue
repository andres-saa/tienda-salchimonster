<template>
    <!-- Diálogo con selección de carta -->
    <Dialog 
        :visible="visibles"
        modal
        style="max-width: 90%;"
        :dismissableMask="false"
        :closeOnEscape="false"
        :closable="false" 
    >
        <div class="dialog-content">
            <!-- Botón para carta de Colombia -->
            <Button 
                class="p-button-rounded  selector-btn" 
                @click="selectCarta(1)" 
            >
                <!-- Imagen de la bandera dentro del botón -->
             
                    <img
                        src="/images/menu/colombia_flag.jpg"
                        alt="Bandera de Colombia" 
                        class="flag-icon" 
                    />
         
                Colombia
            </Button>
            
            <!-- Botón para carta de New Jersey -->
            <Button 
                class="p-button-rounded  selector-btn" 
                @click="selectCarta(2)"
            >
                <!-- Imagen de la bandera dentro del botón -->
        
                    <img
                        src="/images/menu/jersey_flag.jpg"
                        alt="Bandera de New Jersey" 
                        class="flag-icon"
                    />
        
                New Jersey
            </Button>
        </div>
    </Dialog>

    <!-- Carta de Colombia (la más larga) -->
    <div v-if="carta === 1">
        <div class="image-gallery">
            <img 
                v-for="i in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
                :key="'colombia-' + i"
                :src="`/images/menu/menucito${i}.jpeg`"
                :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
                alt="Menucito Colombia" 
                style="margin: 0; padding: 0;"
            />
        </div>
    </div>

    <!-- Carta de New Jersey -->
    <div v-else-if="carta === 2">
        <div class="image-gallery">
            <img 
                v-for="i in [1, 2, 3, 4, 5]" 
                :key="'newjersey-' + i"
                :src="`/images/menu/${i}.jpeg`"
                :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
                alt="Menucito New Jersey"
                style="margin: 0; padding: 0;"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const carta = ref(1)      // Controla cuál carta se muestra (1 = Colombia, 2 = New Jersey)
const visibles = ref(true) // Controla la visibilidad del diálogo

// Suponiendo que tienes un modo de detectar si es móvil:
const isMobile = false

/**
 * Selecciona la carta y cierra el diálogo.
 * @param {number} num - 1 (Colombia) o 2 (New Jersey)
 */
const selectCarta = (num) => {
  carta.value = num
  visibles.value = false // Cierra el diálogo al hacer la selección
}
</script>

<style scoped>
/* Contenedor general de la galería de imágenes */
.image-gallery {
    margin-top: 0rem;
    margin-bottom: 0;
    padding-bottom: 0;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
}

.horizontal-image {
    width: 100%;
    margin: 0;
    padding: 0;
}

.vertical-image {
    width: 100%;
    margin: 0;
    padding: 0;
}

/* Contenido del diálogo (para ubicar los botones) */
.dialog-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
    gap: 1rem;
}

/* Botones de selección */
.selector-btn {
    width: 140px;
    height: 140px;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

button{
    background-color: transparent;
    color: black;
    font-weight: bold;
    border: none;
    transition: all ease 0s;
    padding-top: 1.5rem;
}

button:hover{
    /* box-shadow: 0 0 1rem #00000020;
    outline:  2px solid #00000020; */
    background-color: yellow;
    border-radius: .3rem;
}

/* Imagen de la bandera dentro del botón */
.flag-icon {
    width: 100px;
    height: 100px;
    object-fit: cover;
    /* margin-right: 0.5rem; */
    border-radius: .3rem; /* Ajusta el espacio entre la imagen y el texto */
}
</style>

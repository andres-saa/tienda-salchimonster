<template>
  <!-- Diálogo principal: Selección de país -->
  <Dialog
      :visible="showCountryDialog"
      modal
      style="max-width: 90%;"
      :dismissableMask="false"
      :closeOnEscape="false"
      :closable="false"
  >
      <div class="dialog-content">
          <!-- Botón para carta de Colombia -->
          <Button
              class="p-button-rounded selector-btn"
              @click="selectCountry(1)"
          >
              <img
                  src="/images/menu/colombia_flag.jpg"
                  alt="Bandera de Colombia"
                  class="flag-icon"
              />
              Colombia
          </Button>

          <!-- Botón para carta de New Jersey -->
          <Button
              class="p-button-rounded selector-btn"
              @click="selectCountry(2)"
          >
              <img
                  src="/images/menu/jersey_flag.png"
                  alt="Bandera de New Jersey"
                  class="flag-icon"
              />
              New Jersey
          </Button>
      </div>
  </Dialog>

  <!-- Segundo diálogo: Selección de idioma (solo aparece cuando se ha elegido New Jersey) -->
  <Dialog
      :visible="showLanguageDialog"
      modal
      style="max-width: 90%;"
      :dismissableMask="false"
      :closeOnEscape="false"
      :closable="false"
  >
      <div class="dialog-content">
          <Button
              class="p-button-rounded selector-btn"
              @click="selectLanguage('en')"
          >
              <img
                  src="/images/menu/jersey_flag.png"
                  alt="Bandera de Estados Unidos"
                  class="flag-icon"
              />
              English
          </Button>

          <Button
              class="p-button-rounded selector-btn"
              @click="selectLanguage('es')"
          >
              <img
                  src="/images/menu/spain_flag.webp"

                  alt="Bandera de Colombia"
                  class="flag-icon"
              />
              Español
          </Button>
      </div>
  </Dialog>




<div style="background-color: var(--p-primary-color);min-height: 120vh;padding: 0;">
    <!-- Carta de Colombia -->
    <div v-if="carta === 'colombia'">
      <div class="image-gallery">
          <img
              v-for="i in [1,2,3,4,5,6,7,8,9]"
              :key="'colombia-' + i"
              :src="`/images/menu/colombia/${i}.jpeg`"
              :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
              alt="Menucito Colombia"
          />
      </div>
  </div>

  <!-- Carta de New Jersey en Español -->
  <div v-else-if="carta === 'jersey' && jerseyLang === 'es'">
      <div class="image-gallery">
          <!-- Ajusta estas rutas según tus nombres de archivos para NJ en español -->
          <img
              v-for="i in [1,2,3,4,5,6,7,8]"
              :key="'nj-es-' + i"
              :src="`/images/menu/jersey/es/${i}.jpeg`"
              :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
              alt="Menucito New Jersey Español"
          />
      </div>
  </div>

  <!-- Carta de New Jersey en Inglés -->
  <div v-else-if="carta === 'jersey' && jerseyLang === 'en'">
      <div class="image-gallery">
          <!-- Ajusta estas rutas según tus nombres de archivos para NJ en inglés -->
          <img
              v-for="i in [1,2,3,4,5,6,7,8]"
              :key="'nj-en-' + i"
              :src="`/images/menu/jersey/en/${i}.jpeg`"
              :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
              alt="Menucito New Jersey Inglés"
          />
      </div>
  </div>
</div>

</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

// Controla la carta final seleccionada: "colombia" o "jersey"
const carta = ref(null)

// Dialog 1: Selección de país
const showCountryDialog = ref(true)

// Dialog 2: Selección de idioma (para NJ)
const showLanguageDialog = ref(false)

// Idioma seleccionado para New Jersey: "es" o "en"
const jerseyLang = ref(null)

// Suponiendo que tienes un modo de detectar si es móvil:
const isMobile = false

/**
* Selecciona el país.
* Si es Colombia, se cierra el primer diálogo y se muestra la carta directamente.
* Si es New Jersey, se abre el segundo diálogo para escoger el idioma.
*/
const selectCountry = (num) => {
if (num === 1) {
  carta.value = 'colombia'
  showCountryDialog.value = false
} else {
  // New Jersey
  showCountryDialog.value = false
  showLanguageDialog.value = true
}
}

/**
* Selecciona el idioma de New Jersey y muestra la carta correspondiente.
*/
const selectLanguage = (lang) => {
jerseyLang.value = lang
carta.value = 'jersey'
showLanguageDialog.value = false
}
</script>

<style scoped>
.image-gallery {
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.horizontal-image, .vertical-image {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Contenido del diálogo (para ubicar los botones) */
.dialog-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0rem;
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
  text-align: center;
}

button {
  background-color: transparent;
  color: black;
  font-weight: bold;
  border: none;
  transition: all ease 0s;
  padding-top: 1rem;
}

button:hover {
  background-color: yellow;
  border-radius: 0.3rem;
}

/* Imagen de la bandera dentro del botón */
.flag-icon {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.3rem;
}
</style>

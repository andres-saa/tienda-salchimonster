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

  <!-- Diálogo secundario para selección de idioma (sólo para New Jersey) -->
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

  <!-- Contenedor principal: Muestra la carta obtenida del GET -->
  <div style="background-color: var(--p-primary-color); min-height: 120vh; padding: 0;">
      <!-- Se muestra cuando se ha seleccionado país/idioma y se obtuvo el menú activo -->
      <div v-if="activeMenu">
          <div class="image-gallery">
              <img
                  v-for="card in activeMenu.cartas"
                  :key="card.id"
                  :src="`${URI}/read-photo-product/${card.img_identifier}`"
                  :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
                  :alt="`Menucito ${activeMenu.name}`"

              />
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { URI } from '@/service/conection'
// --- Estados de selección ---
const carta = ref(null)         // "colombia" o "jersey"
const jerseyLang = ref(null)     // "es" o "en" para NJ

// Diálogos para seleccionar país e idioma
const showCountryDialog = ref(true)
const showLanguageDialog = ref(false)

// --- Data del menú proveniente del backend ---
const menuData = ref([])

// Placeholder por si alguna carta no tiene img_identifier
const placeholderImage = '/images/placeholder.jpeg'

// Definimos la URI base para las imágenes (ajusta este valor según tu endpoint)

// --- Detectar ancho de pantalla para la responsividad ---
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 600)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

// --- Función para obtener datos desde el backend ---
const fetchMenuData = async () => {
  try {
    // Cambia la URL por la de tu backend
    const response = await fetch(`${URI}/cartas-all`)
    menuData.value = await response.json()
  } catch (error) {
    console.error('Error fetching menu data:', error)
  }
}

// --- Funciones de selección del diálogo ---
const selectCountry = (num) => {
  if (num === 1) {
    carta.value = 'colombia'
    showCountryDialog.value = false
  } else {
    carta.value = 'jersey'
    showCountryDialog.value = false
    showLanguageDialog.value = true
  }
}

const selectLanguage = (lang) => {
  jerseyLang.value = lang
  showLanguageDialog.value = false
}

// --- Computed para determinar el menú activo ---
// Se filtra el menú de acuerdo a la selección y si se debe mostrar la versión vertical o horizontal.
const activeMenu = computed(() => {
  if (!menuData.value.length) return null

  if (carta.value === 'colombia') {
    // Para Colombia: si mobile (menor a 600px) se busca la versión vertical; en caso contrario horizontal.
    if (isMobile.value) {
      return menuData.value.find(item =>
        item.name.toLowerCase().includes('vertical') &&
        item.name.toLowerCase().includes('colombia')
      )
    } else {
      return menuData.value.find(item =>
        item.name.toLowerCase().includes('horizontal') &&
        item.name.toLowerCase().includes('colombia')
      )
    }
  } else if (carta.value === 'jersey') {
    // Para New Jersey: se toma en cuenta el idioma y luego se determina vertical/horizontal.
    if (jerseyLang.value === 'es') {
      if (isMobile.value) {
        return menuData.value.find(item =>
          item.name.toLowerCase().includes('vertical') &&
          item.name.toLowerCase().includes('nj') &&
          item.name.toLowerCase().includes('español')
        )
      } else {
        return menuData.value.find(item =>
          item.name.toLowerCase().includes('horizontal') &&
          item.name.toLowerCase().includes('nj') &&
          item.name.toLowerCase().includes('español')
        )
      }
    } else if (jerseyLang.value === 'en') {
      if (isMobile.value) {
        return menuData.value.find(item =>
          item.name.toLowerCase().includes('vertical') &&
          item.name.toLowerCase().includes('nj') &&
          item.name.toLowerCase().includes('ingles')
        )
      } else {
        return menuData.value.find(item =>
          item.name.toLowerCase().includes('horizontal') &&
          item.name.toLowerCase().includes('nj') &&
          item.name.toLowerCase().includes('ingles')
        )
      }
    }
  }
  return null
})

// --- onMounted: Inicializamos los datos y el listener para el resize ---
onMounted(() => {
  fetchMenuData()
  window.addEventListener('resize', updateWidth)
})
</script>

<style scoped>
.image-gallery {
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Las clases para las imágenes se aplican en función del ancho de pantalla */
.horizontal-image,
.vertical-image {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Estilos para el contenido de los diálogos */
.dialog-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
}

/* Estilos para los botones de selección */
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

/* Estilo para la imagen de la bandera dentro del botón */
.flag-icon {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.3rem;
}
</style>

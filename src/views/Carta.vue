<!-- CountryMenu.vue -->
<template>
  <!-- ░░░ Diálogo principal: Selección de país ░░░ -->
  <Dialog
    :visible="showCountryDialog"
    modal
    style="max-width:90%;"
    :dismissableMask="false"
    :closeOnEscape="false"
    :closable="false"
  >
    <div class="dialog-content">
      <Button class="p-button-rounded selector-btn" @click="selectCountry(1)">
        <img src="/images/menu/colombia_flag.jpg" alt="Bandera de Colombia" class="flag-icon" />
        Colombia
      </Button>

      <Button class="p-button-rounded selector-btn" @click="selectCountry(2)">
        <img src="/images/menu/jersey_flag.png" alt="Bandera de New Jersey" class="flag-icon" />
        New Jersey
      </Button>
    </div>
  </Dialog>

  <!-- ░░░ Diálogo secundario: idioma para New Jersey ░░░ -->
  <Dialog
    :visible="showLanguageDialog"
    modal
    style="max-width:90%;"
    :dismissableMask="false"
    :closeOnEscape="false"
    :closable="false"
  >
    <div class="dialog-content">
      <Button class="p-button-rounded selector-btn" @click="selectLanguage('en')">
        <img src="/images/menu/jersey_flag.png" alt="Bandera de EE.UU." class="flag-icon" />
        English
      </Button>
      <Button class="p-button-rounded selector-btn" @click="selectLanguage('es')">
        <img src="/images/menu/spain_flag.webp" alt="Bandera de España" class="flag-icon" />
        Español
      </Button>
    </div>
  </Dialog>

  <!-- ░░░ Contenedor principal ░░░ -->
  <div style="background-color:var(--p-primary-color);min-height:120vh;padding:0;">
    <div v-if="activeMenu">
      <div class="image-gallery">
        <img
          v-for="card in activeMenu.cartas"
          :key="card.id"
          :src="`${URI}/read-photo-product/${card.img_identifier}/1920`"
          :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"
          :alt="`Menú ${activeMenu.name}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import { URI } from '@/service/conection'

/* ───── Estados de selección ───── */
const carta      = ref(null)   // 'colombia' | 'jersey'
const jerseyLang = ref(null)   // 'es' | 'en'

const showCountryDialog  = ref(true)
const showLanguageDialog = ref(false)

/* ───── Datos del backend ───── */
const menuData = ref([])

/* ───── Responsividad ───── */
const windowWidth = ref(window.innerWidth)
const isMobile    = computed(() => windowWidth.value < 600)
const updateWidth = () => (windowWidth.value = window.innerWidth)

/* ───── Fetch menú ───── */
const fetchMenuData = async () => {
  try {
    const res = await fetch(`${URI}/cartas-all`)
    menuData.value = await res.json()
  } catch (e) {
    console.error('Error fetching menu data:', e)
  }
}

/* ───── Selección en diálogos ───── */
const selectCountry = num => {
  if (num === 1) {
    carta.value = 'colombia'
    showCountryDialog.value = false
  } else {
    carta.value = 'jersey'
    showCountryDialog.value  = false
    showLanguageDialog.value = true
  }
}
const selectLanguage = lang => {
  jerseyLang.value = lang
  showLanguageDialog.value = false
}

/* ───── Utilidades ───── */
const hasAll = (name, ...kw) => kw.every(k => name.toLowerCase().includes(k))

const itemHasImages = item =>
  Array.isArray(item.cartas) && item.cartas.some(c => c.img_identifier)

const firstMatch = combos => {
  for (const kw of combos) {
    const found = menuData.value.find(
      m => hasAll(m.name, ...kw) && itemHasImages(m)
    )
    if (found) return found
  }
  return null
}

/* ───── Menú activo con fallback cruzado ───── */
const activeMenu = computed(() => {
  if (!menuData.value.length || !carta.value) return null

  const primary   = isMobile.value ? 'vertical'   : 'horizontal'
  const secondary = isMobile.value ? 'horizontal' : 'vertical'

  // Idiomas en nombres ('español' / 'ingles')
  const prefLangKey =
    jerseyLang.value === 'es' ? 'español'
    : jerseyLang.value === 'en' ? 'ingles'
    : 'ingles'
  const otherLangKey = prefLangKey === 'español' ? 'ingles' : 'español'

  /* Reglas por país */
  const rulesCol = [
    [primary,   'colombia'],
    [secondary, 'colombia'],
    ['colombia']
  ]

  const rulesNJ = [
    [primary,   'nj', prefLangKey],
    [secondary, 'nj', prefLangKey],
    [primary,   'nj', otherLangKey],
    [secondary, 'nj', otherLangKey],
    ['nj']
  ]

  /* Fallback: se añade el otro país al final */
  const searchOrder =
    carta.value === 'colombia'
      ? [...rulesCol, ...rulesNJ]   // primero Colombia, luego NJ
      : [...rulesNJ, ...rulesCol]   // primero NJ, luego Colombia

  return firstMatch(searchOrder)
})

/* ───── Ciclo de vida ───── */
onMounted(() => {
  fetchMenuData()
  window.addEventListener('resize', updateWidth)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
.image-gallery {
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.horizontal-image,
.vertical-image {
  width: 100%;
  margin: 0;
  padding: 0;
}

/* Diálogos */
.dialog-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0;
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

/* Imagen de bandera en los botones */
.flag-icon {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.3rem;
}
</style>

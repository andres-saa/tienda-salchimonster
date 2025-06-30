<!-- CountryMenu.vue (versión completa) -->
<template>
  <!-- ░░░ Diálogos de selección (sin cambios) ░░░ -->
  <Dialog
    :visible="showCountryDialog" modal :dismissableMask="false"
    :closeOnEscape="false" :closable="false" style="max-width:90%">
    <div class="dialog-content">
      <Button class="p-button-rounded selector-btn" @click="selectCountry('colombia')">
        <img src="/images/menu/colombia_flag.jpg" class="flag-icon" alt="Bandera de Colombia" />
        Colombia
      </Button>
      <Button class="p-button-rounded selector-btn" @click="selectCountry('jersey')">
        <img src="/images/menu/jersey_flag.png" class="flag-icon" alt="Bandera de New Jersey" />
        New Jersey
      </Button>
    </div>
  </Dialog>

  <Dialog
    :visible="showLanguageDialog" modal :dismissableMask="false"
    :closeOnEscape="false" :closable="false" style="max-width:90%">
    <div class="dialog-content">
      <Button class="p-button-rounded selector-btn" @click="selectLanguage('en')">
        <img src="/images/menu/jersey_flag.png" class="flag-icon" alt="EE. UU." />
        English
      </Button>
      <Button class="p-button-rounded selector-btn" @click="selectLanguage('es')">
        <img src="/images/menu/spain_flag.webp" class="flag-icon" alt="España" />
        Español
      </Button>
    </div>
  </Dialog>

  <!-- ░░░ Galería ░░░ -->
  <div style="background-color:var(--p-primary-color);min-height:120vh;padding:0;">
    <div v-if="activeMenu">
      <div class="image-gallery">
        <img
          v-for="card in activeMenu.cartas"
          :key="card.id"
          :src="bigUrl(card.img_identifier)"
          :alt="`Menú ${activeMenu.name}`"
          :class="{ 'horizontal-image': !isMobile, 'vertical-image': isMobile }"


          @error="e => (e.target.src = plainUrl(card.img_identifier))"
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
import { useUserStore } from '@/store/user'

/* ───── Estado global ───── */
const user = useUserStore()

/* ───── Estados internos ───── */
const carta      = ref(null)  // 'colombia' | 'jersey'
const jerseyLang = ref(null)  // 'es' | 'en'
const showCountryDialog  = ref(true)
const showLanguageDialog = ref(false)

/* ───── Datos del backend ───── */
const menuData = ref([])

/* ───── Responsividad ───── */
const windowWidth = ref(window.innerWidth)
const isMobile    = computed(() => windowWidth.value < 600)
const updateWidth = () => (windowWidth.value = window.innerWidth)

/* ───── Helpers para URLs de imagen ───── */
const bigUrl   = id => `${URI}/read-photo-product/${id}/1920`
const plainUrl = id => `${URI}/read-photo-product/${id}`

/* ───── Fetch menú ───── */
const fetchMenuData = async () => {
  try { menuData.value = await (await fetch(`${URI}/cartas-all`)).json() }
  catch (e) { console.error('Error fetching menu data:', e) }
}

/* ───── Selección de país e idioma (sin cambios) ───── */
function selectCountry(target) {
  carta.value = target
  showCountryDialog.value = false

  if (target === 'colombia') {
    if (!user.lang?.name) {
      user.lang = { name: 'es', label: 'Español', flag: 'https://flagcdn.com/w20/co.png' }
    }
  } else {
    if (user.lang?.name === 'es' || user.lang?.name === 'en') {
      jerseyLang.value = user.lang.name
    } else {
      showLanguageDialog.value = true
    }
  }
}
function selectLanguage(lang) {
  jerseyLang.value = lang
  user.lang = lang === 'es'
    ? { name: 'es', label: 'Español', flag: 'https://flagcdn.com/w20/co.png' }
    : { name: 'en', label: 'English',  flag: 'https://flagcdn.com/w20/us.png' }
  showLanguageDialog.value = false
}

/* ───── Normalización y filtros ───── */
const normalize = s => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // sin tildes
  .replace(/_/g, ' ')                               // _ → espacio
  .replace(/\s+/g, ' ')                             // colapsa dobles espacios

const hasAll = (name, ...kw) =>
  kw.every(k => normalize(name).includes(normalize(k)))

const itemHasImages = m =>
  Array.isArray(m.cartas) && m.cartas.some(c => c.img_identifier)

const firstMatch = patterns => {
  for (const kw of patterns) {
    const hit = menuData.value.find(
      m => hasAll(m.name, ...kw) && itemHasImages(m)
    )
    if (hit) return hit
  }
  return null
}

/* ───── Menú activo con fallback ───── */
const activeMenu = computed(() => {
  if (!menuData.value.length || !carta.value) return null

  const primary   = isMobile.value ? 'vertical'   : 'horizontal'
  const secondary = isMobile.value ? 'horizontal' : 'vertical'

  const prefLang  = user.lang?.name === 'es' ? 'espanol' : 'ingles'
  const otherLang = prefLang === 'espanol' ? 'ingles' : 'espanol'

  const rulesCol = [
    [primary,   'colombia'],
    [secondary, 'colombia'],
    ['colombia']
  ]
  const rulesNJ = [
    [primary,   'nj', prefLang],
    [secondary, 'nj', prefLang],
    [primary,   'nj', otherLang],
    [secondary, 'nj', otherLang],
    ['nj']
  ]
  return firstMatch(carta.value === 'colombia'
    ? [...rulesCol, ...rulesNJ]
    : [...rulesNJ, ...rulesCol])
})

/* ───── Mounted / Unmounted ───── */
onMounted(() => {
  fetchMenuData()
  window.addEventListener('resize', updateWidth)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style scoped>
.image-gallery         { display:flex; flex-direction:column; margin:0; padding:0 }
.horizontal-image,
.vertical-image        { width:100%; margin:0; padding:0 }

/* diálogos y botones */
.dialog-content        { display:flex; flex-wrap:wrap; gap:1rem; justify-content:space-around }
.selector-btn          { width:140px; height:140px; display:flex; flex-direction:column;
                          justify-content:center; align-items:center; text-align:center; font-size:1rem }
button                 { background:transparent; color:black; font-weight:bold; border:none; padding-top:1rem }
button:hover           { background:yellow; border-radius:.3rem }
.flag-icon             { width:100px; height:100px; object-fit:cover; border-radius:.3rem }
</style>

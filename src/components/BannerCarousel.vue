<!-- BannerSlider.vue -->
<template>
  <div class="container">
    <div
      class="slider"
      :style="sliderStyle"
      @transitionend="onTransitionEnd"
    >
      <img
        v-for="(item, idx) in extendedBanners"
        :key="`slide-${idx}`"
        :src="`${URI}/read-photo-product/${item.img_identifier}`"
        :alt="item.title ?? `Banner ${idx}`"
      />
    </div>

    <!-- CONTROLES -->
    <Button v-if="banners.length > 1" class="button-left"  @click="manualPrev">
      <i class="pi pi-angle-left"></i>
    </Button>
    <Button v-if="banners.length > 1" class="button-right" @click="manualNext">
      <i class="pi pi-angle-right"></i>
    </Button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { fetchService } from '@/service/utils/fetchService'
import { URI }          from '@/service/conection'

/* ──────────────── ESTADO ──────────────── */
const banners       = ref([])
const currentIndex  = ref(1)         // 1er banner real
const transitionOn  = ref(true)
const canNavigate   = ref(true)
let   autoplayId    = null
let   resumeId      = null           // 🔸 para pausar 3 s tras clic

/* ──────────────── CONST ──────────────── */
const CSS_MS       = 300
const AUTOPLAY_MS  = 5000
const RESUME_PAUSE = 3000            // 🔸 3 s

/* ──────────────── CÁLCULOS ──────────────── */
// [último, …reales, primero]  → ilusión de infinito unidireccional
const extendedBanners = computed(() => {
  if (!banners.value.length) return []
  const first = banners.value[0]
  const last  = banners.value[banners.value.length - 1]
  return [last, ...banners.value, first]
})
const sliderStyle = computed(() => {
  const offset = -currentIndex.value * 100
  const t = transitionOn.value ? `${CSS_MS}ms ease` : '0ms'
  return `transform: translateX(${offset}%); transition: transform ${t};`
})

/* ──────────────── DATA ──────────────── */
async function loadBanners () {
  const data = await fetchService.get(`${URI}/banners`)
  banners.value = data.sort((a, b) => a.index - b.index)
  currentIndex.value = 1
}

/* ──────────────── AUTOPLAY ──────────────── */
function startAutoplay () {
  if (autoplayId || banners.value.length < 2) return
  autoplayId = setInterval(goNext, AUTOPLAY_MS)
}
function stopAutoplay () {
  clearInterval(autoplayId)
  autoplayId = null
}

/* ──────────────── NAVEGACIÓN ──────────────── */
function goNext () { transitionOn.value = true; currentIndex.value++ }
function goPrev () { transitionOn.value = true; currentIndex.value-- }

function pauseAndNavigate (fn) {
  if (!canNavigate.value) return
  canNavigate.value = false
  stopAutoplay()                          // 🔸 pausa inmediata
  clearTimeout(resumeId)                  // 🔸 reinicia temporizador
  fn()
}

function manualNext () { pauseAndNavigate(goNext) }
function manualPrev () { pauseAndNavigate(goPrev) }

/* ──────────────── TRANSICIÓN ──────────────── */
function onTransitionEnd () {
  const realLen = banners.value.length

  // Si “caemos” en el clone final: saltamos al 1 real sin animar
  if (currentIndex.value === realLen + 1) {
    transitionOn.value = false
    currentIndex.value = 1
  }
  // Si caemos en el clone inicial (prev): saltamos al último real
  if (currentIndex.value === 0) {
    transitionOn.value = false
    currentIndex.value = realLen
  }

  nextTick(() => { transitionOn.value = true }) // re-activa anim
  canNavigate.value = true                      // libera clics

  /* 🔸 reanudamos autoplay 3 s después del último clic */
  clearTimeout(resumeId)
  resumeId = setTimeout(() => {
    startAutoplay()
  }, RESUME_PAUSE)
}

/* ──────────────── CICLO DE VIDA ──────────────── */
onMounted(async () => {
  await loadBanners()
  await nextTick()
  startAutoplay()
})
onBeforeUnmount(() => {
  stopAutoplay()
  clearTimeout(resumeId)
})
</script>

<style scoped>
.container { overflow: hidden; position: relative; width: 100%; display: flex; align-items: center; }
.slider    { display: flex; }
img        { flex: 0 0 100%; width: 100%; aspect-ratio: 16/7; object-fit: cover; }

.button-left,
.button-right {
  position: absolute; top: 50%; transform: translateY(-50%);
  aspect-ratio: 1; border-radius: 50%; padding: 0.5rem;
  background: #00000070; color: #fff; border: none;
  display: flex; align-items: center; justify-content: center; z-index: 10;
}
.button-left  { left: 1rem; }
.button-right { right: 1rem; }
i { font-size: 1.8rem; }

@media (max-width: 600px) { img { aspect-ratio: 4/3; } }
</style>

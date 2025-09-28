<script setup>
import VistaProducto from './components/Dialogs/VistaProducto.vue';
import Toast from 'primevue/toast';
import { InputText } from 'primevue';
import siteDialog from './components/Dialogs/siteDialog.vue';
import SiteDialogSonando from './components/Dialogs/siteDialogSonando.vue';
import barra from './views/barra.vue';
import { useReportesStore } from './store/ventas';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { usecartStore } from './store/shoping_cart';
import { fetchService } from './service/utils/fetchService';
import { URI } from './service/conection';
import { useSitesStore } from './store/site';
import { useRoute } from 'vue-router';
import Dialog from 'primevue/dialog';
import siteDialogSites from './components/Dialogs/siteDialogSites.vue';
const cart = usecartStore();
const siteStore = useSitesStore();
const router = useRoute();
const reportes = useReportesStore();

// ───────── WebSocket config ─────────
const WS_URL = 'wss://sockets-service.salchimonster.com/ws/tiendas';
const wsRef = ref(null);
const reconnectAttempts = ref(0);
let reconnectTimeoutId = null;

// ───────── Diálogo de cuenta regresiva ─────────
const showReloadDialog = ref(false);
const countdown = ref(3);
const isStrongReload = ref(false);
let countdownTimerId = null;

async function clearAppData() {
  try { cart.$reset?.(); } catch {}
  try { siteStore.$reset?.(); } catch {}
  try { reportes.$reset?.(); } catch {}

  try { localStorage.clear(); } catch {}
  try { sessionStorage.clear(); } catch {}

  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch {}
}

function startReloadCountdown(strong = false) {
  if (showReloadDialog.value) return; // evitar múltiples diálogos

  isStrongReload.value = strong;
  showReloadDialog.value = true;
  countdown.value = 3;

  clearInterval(countdownTimerId);
  countdownTimerId = setInterval(async () => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(countdownTimerId);
      if (isStrongReload.value) {
        await clearAppData();
      }
      window.location.reload();
    }
  }, 1000);
}

function connectWS() {
  if (wsRef.value && (wsRef.value.readyState === WebSocket.OPEN || wsRef.value.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const ws = new WebSocket(WS_URL);
  wsRef.value = ws;

  ws.addEventListener('open', () => {
    reconnectAttempts.value = 0;
  });

  ws.addEventListener('message', async (event) => {
    const msg = typeof event.data === 'string' ? event.data.trim().toLowerCase() : '';
    if (msg === 'actualizar') {
      startReloadCountdown(false);
    } else if (msg === 'actualizar-fuerte') {
      startReloadCountdown(true);
    }
  });

  ws.addEventListener('close', () => {
    const attempt = Math.min(6, reconnectAttempts.value + 1);
    reconnectAttempts.value = attempt;
    const delay = Math.min(30000, 1000 * 2 ** attempt);
    clearTimeout(reconnectTimeoutId);
    reconnectTimeoutId = setTimeout(connectWS, delay);
  });

  ws.addEventListener('error', () => {
    try { ws.close(); } catch {}
  });
}

// ───────── Lógica inicial existente ─────────
onMounted(async () => {
  const site_id = siteStore.location.site?.site_id;
  const pe_id = router.query.usa === 'true' ? 16 : siteStore.location.site?.pe_site_id;

  const status = await fetchService.get(`${URI}/site/${site_id}/status`);
  if (status) {
    siteStore.status = status;
  }

  const data = await fetchService.get(`${URI}/tiendas/${pe_id || 1}/products`);
  cart.menu = data.categorias;

  connectWS();
});

onBeforeUnmount(() => {
  try {
    clearTimeout(reconnectTimeoutId);
    clearInterval(countdownTimerId);
    wsRef.value?.close(1000, 'component unmounted');
  } catch {}
});
</script>

<template>
  <div>
    <!-- Overlay de carga ya existente -->
    <div
      v-if="reportes.loading.visible"
      style="width: 100vw;transition: all ease .3s;  flex-direction: column;pointer-events:auto; background-color: #00000020; height: 100vh;position: fixed;display: flex;align-items: center;justify-content: center; left: 0;right: 0;z-index: 99999999;"
    >
      <div class="luz" style="aspect-ratio: 1 / 1;display: flex;justify-content: center;align-items: center;">
        <div class="girar" style="width: 150px;z-index: -1; height: 150px;padding: 3rem; background-color: var(--p-primary-color); position: absolute;"></div>
        <div class="imagen" style="display: flex;padding: 1rem;border-radius: .3rem; background-color: white;  gap: 1rem; flex-direction: column; align-items:center;">
          <img src="https://backend.salchimonster.com/read-photo-product/xai0dVnL" style="width:20vw ;max-width: 100px;" alt="">
          <h5 style="color: black;">Cargando...</h5>
        </div>
      </div>
    </div>

    <!-- Diálogo de cuenta regresiva -->
    <Dialog
      v-model:visible="showReloadDialog"
      modal
      :closable="false"
      :draggable="false"
      :breakpoints="{ '960px': '90vw', '640px': '95vw' }"
      style="width: 420px; max-width: 95vw;"
      header="Actualización disponible"
    >
      <div class="reload-dialog">
        <p class="reload-text">Esta página se recargará automáticamente en</p>
        <div class="countdown-bubble">{{ countdown }}</div>
        <small v-if="isStrongReload" class="hint">
          Realizando limpieza y actualización…
        </small>
      </div>
    </Dialog>

    <Toast></Toast>
    <router-view></router-view>
    <vista-producto></vista-producto>
    <!-- <InputText></InputText> -->
    <siteDialog></siteDialog>
    <siteDialogSites></siteDialogSites>
    <barra></barra>
    <!-- <SiteDialogSonando></SiteDialogSonando> -->
  </div>
</template>

<style scoped>
.girar{
  animation: girar infinite 1s linear;
}
@keyframes girar {
  100%{
    transform: rotate(360deg);
  }
}

/* Estilos del diálogo de cuenta regresiva */
.reload-dialog{
  display: grid;
  gap: .75rem;
  place-items: center;
  text-align: center;
  padding: .5rem 0;
}
.reload-text{
  font-size: 1rem;
  margin: 0;
}
.countdown-bubble{
  width: 90px;
  height: 90px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 2.25rem;
  font-weight: 900;
  border: 3px solid var(--p-primary-color, #6d28d9);
  animation: pop .8s ease-in-out infinite alternate;
}
.hint{
  opacity: .8;
}
@keyframes pop {
  from { transform: scale(1); }
  to { transform: scale(1.06); }
}
</style>

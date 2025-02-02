<script setup>

import VistaProducto from './components/Dialogs/VistaProducto.vue';
import Toast from 'primevue/toast';
import { InputText } from 'primevue';
import siteDialog from './components/Dialogs/siteDialog.vue';
import SiteDialogSonando from './components/Dialogs/siteDialogSonando.vue';
import barra from './views/barra.vue';
import { useReportesStore } from './store/ventas';
import { onMounted } from 'vue';
import { usecartStore } from './store/shoping_cart';
import { fetchService } from './service/utils/fetchService';
import { URI } from './service/conection';
import { useSitesStore } from './store/site';

const cart = usecartStore()
const siteStore = useSitesStore()

onMounted(async () => {
  const site_id = siteStore.location.site?.site_id
  const pe_id = siteStore.location.site?.pe_site_id
  const status = await fetchService.get(`${URI}/site/${site_id}/status`)
  if (status) {
    siteStore.status = status
  }
  const data = await fetchService.get(`${URI}/get-product-integration/6149/${pe_id || 1}`)
  cart.menu = data

})
</script>

<template>
  <div>
    <Toast></Toast>
    <router-view></router-view>
    <vista-producto></vista-producto>
    <!-- <InputText></InputText> -->
    <siteDialog></siteDialog>
    <barra></barra>
    <!-- <SiteDialogSonando></SiteDialogSonando> -->
  </div>
</template>

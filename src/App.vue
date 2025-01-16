<script setup>

import VistaProducto from './components/Dialogs/VistaProducto.vue';
import Toast from 'primevue/toast';
import { InputText } from 'primevue';
import siteDialog from './components/Dialogs/siteDialog.vue';
import SiteDialogSonando from './components/Dialogs/siteDialogSonando.vue';

</script>

<template>
  <div>
    <Toast></Toast>
    <router-view></router-view>
    <vista-producto></vista-producto>
    <!-- <InputText></InputText> -->
    <siteDialog></siteDialog>
    <!-- <SiteDialogSonando></SiteDialogSonando> -->
  </div>
</template>

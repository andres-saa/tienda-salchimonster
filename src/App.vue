<script setup>
import { Button } from 'primevue';
import { InputText } from 'primevue';
import Layout from './Layout/Layout.vue';
import VistaProducto from './components/Dialogs/VistaProducto.vue';
import Toast from 'primevue/toast';

</script>

<template>
  <div>
    <Toast></Toast>
    <router-view></router-view>
    <vista-producto></vista-producto>
  </div>
</template>

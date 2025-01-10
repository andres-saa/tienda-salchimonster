<template>
  <div>
    <banner-carousel></banner-carousel>
    <RouterView></RouterView>
    <BarraCategorias></BarraCategorias>
    <MenuSection></MenuSection>
  </div>

</template>

<script setup>
import BannerCarousel from '@/components/BannerCarousel.vue';
import BarraCategorias from '@/components/BarraCategorias.vue';
import MenuSection from './MenuSection.vue';
</script>

<style></style>

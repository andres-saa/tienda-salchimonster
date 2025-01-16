<template>
  <div class="container" :class="barraClase">
    <!-- Sección del Logo -->
    <div class="section-logo section">
      <div class="section-logo--buttons">
        <img style="cursor: pointer;" @click="router.push('/')" :class="route.fullPath == '/menu' ? 'logo2' : 'logo'"
          src="https://salchimonster.com/images/logo.png" alt="Logo" />
      </div>

      <i class="pi pi-map-marker" @click="siteStore.visibles.currentSite = true"></i>
      <div class="site-info" @click="siteStore.visibles.currentSite = true">

        <div class="site-info-status">
          <span class="city-name">{{ siteStore.location?.city?.city_name }}</span>
          <Tag class="status-tag">Abierto</Tag>
        </div>
        <div class="site-info-name">
          <span class="city-name"> Sede - {{ siteStore.location?.site.site_name }}</span>
        </div>
      </div>
    </div>

    <!-- Información para dispositivos móviles -->
    <!-- <div class="site-info-movil">
      <div class="site-info-status">
        <i class="pi pi-map-marker"></i>
        <span class="city-name">Cali</span>
        <Tag class="status-tag">Abierto</Tag>
      </div>
      <div class="site-info-name">
        <span class="city-name"> Sede - Chapinero</span>
      </div>
    </div> -->

    <!-- Menú de Navegación Principal -->
    <div class="section-menu section">
      <RouterLink v-for="button in buttons" :to="button.to" :key="button.name">
        <Button v-random-hover-color="{ opacity: .3 }" class="button-nav"
          :class="isButtonActive(button) ? 'active' : ''" :label="button.name"></Button>
      </RouterLink>
    </div>

    <!-- Icono del Carrito de Compras -->
    <div class="section-men secion">
      <!-- <RouterLink to="/cart">
        <Button text>
          <i class="pi pi-shopping-cart"></i>
        </Button>
      </RouterLink> -->

      <Button text @click="toggleMobileMenu">
        <b><i class="pi pi-bars"></i></b>
      </Button>
    </div>



    <!-- Botón de Menú para Dispositivos Móviles -->


    <!-- Menú Móvil (Opcional) -->
    <div style=" transition: all ease 0s;" :style="mobileMenuVisible ? 'right :0rem' : 'right:-15rem'"
      class="mobile-menu">
      <RouterLink v-for="button in buttons" :to="button.to" :key="button.name">
        <Button v-random-hover-color="{ opacity: .9 }" :icon="button.icon"
          style="color: white;width: 100%;justify-content: start; margin: .5rem 0;" class="button-nav"
          :class="isButtonActive(button) ? 'active' : ''" :label="button.name" @click="toggleMobileMenu"></Button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Button, Tag } from 'primevue';
import router from '@/router';
import { useSitesStore } from '@/store/site';




const siteStore = useSitesStore()

// Obtener la ruta actual
const route = useRoute();

// Definir los botones de navegación
const buttons = [
  { name: 'Menu', to: '/', icon: 'fa-solid fa-bars' },
  { name: 'Sedes', to: '/sedes', icon: 'fa-solid fa-building' },
  { name: 'Carta', to: '/menu', icon: 'fa-solid fa-list' },
  { name: 'Rastrear Pedido', to: '/rastrear-pedido', icon: 'fa-solid fa-truck' },
  { name: 'Franquicias', to: '/franquicias', icon: 'fa-solid fa-store' },
  { name: 'Ayuda/PQR', to: '/pqrs-user', icon: 'fa-solid fa-question-circle' },
  { name: 'Colaboraciones', to: '/colaboraciones', icon: 'fa-solid fa-music' },
  { name: 'Sonando', to: '/sonando', icon: 'fa-solid fa-music' },

  // Puedes agregar más botones según sea necesario
];

// Función para determinar si un botón está activo


const isButtonActive = (button) => route.fullPath === button.to;





// Mapeo de rutas a clases de estilo
const estilosPorRuta = {
  '/': 'barra-clara',
  '/sedes': 'barra-sedes',
  '/menu': 'barra-carta',
  '/rastrear-pedido': 'barra-clara',
  '/franquicias': 'barra-clara',
  '/pqrs-user': 'barra-clara',
  '/hola': 'barra-clara',
  '/sonando': 'barra-oscura',
  '/pqrs-user': 'barra-oscura',
  '/colaboraciones': 'barra-oscura'


  // Añade más rutas y sus clases correspondientes aquí
};

// Propiedad computada para la clase de la barra
const barraClase = computed(() => estilosPorRuta[route.fullPath] || 'barra-clara');

// Estado para el menú móvil
const mobileMenuVisible = ref(false);

// Función para alternar el menú móvil
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};
</script>

<style scoped>
.container {
  height: 3.5rem;
  padding: 0 3rem;
  display: flex;
  position: sticky;
  z-index: 999;
  top: 0;
  justify-content: space-between;
  box-shadow: 0 1rem 4rem #00000020;
  align-items: center;
  max-width: 100vw;
}

/* Estilos para la barra clara */
.barra-clara {
  background-color: white;
  color: black;
  /* Texto negro en barra-clara */
}

/* Estilos para la barra oscura */
.barra-oscura {
  background-color: rgba(0, 0, 0, 0.736);
  color: white;
  /* Texto blanco en barra-oscura */
}

/* Asegura que todos los textos dentro de barra-oscura sean blancos */
.barra-oscura .city-name,
.barra-oscura .requested-by,
.barra-oscura .button-nav,
.barra-oscura i {
  color: white;
}

.barra-sedes .city-name,
.barra-sedes .requested-by,
.barra-sedes .button-nav,
.barra-sedes i {
  color: white;
}

.barra-carta .city-name,
.barra-carta .requested-by,
.barra-carta .button-nav,
.barra-carta i {
  color: white;

}

.logo2 {
  filter: saturate(0) brightness(100);
  height: 50%;

}

.button-nav {
  min-width: max-content;
}

.barra-sedes {
  background-color: rgba(0, 0, 0, 0.736);
  color: white;
}

.city-name {
  margin-right: 1rem;
}

.barra-carta {
  background-color: var(--p-primary-color);
  color: white;
}

/* Secciones generales */
.section {
  display: flex;
  align-items: center;
}

/* Información para dispositivos móviles */
.site-info-movil {
  align-items: center;
  display: none;
}

.site-info {
  cursor: pointer;
}

/* Menú móvil (visualmente oculto por defecto) */
.mobile-menu {
  position: fixed;
  top: 3.5rem;
  right: 0;
  background-color: rgba(0, 0, 0, 0.83);
  width: 100%;
  max-width: 15rem;
  display: flex;
  flex-direction: column;
  /* border-radius: 0 0 0rem 1rem; */
  z-index: 999999999999999;
  padding: 1rem 2rem;
  /* box-shadow: 0rem 1rem 1rem rgba(0, 0, 0, 0.3); */
  /* min-height: 100vh; */
  max-height: min-content;

  /* pointer-events: hover; */
}

/* Responsividad */
@media (max-width: 1300px) {
  .section {
    display: none;
  }

  .container {
    padding: 0 1rem;
  }

  .site-info-movil {
    display: flex;
  }
}

/* Estilos del logo */
.section-logo {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  height: 50%;
}

/* Estilos de iconos */
i {
  font-size: x-large;
  color: var(--p-primary-color);
}

/* Botones en la sección del logo */
.section-logo--buttons {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0.9rem;
}

/* Estilos de las etiquetas de estado */
.status-tag {
  padding: 0 1rem;
}

/* Nombre de la ciudad */
.city-name {
  /* Hereda el color del contenedor */
}

/* Estilos de los botones de navegación */
.button-nav {
  border: none;
  border-radius: 0;
  color: black;
  /* Hereda el color del contenedor */
  background-color: transparent;
  height: calc(100% - 0.8rem);
  /* transition: box-shadow 0.3s, color 0.3s; */
}



.active {
  box-shadow: 0 0.4rem var(--p-primary-color);
  /* color: var(--p-primary-color); */
  /* font-weight: bold; */
}

/* Asegura que los botones activos en barra-oscura tengan texto blanco */
.barra-oscura .button-nav.active {
  color: white;
}
</style>

<template>

    <div class="main-container">
        <div class="container">
            <div v-for="sede in sedes.filter(sede => sede.city_id && sede.show_on_web && !sede.comming_soon)"
                :key="sede.site_id" class="sede-card">
                <div class="sede-image-container">
                    <img :src="currentImage(sede.site_id)" @load="loadHighResImage(sede.site_id)" class="sede-image"
                        alt="" />
                    <div class="sede-details">
                        <p class="sede-location">
                            <span class="sede-icon">
                                <i class="pi pi-map-marker"></i>
                            </span>
                            {{ cities?.filter(s => sede.city_id == s.city_id)[0]?.city_name }}
                            <span class="sede-address">{{ sede.site_address }}</span>
                        </p>
                        <p class="sede-name">SALCHIMONSTER {{ sede.site_name }}</p>
                        <p class="sede-phone">
                            <span class="sede-icon">
                                <i class="pi pi-whatsapp"></i>
                            </span>
                            {{ sede.site_phone }}
                        </p>
                        <div class="maps-icon">
                            <a :href="sede.maps">
                                <img class="maps-image"
                                    src="https://th.bing.com/th/id/R.68201495ac2d0c4d1cd3cbf6d25f6755?rik=l%2bilUrRDF30tdw&pid=ImgRaw&r=0"
                                    alt="Map icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { URI } from '@/service/conection';

const highResLoaded = ref({});
const currentImageSrc = ref({});

const lowResImage = (site_id) => `${URI}/read-product-image/96/site-${site_id}`;
const highResImage = (site_id) => `${URI}/read-product-image/600/site-${site_id}`;

const currentImage = (site_id) => {
    return currentImageSrc.value[site_id] || lowResImage(site_id);
};

const loadHighResImage = (site_id) => {
    const img = new Image();
    img.src = highResImage(site_id);
    img.onload = () => {
        currentImageSrc.value[site_id] = highResImage(site_id);
        highResLoaded.value[site_id] = true;
    };
};

const sedes = ref([]);
const cities = ref([]);

onMounted(() => getSites().then((data) => (sedes.value = data)));
onMounted(() => getCities().then((data) => (cities.value = data)));

const getSites = async () => {
    try {
        const response = await fetch(`${URI}/sites`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching sites:', error);
    }
};

const getCities = async () => {
    try {
        const response = await fetch(`${URI}/cities`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
};
</script>

<style scoped>
/* Contenedor principal */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    /* max-width: 1300px; */
    margin: 0rem auto;
    padding: 1rem;
}

/* Tarjeta de cada sede */
.sede-card {
    border-radius: 0.5rem;
    overflow: hidden;
}

/* Contenedor de la imagen y los detalles */
.sede-image-container {
    position: relative;
    height: min-content;
    box-shadow: 0 0 10px black;
    border-radius: 0.5rem;
}

/* Imagen de la sede */
.sede-image {
    width: 100%;
    height: 30rem;
    object-fit: cover;
    border-radius: 0.5rem;
    transition: opacity 0.5s ease-in-out;
}

.main-container {
    background-color: var(--p-primary-color);
    position: relative;
    padding: 0;
}

/* Detalles superpuestos */
.sede-details {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, black, transparent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1rem;
    border-radius: 0 0 0.5rem 0.5rem;
}

/* Detalles específicos */
.sede-location,
.sede-phone {
    color: white;
    font-size: 1rem;
}

.sede-location {
    font-weight: bold;
    color: var(--p-primary-color);
}

.sede-address {
    font-weight: normal;
    color: white;
    padding-left: 1rem;
}

.sede-name {
    color: white;
    font-weight: bold;
}

.sede-phone .sede-icon {
    font-weight: bold;
    color: rgb(58, 255, 58);
}

/* Icono de ubicación/maps */
.maps-icon {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 5rem;
    height: 5rem;
    background-color: transparent;
    display: flex;
    padding: 1rem;
}

.maps-image {
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    background-color: rebeccapurple;
}
</style>
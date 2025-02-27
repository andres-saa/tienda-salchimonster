<template>
    <Dialog :closable="store.location?.site?.pe_site_id > 0" style="width: 30rem;max-width: 96%;" v-model:visible="store.visibles.currentSite" header="Selección de sede"
        :modal="true" class="dialog">
        <div class="dialog-content">
            <b class="dialog-title">
                <!-- {{ store.location }} -->
            </b>

            <!-- Contenedor principal -->
            <div class="form-container">
                <!-- Selección de Ciudad -->
                <div class="form-group">
                    <div class="label-spinner">
                        <label for="city-dropdown" class="label">¿En qué ciudad te encuentras?</label>
                        <ProgressSpinner v-if="spinnersView.ciudad" class="spinner" strokeWidth="8" fill="var(--white)"
                            animationDuration=".5s" aria-label="Cargando ciudades" />
                    </div>
                    <Dropdown id="city-dropdown" v-model="currenCity" @click="resetNeighborhood" :options="cities"
                        optionLabel="city_name" placeholder="SELECCIONA UNA CIUDAD" class="dropdown" required />
                </div>


                <div class="form-group">
                    <div class="label-spinner">
                        <label for="neighborhood-dropdown" class="label">¿Cuál es tu barrio?</label>
                        <div v-if="spinnersView.barrio" class="loading-neighborhood">
                            <ProgressSpinner class="spinner" strokeWidth="8" fill="var(--white)" animationDuration=".5s"
                                aria-label="Buscando barrios" />
                            <p class="loading-text">Buscando barrios...</p>
                        </div>
                    </div>
                    <Dropdown id="neighborhood-dropdown" v-model="currenNeigborhood"
                        :disabled="!possibleNeigborhoods.length" :options="possibleNeigborhoods" optionLabel="name"
                        placeholder="Selecciona un barrio" filter filterPlaceholder="Escribe el nombre de tu barrio"
                        class="dropdown" required />
                </div>

                <!-- Vista Previa de la Sede -->
                <div class="image-container">
                    <img v-if="currenNeigborhood?.site_id"
                        :src="`${URI}/read-product-image/600/site-${currenNeigborhood?.site_id}`"
                        :class="{ 'default-image': currenNeigborhood.site?.name === 'default' }"
                        alt="Vista previa de la sede" />

                    <div v-if="currenNeigborhood?.site_id" class="image-overlay">
                        <p class="site-info">
                            <span class="brand-name">SALCHIMONSTER</span>
                            <span class="site-name">{{ currentSite?.site_name }}</span>
                        </p>
                    </div>
                </div>

                <!-- Botón Guardar -->
                <div class="button-container">
                    <Button label="Guardar" @click="setNeigborhood" :disabled="!currenNeigborhood?.name"
                        class="save-button" />
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { Dialog } from 'primevue';
import { Dropdown } from 'primevue';
import { Button } from 'primevue';
import { ProgressSpinner } from 'primevue';
import { URI } from '@/service/conection';
import { sitesService } from '@/service/site/sitesService';
import { useSitesStore } from '@/store/site';
import { usecartStore } from '@/store/shoping_cart';
import router from '@/router';

const store = useSitesStore();
const cart = usecartStore();

watch(
    () => store.location.site.site_id,
    () => {
        location.reload();
    }
);

const spinnersView = ref({ ciudad: false, barrio: false });
const cities = ref([]);
const currentSite = ref({});
const currenCity = ref(null);
const currenNeigborhood = ref({
    site: {
        name: 'default',
    },
});
const possibleNeigborhoods = ref([]);

const resetNeighborhood = () => {
    currenNeigborhood.value = { site: { site_name: 'default' } };
};

const changePossiblesNeigborhoods = async () => {
    if (currenCity.value && currenCity.value.city_id) {
        const neighborhoods = await getNeighborhoodsByCityId(currenCity.value.city_id);
        possibleNeigborhoods.value = neighborhoods;
    } else {
        possibleNeigborhoods.value = [];
    }
};

watch(currenCity, () => {
    changePossiblesNeigborhoods();
});

watch(
    currenNeigborhood,
    async () => {
        if (currenNeigborhood.value.site_id) {
            currentSite.value = await sitesService.getSiteById(currenNeigborhood.value.site_id);
        } else {
            currentSite.value = {};
        }
    },
    { immediate: true }
);

const setNeigborhood = async () => {
    const newLocation = {
        site: currentSite.value,
        neigborhood: currenNeigborhood.value,
        city: currenCity.value,
    };

    store.setLocation(newLocation);
    store.setVisible('currentSite', false);
    router.push('/');
};

const getCities = async () => {
    try {
        spinnersView.value.ciudad = true;
        const response = await fetch(`${URI}/cities`);
        if (response.ok) {
            const data = await response.json();
            cities.value = data;
        }
    } catch (error) {
        console.error('Error obteniendo ciudades:', error);
    } finally {
        spinnersView.value.ciudad = false;
    }
};

const getNeighborhoodsByCityId = async (city_Id) => {
    try {
        spinnersView.value.barrio = true;
        const response = await fetch(`${URI}/neighborhoods/by-city/${city_Id}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return [];
    } catch (error) {
        console.error('Error obteniendo barrios:', error);
        return [];
    } finally {
        spinnersView.value.barrio = false;
    }
};

onMounted(() => {
    getCities();
});
</script>

<style scoped>
/* Estilos del Dialog */
.dialog {

    background-color: white;
    position: relative;
    border-radius: 1rem;
    padding-top: 2rem;
}

/* Contenedor del contenido del dialog */
.dialog-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Título del dialog */
.dialog-title {
    color: black;
    margin-bottom: 1rem;
}

/* Contenedor del formulario */
.form-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Grupo de formulario */
.form-group {
    width: 100%;
    margin-bottom: 1.5rem;
}

/* Contenedor para label y spinner */
.label-spinner {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

/* Etiquetas */
.label {
    color: black;
    min-width: max-content;
}

/* Dropdown personalizado */
.dropdown {
    width: 100%;
}

/* Spinner */
.spinner {
    width: 20px;
    height: 20px;
}

/* Cargando barrios */
.loading-neighborhood {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Texto de carga */
.loading-text {
    color: black;
}

/* Contenedor de la imagen */
.image-container {
    width: 100%;
    height: 15rem;
    position: relative;
    margin-bottom: 1.5rem;
    border-radius: 0.5rem;
    overflow: hidden;
}

/* Imagen de la sede */
.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid #fff;
    border-radius: 0.2rem;
    background-color: #fff;
}

/* Imagen por defecto */
.default-image {
    filter: blur(10px);
    position: relative;
}

/* Superposición de la imagen */
.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    padding: 1rem;
    border-radius: 0.5rem;
}

/* Información de la sede */
.site-info {
    background-color: rgba(0, 0, 0, 0.7);
    text-align: center;
    width: 100%;
    font-weight: 500;
    padding: 0.5rem 0;
    color: #fff;
}

.brand-name {
    font-size: 1.25rem;
}

.site-name {
    text-transform: uppercase;
    font-size: 1.25rem;
}

/* Contenedor del botón */
.button-container {
    width: 100%;
}

/* Botón Guardar */
.save-button {
    width: 100%;
    padding: 10px 20px;
    border: none;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.save-button:disabled {
    background-color: #555;
    cursor: not-allowed;
}

.save-button:not(:disabled):hover {
    background-color: #333;
}

/* Responsividad */
@media (max-width: 500px) {
    .dialog {
        width: 90%;
    }

    .site-info {
        font-size: 1rem;
    }

    .brand-name,
    .site-name {
        font-size: 1rem;
    }
}
</style>

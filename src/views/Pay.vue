<template>
    <div class="finalizar-compra-container">
        <!-- <validate></validate> -->

        <p class="title">FINALIZAR COMPRA</p>


        <div style="margin: auto;max-width: 800px;">
            <div class="title " style="  margin: 3rem .5rem">
                <Tag severity="success " class="advertice"> El tiempo promedio de entrega es de 60 a 75 minutos, porvaor
                    tengalo en cuenta
                    antes de ordenar</Tag>
            </div>
        </div>
        <div class="form-grid">



            <div class="form-column">

                <div class="form-group">
                    <InputText id="username" placeholder="NOMBRE" v-model="user.user.name" />
                </div>

                <div class="form-group">
                    <InputText @click="siteStore.setVisible('currentSite', true)"
                        :modelValue="siteStore.location.neigborhood.name" id="neighborhood" placeholder="Barrio"
                        readonly />
                </div>

                <!-- {{ siteStore.visibles }} -->

                <div class="form-group">
                    <InputText v-model="user.user.address" id="address" placeholder="DIRECCION" />
                </div>

                <div class="form-group">
                    <InputMask v-model="user.user.phone_number" id="phone_number" mask="999 999 9999"
                        placeholder="TELEFONO" />
                </div>

                <div class="form-group">
                    <Select style="width: 100%;" v-model="user.user.payment_method_option" id="payment_method"
                        placeholder="METODO DE PAGO" :options="payment_method_options" optionLabel="name" />
                </div>

                <Textarea v-model="store.cart.order_notes" class="order-notes" placeholder="NOTAS:"></Textarea>

            </div>

            <resumen class="resumen-column"></resumen>

        </div>
    </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast';
import { ref, onMounted, watch } from 'vue';
import resumen from './resumen.vue';
import { usecartStore } from '@/store/shoping_cart';
import { useSitesStore } from '@/store/site';
import { useUserStore } from '@/store/user'
import { Textarea } from 'primevue';
import { Tag } from 'primevue';
import { InputText } from 'primevue';
import { InputNumber } from 'primevue';
import { InputMask } from 'primevue';
import { Select } from 'primevue';
import { fetchService } from '@/service/utils/fetchService';
import { URI } from '@/service/conection';
const store = usecartStore()
const siteStore = useSitesStore()
const user = useUserStore()

const payment_method_options = ref([])

onMounted(async () => {
    payment_method_options.value = await fetchService.get(`${URI}/payment_methods`)

    if (user.user.payment_method_option?.id != 7)
        siteStore.setNeighborhoodPrice()
    else {
        siteStore.setNeighborhoodPriceCero()
    }
})


watch(() => user.user.payment_method_option, (new_val) => {

    if (new_val.id == 7) {
        siteStore.current_delivery = siteStore.location.neigborhood.delivery_price
        siteStore.location.neigborhood.delivery_price = 0
    } else {
        siteStore.setNeighborhoodPrice()
    }
})
</script>

<style scoped>
/* Contenedor Principal */
.finalizar-compra-container {
    /* margin-top: 6rem; */
    padding: 0;
    /* padding-left: 0.5rem; */
    /* Equivale a px-2 */
    margin-bottom: 2rem;
    /* my-8 */
}

/* Título */
.title {
    text-align: center;
    font-size: 2rem;
    /* text-2xl */
    margin: 2rem 0;
    /* my-8 */
    font-weight: bold;
}



.advertice {
    animation: anim_status_tag 2s infinite ease;
    color: black;
    padding: 1rem;
    font-weight: 400;
    font-size: 1.1rem;
}


@keyframes anim_status_tag {
    20% {
        background-color: rgb(0, 255, 110);
    }

    50% {
        background-color: rgb(0, 255, 204);
        transform: scale(1.02);
    }

    80% {
        background-color: rgb(0, 255, 140);
    }
}

/* Grid del Formulario y Resumen */
.form-grid {
    display: grid;
    max-width: 800px;
    margin: 0 auto;
    grid-template-columns: 1fr;
    gap: 2rem;
}

/* Responsividad para Pantallas Medianas y Grandes */
@media (min-width: 768px) {
    .form-grid {
        grid-template-columns: 1fr 1fr;
    }
}

/* Columna del Formulario */
.form-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.25rem;
    /* p-1 */
    /* padding-left: 1rem; */
    /* md:px-4 */
}

/* Grupo de Formularios */
.form-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
}

/* Área de Notas */
.order-notes {
    height: 8rem;
    resize: none;
    width: 100%;
}

/* Columna del Resumen */
.resumen-column {
    /* Agrega estilos específicos si es necesario */
}

/* Eliminar estilos en línea de elementos enfocados */
*:focus {
    outline: none;
    border: none;
}

/* Ajustes adicionales si usas otros componentes */
input,
textarea,
select {
    width: 100%;
    box-sizing: border-box;
}

/* Personalizar Scrollbar si es necesario */
::-webkit-scrollbar {
    width: 1rem;
}

::-webkit-scrollbar-thumb {
    background-color: rgb(255, 0, 0);
    border-radius: 9px;
    border: 5px solid var(--primary-color);
    height: 10rem;
    width: 10rem;
}
</style>

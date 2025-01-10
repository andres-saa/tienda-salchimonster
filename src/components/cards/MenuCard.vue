<template>
    <div class="container shadow-3 col-12 product-card" @click="open(props.product)">
        <div class="imagen">
            <img loading="lazy" class="imagen-producto"
                :src="`https://img.restpe.com/${props.product.productogeneral_urlimagen}`" alt="" />
        </div>

        <div class="texto">
            <h3>
                <b>{{ props.product.productogeneral_descripcion }}</b>
            </h3>

            <!-- Contenedor interno que agrupa la descripción y el precio -->
            <div class="texto-content">
                <!-- Fila de arriba (vacía en este ejemplo, la puedes eliminar si no la usas) -->
                <div class="flex-row-center-space-between">
                    <!-- Ejemplo: puedes mostrar algo aquí si lo deseas -->
                </div>

                <!-- Descripción -->
                <span class="max-width-100">
                    {{ truncatedDescription.replace(/,\s*/g, ', ') }}
                </span>

                <!-- Fila de acciones (corazón y precio) -->
                <div class="flex-row-center-space-between">
                    <Button icon="pi pi-heart text-xl p-0 m-0" text rounded class="heart-button" />

                    <div class="flex-center-gap">
                        <h2 class="text-xl p-0 m-0 precio">
                            <b>
                                {{
                                    formatoPesosColombianos(
                                        props.product.productogeneral_precio ||
                                        props.product.lista_presentacion[0].producto_precio
                                    )
                                }}
                            </b>
                        </h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón flotante para añadir al carrito -->
        <Button class="add-to-cart-button" @click.stop="addToCart(props.product)" severity="danger" rounded
            icon="pi pi-plus text-xl fw-100" />
    </div>
</template>

<script setup>
import { formatoPesosColombianos } from '@/service/utils/formatoPesos';
import { computed, ref, onMounted } from 'vue';
import { usecartStore } from '@/store/shoping_cart';
import { Button } from 'primevue';

const store = usecartStore();

const highResLoaded = ref({});
const loaded = ref(false);

const addToCart = (productToAdd) => {
    // Evitamos que el evento haga click en el @click del contenedor principal
    // usando @click.stop en el Button
    store.addProductToCart(productToAdd);
};

const see = () => {
    loaded.value = true;
};

const open = (product) => {
    store.setCurrentProduct(product);
    store.setVisible('currentProduct', true);
};

const props = defineProps({
    product: {
        type: Object,
        default: {},
    },
    index: {
        type: Number,
        default: 12,
    },
});

onMounted(() => {
    highResLoaded.value = {};
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    loaded.value[img.dataset.index] = true; // Marca como cargado
                    observer.unobserve(img); // Detiene la observación una vez cargada la imagen
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('img.lazy').forEach((img, index) => {
        img.dataset.index = index; // Asigna un índice a cada imagen para controlar su estado
        observer.observe(img);
    });
});

const truncatedDescription = computed(() => {
    const description = props.product?.productogeneral_descripcionweb || '';
    return description.length > 100
        ? description.substring(0, 100) + '...'
        : description || '...';
});
</script>

<style scoped>
/* --- Clases nuevas para los estilos que antes estaban en línea --- */

/* Contenedor principal */
.product-card {
    border-radius: 0.5rem;
    width: 100%;
    height: 100%;
    position: relative;
    /* El resto de estilos los hereda de .container */
}

/* Contenedor “imagen” (estilos unificados) */
.imagen {
    display: flex;
    align-items: center;
}

/* Imagen principal */
.imagen-producto {
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: #fff;
    object-fit: cover;
    /* o 'contain' según tu preferencia */
    border-radius: 0.5rem;
}

/* Contenedor “texto” */
.texto {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Contenedor interior para flex y separación */
.texto-content {
    display: flex;
    gap: 1rem;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
}

/* Fila con “display: flex; justify-content: space-between; align-items: center;” */
.flex-row-center-space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Limita el ancho al 100% */
.max-width-100 {
    max-width: 100%;
}

/* Para alinear elementos con gap y centrarlos en fila */
.flex-center-gap {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Botón de corazón */
.heart-button {
    color: red;
}

/* Botón flotante (absolute) para añadir al carrito */
.add-to-cart-button {
    position: absolute;
    right: -1rem;
    top: -1rem;
}

/* --- Estilos existentes y/o adicionales --- */

.container {
    display: grid;
    gap: 1rem;
    /* Spacing between grid items */
    grid-template-columns: 1fr;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 1rem;
    box-shadow: 0 1rem 1rem rgba(160, 160, 160, 0.3);
    border-radius: 0.5rem;
    /* Curvatura específica */
    background-color: #fff;
    transition: all ease 0.3s;
    cursor: pointer;
}

.character {
    display: none;
}

.container:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 1.5rem 1rem rgba(160, 160, 160, 0.4);
}

/* Ajustes responsivos */
@media (width < 900px) {

    span,
    h3 {
        font-size: 12.5px;
    }

    h2 {
        font-size: 20px;
    }
}

@media (max-width: 2000px) {
    .container {
        grid-template-columns: 1fr 2fr;
        width: 100%;
    }

    .imagen,
    .texto {
        width: 100%;
    }

    .character {
        display: inline;
    }
}

/* Animación e imágenes */
.rating {
    width: 1rem;
}

.p-shadow {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
}

/* Transiciones para fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

/* Efecto cuando la imagen se ha cargado */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-100px);
    }

    to {
        opacity: 1;
    }
}

.cargado {
    opacity: 0;
    animation: fadeIn 0.1s ease-out forwards;
}
</style>
<template>
    <div class="p-1 my-5 md:my-0 col-12">
        <!-- Contenedor principal “Resumen” -->
        <div class="sticky-summary col-12 p-3 m-0">
            <h5><b>Resumen</b></h5>
            <h5><b>productos</b></h5>

            <!-- Lista de productos -->
            <div class="mb-0 pb-0 product-line" v-for="product in store.cart.products"
                :key="product.product.productogeneral_id">
                <div class="col-6 py-2 mb-0 m-0">
                    <h6 class="m-0">
                        <span class="span-minwidth"><b>{{ product.quantity }} </b></span>
                        {{ product.product.productogeneral_descripcion }}
                    </h6>

                    <h6 class="m-0 ml-3" v-for="i in product.product.lista_productobase" :key="i.producto_id">
                        -- <b>{{ parseInt(i.productocombo_cantidad * product.quantity) }}</b>
                        <span class="font-weight-400">{{ i.producto_descripcion }}</span>
                    </h6>
                </div>

                <div class="col-6 my-0 text-right py-2">
                    <h6 class="text-end">
                        {{ formatoPesosColombianos(product.total_cost) }}
                    </h6>
                </div>
            </div>

            <!-- Adicionales agrupados -->
            <div class="col-12 p-0 mt-1">
                <div class="p-0 mb-2 addition-group" v-for="(items, grupo) in agrupados" :key="grupo">
                    <div class="mb-0">
                        <span class="mb-1 text-center">
                            <b>{{ grupo }}</b>
                        </span>

                        <div class="addition-item" v-for="item in items" :key="item.aditional_item_instance_id">
                            <div class="addition-item-inner">
                                <span class="text adicion"><span><b>{{ item.quantity }}</b></span> {{ item.name
                                    }}</span>

                                <span v-if="item.price > 0" class="pl-2 text-sm">
                                    <b>{{ formatoPesosColombianos(item.price * item.quantity) }}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="p-0 mt-2" />

            <!-- Subtotales y totales -->
            <div class="grid summary-grid">
                <div class="col-6 my-0 py-0">
                    <span><b>Subtotal</b></span>
                </div>
                <div class="col-6 my-0 text-right py-0 text-end">
                    <span>
                        <b>{{ formatoPesosColombianos(store.cart.total_cost) }}</b>
                    </span>
                </div>

                <div class="col-6 my-0 py-0">
                    <span :style="siteStore.location.neigborhood.delivery_price == 0
                            ? 'text-decoration: line-through;'
                            : ''
                        "><b>Domicilio</b></span>
                </div>
                <div class="col-6 my-0 text-right py-0 text-end">
                    <!-- {{ siteStore.location }} -->
                    <span v-if="siteStore.location.neigborhood.delivery_price == 0" class="primary-color">
                        <b>
                            {{
                                route.path.includes('reservas')
                                    ? 'Ir a la sede'
                                    : 'Recoger en local'
                            }}
                        </b>
                    </span>
                    <span v-else>
                        <b>{{ formatoPesosColombianos(siteStore.location.neigborhood.delivery_price) }}</b>
                    </span>
                </div>
                <div class="col-6 my-0 py-0">
                    <span><b>Total</b></span>
                </div>
                <div class="col-6 my-0 text-right py-0 text-end">
                    <!-- {{ siteStore.location }} -->
                    <span><b>{{ formatoPesosColombianos(
                        store.cart.total_cost +
                        siteStore.location.neigborhood.delivery_price
                            ) }}</b></span>
                </div>
            </div>

            <!-- Botones de navegación y acciones -->
            <router-link to="/" v-if="route.path.includes('cart')">
                <Button outlined icon="pi pi-shopping-cart" label="Seguir comprando"
                    class="mt-4 button-common button-transparent button-fullwidth button-bold"
                    severity="danger"></Button>
            </router-link>

            <router-link to="/cart" v-else-if="route.path != '/reservas'">
                <Button outlined icon="pi pi-arrow-left" label="Volver al carrito"
                    class="mt-4 button-common button-transparent button-fullwidth button-bold"
                    severity="danger"></Button>
            </router-link>

            <Tag v-if="siteStore.status == 'cerrado' && route.path != '/reservas'" class="mt-2 tag-fullheight"
                severity="danger">
                Este Restaurante esta cerrado
            </Tag>

            <!-- Botón “Pedir” -->
            <router-link to="/pay" v-if="route.path.includes('cart') && siteStore.status != 'cerrado'">
                <Button iconPos="right" icon="pi pi-arrow-right" label="Pedir"
                    class="mt-2 button-common button-black button-fullwidth button-bold button-no-border button-no-outline"
                    severity="help"></Button>
            </router-link>

            <!-- Botón “Finalizar pedido” al reservar -->
            <router-link to="/pay" v-else-if="route.path.includes('reservas')">
                <Button @click="() => {
                    orderService.sendOrderReserva()
                    sending = true
                }" iconPos="right" icon="pi pi-arrow-right" label="Finalizar pedido"
                    class="mt-2 button-common button-black button-fullwidth button-bold button-no-border button-no-outline"
                    severity="help"></Button>
            </router-link>

            <!-- Botón “Finalizar pedido” si el restaurante no está cerrado -->
            <router-link to="/pay" v-else-if="siteStore.status != 'cerrado'">
                <Button @click="() => {
                    orderService.sendOrder()
                    sending = true
                }" iconPos="right" icon="pi pi-arrow-right" label="Finalizar pedido"
                    class="mt-2 button-common button-black button-fullwidth button-bold button-no-border button-no-outline"
                    severity="help"></Button>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { formatoPesosColombianos } from '@/service/utils/formatoPesos';
import { usecartStore } from '@/store/shoping_cart';
import { useSitesStore } from '@/store/site';
import { useRoute } from 'vue-router';
import { orderService } from '@/service/order/orderService';
import { onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/store/user';
import { Button } from 'primevue';
import { Tag } from 'primevue';

const sending = ref(false);
const route = useRoute();
const store = usecartStore();
const siteStore = useSitesStore();
const user = useUserStore();

const agrupados = ref({});

const update = () => {
    agrupados.value = store.cart.additions.reduce((acumulador, elemento) => {
        let grupo = elemento.group;
        if (!acumulador[grupo]) {
            acumulador[grupo] = [];
        }
        acumulador[grupo].push(elemento);
        return acumulador;
    }, {});
};

onMounted(() => {
    update();

    if (user.user.payment_method_option?.id != 7 && !route.path.includes('reservas'))
        siteStore.setNeighborhoodPrice();
    else {
        siteStore.setNeighborhoodPriceCero();
    }
});

watch(
    () => store.cart.additions,
    () => {
        update();
    },
    { deep: true }
);
</script>

<style scoped>
/* --- Clases nuevas para reemplazar estilos en línea --- */

/* Contenedor “sticky” del resumen */
.sticky-summary {
    position: sticky;
    padding: 1rem;
    max-height: min-content;
    background-color: white;
    box-shadow: 0 1rem 1rem #00000020;
    top: 5rem;
    border-radius: 0.5rem;
    z-index: 1000;
}

/* Línea de cada producto (display: flex; justify-content: space-between) */
.product-line {
    display: flex;
    justify-content: space-between;
}

/* Span con min-width: 3rem; y width: 100% */
.span-minwidth {
    min-width: 3rem;
    width: 100%;
}

/* Forzar texto a “end” */
.text-end {
    text-align: end;
}

/* Contenedor de adiciones agrupadas */
.addition-group {
    position: relative;
    border-radius: 0.3rem;
}

/* Cada ítem de adicional */
.addition-item {
    display: flex;
    gap: 1rem;
    align-items: center;
}

/* Contenedor interno de ítem adicional */
.addition-item-inner {
    display: flex;
    width: 100%;
    gap: 1rem;
    justify-content: space-between;
}

/* Grid para los subtotales y totales */
.summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}

/* Texto con color primario */
.primary-color {
    color: var(--primary-color);
}

/* Ajustes de fuente para la descripción base (opcional) */
.font-weight-400 {
    font-weight: 400;
}

/* Botones y clases genéricas */
.button-common {
    outline: none;
}

.button-no-outline {
    outline: none;
}

.button-no-border {
    border: none;
}

.button-fullwidth {
    width: 100%;
}

.button-bold {
    font-weight: bold;
}

.button-transparent {
    background-color: rgba(0, 0, 0, 0);
}

.button-black {
    background-color: black;
}

/* Tag de aviso de “Restaurante cerrado” */
.tag-fullheight {
    width: 100%;
    height: 2.5rem;
}

/* Estilos globales ya existentes */
.p-shadow {
    box-shadow: 0 0.3rem 5px rgba(0, 0, 0, 0.15);
}

button {
    text-transform: uppercase;
}

* {
    text-transform: uppercase;
    font-size: 0.9rem;
}

*::first-letter {
    text-transform: uppercase;
}
</style>
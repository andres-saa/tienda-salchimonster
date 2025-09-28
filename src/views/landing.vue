<template>
  <!-- Dialog para cambiar un producto base -->
  <Dialog v-model:visible="showChangeDialog" style="max-width:20rem" :closable="false" :modal="true" class="p-3 change-dialog">
    <template #header>
      <h3> {{user.lang.name == 'es'? 'Elige una alternativa para' : 'select alternative for'}}  {{ productBaseToChange.producto_descripcion }}</h3>
    </template>

    <div v-if="productBaseToChange" class="change-dialog-content">
      <div class="change-option shadow-4 p-2" v-for="option in productBaseToChange.lista_productoCambio"
        :key="option.producto_cambio_id" @click="selectAlternative(option)">
        <img class="change-option-img" :src="`${URI}/get-image?image_url=${option.producto_urlimagen}`" alt="" />
        <p><strong>{{ option.producto_descripcion }}</strong></p>
      </div>
      <Button @click="showChangeDialog = false;" severity="danger" icon="pi pi-times" class="close-change-dialog-btn" />
    </div>
  </Dialog>

  <!-- Dialog principal para mostrar un producto -->





    <!-- <template #footer>
      <div
                                                    class="cart-addition-quantity-control ml-2">
                                                    <Button @click="quantity>1? quantity-=1 : 0"
                                                        severity="danger" style="border-radius:.5rem 0 0 .5rem" class="cart-addition-quantity-btn-minus"
                                                        icon="pi pi-minus"></Button>

                                                    <span  readonly
                                                        class="cart-addition-quantity-label p-0 text-center">{{quantity
                                                            }}</span>

                                                    <Button @click="quantity+=1"
                                                        severity="danger" style="border-radius:0 .5rem .5rem 0" class="cart-addition-quantity-btn-plus"
                                                        icon="pi pi-plus"></Button>
                                                </div>
      <div class="footer-container">
       <Button
  class="add-cart-footer-btn"
  @click="addToCart(store.currentProduct)"
  :label="user.lang.name == 'es' ? 'Agregar al carrito' : 'Add to cart'"
  icon="pi pi-shopping-cart"
/>
      </div>
    </template> -->

    <!-- Contenido del diálogo principal -->
    <div class="dialog-main-content">

      <div style="grid-area: imagen;position: sticky;height: min-content;">
        <img   style="" class="product-image main-image"
          :src="`${URI}/get-image?image_url=${store.currentProduct.productogeneral_urlimagen}`" alt="" />
          <div style="display: flex; flex-direction: column;position: absolute;top: 1rem;left: 1rem;color: #fff;
  text-shadow:
    3px 3px 2px #000,
    -3px 3px 2px #000,
    -3px -3px 0 #000,
    3px -3px 0 #000;"> 
            
            <div style="color: var(--p-primary-color);font-size: 200%;  font-weight: bold;">
            {{ user.lang.name == 'es'?  store.currentProduct.productogeneral_descripcion : store.currentProduct.english_name }}

            </div>
            <div style="font-size: 200%;;font-weight: bold;">
              Ahora  <span style="font-size: 200%;">  {{
            formatoPesosColombianos(
              store.currentProduct?.productogeneral_precio ||
              store.currentProduct?.lista_presentacion?.[0]?.producto_precio
            )
          }}</span>
            </div>

            <div style="font-size: 200%;font-weight: bold;padding: 0;">
              Antes  <span style="font-size: 150%;">  {{
            formatoPesosColombianos(
              store.currentProduct?.productogeneral_precio ||
              store.currentProduct?.lista_presentacion?.[0]?.producto_precio
            )
          }}</span>
          
            </div>
          </div>




          <div class="" style="background-color: transparent;display: flex;padding: 1rem; position: absolute;bottom: 0;gap: 1rem;">
          <div class="product-base-item" v-for="product_base in store.currentProduct.lista_productobase" style="position: relative;"
            :key="product_base.producto_id">
         
         
                  <h3 class="m-0 p-0 text-2xl product-base-qty" style="position: absolute;font-size: 100%;background-color: var(--p-primary-color); top: -1rem;right: -1rem;color:white; padding: .5rem;align-self: 1 / 1 ; border-radius: 50%;">
                {{ Math.round(product_base.productocombo_cantidad) }} x
              </h3>
              <img class="product-base-img" :src="`${URI}/get-image?image_url=${product_base.producto_urlimagen}`"
                alt="" />
          
          </div>

        </div>
      </div>


      <div  class="details" style="grid-area: detail;">

        <h3 class="tittle" style="text-transform: uppercase;">
          {{ user.lang.name == 'es'?  store.currentProduct.productogeneral_descripcion : store.currentProduct.english_name }}
        </h3>
        <h3  class="tittle" style="width: 100%; text-align: end;">
          {{
            formatoPesosColombianos(
              store.currentProduct?.productogeneral_precio ||
              store.currentProduct?.lista_presentacion?.[0]?.producto_precio
            )
          }}
        </h3>

        <p class="text-description" style="margin: 1rem 0;">
          {{ user.lang.name == 'es'? store.currentProduct.productogeneral_descripcionweb?.toLowerCase() : store.currentProduct.english_description?.toLowerCase() }}
        </p>

        <!-- Agrupadores de modificadores -->
        <div v-for="i in store.currentProduct.lista_agrupadores" :key="i.modificador_id">
          <h3 style="margin: 1rem 0;"><strong>{{ i.modificador_nombre }}</strong></h3>

          <div>
            <div class="modificador-row" v-for="modificador in i.listaModificadores"
              :key="modificador.modificadorseleccion_id">
              <RadioButton
                v-if="i.modificador_esmultiple == 0"
                v-model="exclusive[i.modificador_id]"
                :value="modificador.modificadorseleccion_id"
                @change="() => handleAdditionChange(modificador, i.modificador_id)"
              />

              <Checkbox
                v-else
                binary
                v-model="checkedAdition[modificador.modificadorseleccion_nombre]"
                @change="() => handleAdditionChange(modificador, i.modificador_id)"
              />

              <div class="modificador-row-content">
                <span class="text-sm adicion modificador-nombre">
                  {{ modificador.modificadorseleccion_nombre }}
                </span>

                <div class="modificador-price-quantity">
                  <span v-if="modificador.modificadorseleccion_precio > 0" class="pl-2 py-1 text-sm modificador-price">
                    <b style="margin-right: .5rem;"
                      v-if="selectedAdditions[modificador.modificadorseleccion_id]?.modificadorseleccion_cantidad > 0">
                      {{
                        formatoPesosColombianos(
                          modificador.modificadorseleccion_precio *
                          parseInt(
                            selectedAdditions[modificador.modificadorseleccion_id]?.modificadorseleccion_cantidad
                          )
                        )
                      }}
                    </b>
                    <b v-else>
                      {{ formatoPesosColombianos(modificador.modificadorseleccion_precio) }}
                    </b>
                  </span>

                  <div class="modificador-quantity-btns" style="">
                    <Button
  v-if="checkedAdition[modificador.modificadorseleccion_nombre]
        && modificador.modificadorseleccion_precio > 0
        && i.modificador_esmultiple > 0"
                      @click="decrement(modificador, i.modificador_id)"
                      class="quantity-btn"
                      severity="danger"
                      icon="pi pi-minus"
                    />

                    <!-- Cantidad -->
                    <span
                      v-if="checkedAdition[modificador.modificadorseleccion_nombre]
                            && modificador.modificadorseleccion_precio > 0
                            && i.modificador_esmultiple > 0"
                      readonly
                      class="quantity-input p-0 text-center">
                      {{ selectedAdditions[modificador.modificadorseleccion_id]?.modificadorseleccion_cantidad || 1 }}
                    </span>

                    <!-- Botón + -->
                    <Button
                      v-if="checkedAdition[modificador.modificadorseleccion_nombre]
                            && modificador.modificadorseleccion_precio > 0
                            && i.modificador_esmultiple > 0"
                      @click="increment(modificador, i.modificador_id)"
                      class="quantity-btn"
                      severity="danger"
                      icon="pi pi-plus"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Productos base (INCLUYE) -->
        <h3 v-if="store.currentProduct?.lista_productobase?.length > 0" class="includes-title">
          <strong>{{user.lang.name == 'es'? 'INCLUYE' : 'INCLUDE'}} </strong>
        </h3>

        <div class="product-base-grid" style="background-color: transparent;">
          <div class="product-base-item" v-for="product_base in store.currentProduct.lista_productobase"
            :key="product_base.producto_id">
            <h3 class="m-0 p-0 product-base-desc">
                {{ product_base.producto_descripcion }}
              </h3>
            <div class="product-base-item-header">
              <h3 class="m-0 p-0 text-2xl product-base-qty">
                {{ Math.round(product_base.productocombo_cantidad) }} x
              </h3>
              <img class="product-base-img" :src="`${URI}/get-image?image_url=${product_base.producto_urlimagen}`"
                alt="" />
               <Button
                  class="product-base-change-btn"
                  v-if="product_base.lista_productoCambio && product_base.lista_productoCambio.length > 0"
                  :label="user.lang.name == 'es' ? 'Cambiar' : 'Change'"
                  @click="changeProduct(product_base)"
                />

            </div>


<div style="border-top:.3rem solid;margin-top:.5rem;opacity:.2"></div>
          </div>

        </div>
      </div>


      <pay style="grid-area: pay;padding: 0;width: 100% ;">

      </pay>

    </div>

</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import Checkbox from 'primevue/checkbox';
import RadioButton from 'primevue/radiobutton';
import { InputText } from 'primevue';
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { formatoPesosColombianos } from '@/service/utils/formatoPesos';
import router from '@/router/index.js';
import { useRoute } from 'vue-router';
import { usecartStore } from '@/store/shoping_cart';
import { Dialog } from 'primevue';
import Pay from './Pay.vue';
import { Button } from 'primevue';
import { URI } from '@/service/conection';
import { useUserStore } from '@/store/user';


const user = useUserStore()
// import { URI } from '@/service/conection';
const store = usecartStore();
const route = useRoute();
const see = ref(false);
const seeLeftHand = ref(false);
const seeRightHand = ref(false);
const quantity = ref(1)
const exclusive = ref({})

watch(() => store.visibles.currentProduct, (newVal) => {
  if (!newVal&& route.path !== '/kids') {
    see.value = seeLeftHand.value = seeRightHand.value = false;
    router.push({
      path: route.path, // Mantiene la misma ruta
      query: {
      }
    })
    // alert('hol')
  }

  selectedAdditions.value = {}
  checkedAdition.value = {}
  quantity.value = 1
},{deep:true})

const productBaseToChange = ref(null);
const showChangeDialog = ref(false);




const selectAlternative = (option) => {
  const currentProduct = {
    producto_cambio_id: productBaseToChange.value.producto_id,
    producto_descripcion: productBaseToChange.value.producto_descripcion,
    producto_precio: productBaseToChange.value.producto_precio,
    producto_urlimagen: productBaseToChange.value.producto_urlimagen,
  };

  const optionIndex = productBaseToChange.value.lista_productoCambio.findIndex(
    (item) => item.producto_cambio_id === option.producto_cambio_id
  );

  // Reemplaza la opción seleccionada con el producto actual
  if (optionIndex !== -1) {
    productBaseToChange.value.lista_productoCambio.splice(optionIndex, 1, currentProduct);
  }

  // Actualiza productBaseToChange con la opción seleccionada
  productBaseToChange.value.producto_id = option.producto_id;
  productBaseToChange.value.producto_descripcion = option.producto_descripcion;
  productBaseToChange.value.producto_precio = option.producto_precio;
  productBaseToChange.value.producto_urlimagen = option.producto_urlimagen;

  showChangeDialog.value = false;
  recalculateTotalPrice();
};

/**
 * Recalcula el precio total del producto actual (producto general + productos base).
 */
const recalculateTotalPrice = () => {
  let totalPrice = 0;

  // Sumar precios de los productos base
  store.currentProduct.lista_productobase.forEach((product) => {
    totalPrice +=
      parseFloat(product.producto_precio) * parseInt(product.productocombo_cantidad);
  });

  // Agregar precio del producto general si corresponde
  if (store.currentProduct.productogeneral_precio) {
    totalPrice += parseFloat(store.currentProduct.productogeneral_precio);
  }

  // Actualizar en el store (puedes almacenar en `currentProduct.totalPrice` u otro lugar)
  store.currentProduct.totalPrice = totalPrice;
};

/**
 * Función para abrir el diálogo de cambio de producto base.
 */
const changeProduct = (product_base) => {
  productBaseToChange.value = product_base;
  showChangeDialog.value = true;
};

/**
 * Control de adiciones.
 */
const selectedAdditions = ref({});
const checkedAdition = ref({});

const handleAdditionChange = (item, groupId) => {
  const limits = groupLimits.value[groupId];

  /* 1. Grupo exclusivo (RadioButton) */
  if (!limits.multiple) {
    // limpia selección anterior
    Object.keys(selectedAdditions.value).forEach((k) => {
      if (selectedAdditions.value[k].modificador_id === groupId) {
        delete selectedAdditions.value[k];
      }
    });

    // registra la nueva
    exclusive.value[groupId] = item.modificadorseleccion_id;
    selectedAdditions.value[item.modificadorseleccion_id] = {
      ...item,
      modificadorseleccion_cantidad: 1,
      modificador_id: groupId,
    };
    return;                       // ← no sigue con lógica de checkbox
  }

  /* 2. Grupo múltiple (Checkbox) */
  if (checkedAdition.value[item.modificadorseleccion_nombre]) {
    // activando
    if (groupCount(groupId) + 1 > limits.max) {
      toast.add({
        severity: 'warn',
        summary : 'Límite alcanzado',
        detail  : `Máximo ${limits.max} en este grupo`,
        life    : 3000,
      });
      checkedAdition.value[item.modificadorseleccion_nombre] = false;
      return;
    }
    selectedAdditions.value[item.modificadorseleccion_id] = {
      ...item,
      modificadorseleccion_cantidad: 1,
      modificador_id: groupId,
    };
  } else {
    // desactivando
    delete selectedAdditions.value[item.modificadorseleccion_id];
    if (groupCount(groupId) < limits.min) {
      toast.add({
        severity: 'warn',
        summary : 'Cantidad mínima',
        detail  : `Debes elegir al menos ${limits.min}`,
        life    : 3000,
      });
      checkedAdition.value[item.modificadorseleccion_nombre] = true;
      selectedAdditions.value[item.modificadorseleccion_id] = {
        ...item,
        modificadorseleccion_cantidad: 1,
        modificador_id: groupId,
      };
    }
  }
};const increment = (item, groupId) => {
  const key    = String(groupId);               // ← tomamos el id del grupo
  const limits = groupLimits.value[key];

  if (!limits) {
    console.warn(`No existen límites para el grupo ${key}`);
    return;
  }
  if (groupCount(key) + 1 > limits.max) {
    toast.add({
      severity: 'warn',
      summary : 'Límite alcanzado',
      detail  : `Máximo ${limits.max} en este grupo`,
      life    : 3000,
    });
    return;
  }

  selectedAdditions.value[item.modificadorseleccion_id]
    .modificadorseleccion_cantidad++;
};

/*  ⬇️  Sustituye tu función decrement por esta  */
const decrement = (item, groupId) => {
  const key    = String(groupId);
  const limits = groupLimits.value[key];

  if (!limits) {
    console.warn(`No existen límites para el grupo ${key}`);
    return;
  }

  const entry = selectedAdditions.value[item.modificadorseleccion_id];
  if (!entry) return;

  if (entry.modificadorseleccion_cantidad === 1) {
    if (groupCount(key) - 1 < limits.min) {
      toast.add({
        severity: 'warn',
        summary : 'Cantidad mínima',
        detail  : `Debes mantener al menos ${limits.min}`,
        life    : 3000,
      });
      return;
    }
    checkedAdition.value[item.modificadorseleccion_nombre] = false;
    delete selectedAdditions.value[item.modificadorseleccion_id];
  } else {
    entry.modificadorseleccion_cantidad--;
  }
};
/**
 * Agregar el producto (y sus adiciones) al carrito.
 */const addToCart = () => {
  if (faltaMinimos()) {
    toast.add({
      severity: 'warn',
      summary : '✋ Falta elegir',
      detail  : 'Selecciona todas las opciones mínimas antes de continuar',
      life    : 3000,
    });
    return;
  }

  store.addProductToCart(
    store.currentProduct,
    quantity.value,
    Object.values(selectedAdditions.value)
  );

  /* reset */
  selectedAdditions.value = {};
  checkedAdition.value    = {};
  exclusive.value         = {};
  store.setVisible('currentProduct', false);
};

/* ────────────────  Lanza presetMinimums al abrir  ──────────────── */

/**
 * Reset al cerrar el diálogo.
 */

watch(
  () => store.visibles.currentProduct,
  (newval) => {
    if (newval) {
      return;
    }
    const new_route = `/${route.params.menu_name}/${route.params.category_id}`;
    if (route.path != '/' && route.path != '/kids') {
      router.push(new_route);

    }
  }
);

/**
 * Control de adiciones v2 (?)
 */
const adicionales = ref([]);

watch(
  () => store.visibles.addAdditionToCart,
  async (new_val) => {
    if (!new_val) {
      selectedAdditions.value = {};
      adicionales.value = [];

    } else {
      // Lógica cuando se abre el panel de adiciones, si la hay
    }
  },
  { deep: true }
);

/**
 * Detección de tamaño de pantalla
 */

/**
 * onMounted inicial
 */

const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

window.addEventListener('resize', updateScreenWidth);

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

const dialogStyle = computed(() => {
  return isBelow1200.value
    ? { width: '90%', 'max-width': '40rem' }
    : { width: '90%', 'max-width': '1200px' };
});



// Computed para determinar si la pantalla es menor a 1200px
const isBelow1200 = computed(() => screenWidth.value < 1200);

onMounted(async() => {


  setTimeout(() => {
    if (route.query.producto) {

      store.menu?.forEach(category => {
        const theProduct = category?.products?.find( p =>  p.productogeneral_id == route.query.producto )
        if (theProduct) {
          store.currentProduct = theProduct
          console.log(theProduct)
           // // store.visibles.currentProduct = true;
                 store.cart = []
      addToCart(store.currentProduct)
        }

      })
    }
  }, 1000);


});

const toast = useToast();



const groupLimits = computed(() => {
  if (
    !store.currentProduct ||
    !Array.isArray(store.currentProduct.lista_agrupadores)
  ) {
    return {};
  }

  const limits = {};
  store.currentProduct.lista_agrupadores.forEach((g) => {
    /* siempre usamos string como clave */
    const key = String(g.modificador_id);

    limits[key] = {
      min     : Number(g.modificador_cantidadminima),
      multiple: Number(g.modificador_esmultiple) === 1,
      max     : g.listaModificadores.reduce(
        (acc, m) =>
          acc + Number(m.productogeneralmodificador_cantidadmaxima || 0),
        0
      ),
    };
  });
  return limits;
});




const faltaMinimos = () => {
  for (const [gId, lim] of Object.entries(groupLimits.value)) {
    if (groupCount(gId) < lim.min) return true;
  }
  return false;
};

/* cuántos ítems lleva un grupo */
const groupCount = (groupId) =>
  Object.values(selectedAdditions.value).reduce(
    (acc, it) =>
      it.modificador_id === groupId
        ? acc + Number(it.modificadorseleccion_cantidad)
        : acc,
    0
  );

const presetMinimums = () => {
  if (
    !store.currentProduct ||
    !Array.isArray(store.currentProduct.lista_agrupadores)
  ) {
    return;
  }

  selectedAdditions.value = {};
  checkedAdition.value    = {};
  exclusive.value         = {};

  store.currentProduct.lista_agrupadores.forEach((g) => {
    const { min, multiple } = groupLimits.value[g.modificador_id];
    if (min === 0) return;

    g.listaModificadores.slice(0, min).forEach((mod, idx) => {
      if (!multiple && idx > 0) return;          // sólo la 1.ª en grupos exclusivos

      if (multiple) {
        checkedAdition.value[mod.modificadorseleccion_nombre] = true;
      } else {
        exclusive.value[g.modificador_id] = mod.modificadorseleccion_id;
      }

      selectedAdditions.value[mod.modificadorseleccion_id] = {
        ...mod,
        modificadorseleccion_cantidad: 1,
        modificador_id: g.modificador_id,
      };
    });
  });
};


watch(
  () => store.visibles.currentProduct,
  (open) => {
    console.log(store.currentProduct)
    if (!open) {
      exclusive.value         = {};   // ← limpia radios
      selectedAdditions.value = {};
      checkedAdition.value    = {};

    }
  }
);




</script>

<style scoped>
/* Diálogo para cambiar un producto base */
.change-dialog {
  /* background-color: white; */
  width: max-content;
  max-width: 20rem;
  max-height: 30rem;
  border-radius: 1rem;
}

/* Contenedor principal del contenido del diálogo de cambio */
.change-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

/* Opciones de cambio */
.change-option {
  cursor: pointer;
  /* background-color: white;q */
  color: black;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Imagen de cada opción */
.change-option-img {
  width: 140px;
  height: 140px;
  padding:10px;
  border-radius:.5rem;
  object-fit: contain;
  /* border:2px solid; */
  box-shadow: 0rem 0rem 1rem #00000030;

}



.tittle{
    font-size: 2rem;
}

/* Botón para cerrar el diálogo de cambio */
.close-change-dialog-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  position: absolute;
  right: -1rem;
  top: -1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
}

/* Diálogo principal (producto) */
.product-dialog {
  max-width: 91vw !important;
}

/* Botón flotante para cerrar el diálogo principal */
.add-cart-button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  position: absolute;
  right: -1rem;
  top: -1rem;
  border-radius: 50%;
  z-index: 99;
}

/* Contenedor del header del diálogo */
.header-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  /* background-color: rgb(255, 255, 255); */
  z-index: 99;
  top: 0rem;
  text-transform:uppercase;
  left: 0;
  height: min-content;
}

/* Contenedor del footer del diálogo */
.footer-container {
  display: flex;
  justify-content: center;
}

/* Botón en el footer para añadir al carrito */
.add-cart-footer-btn {
  min-width: max-content;
  pointer-events: all;
  background-color: black;
  color: white;
  width: auto;
  border: none;
  /* padding: 0.5rem 3rem; */
  font-weight: bold;
}

/* Contenido principal del diálogo */
.dialog-main-content {
  position: relative;
  max-width: 1200px;
  margin: 3rem auto;
  border-radius: 1rem;
  padding: 1rem;
  padding-bottom: 0;
  height: 100%;
  /* padding-bottom: 4rem; */
  display: grid;
  gap: 2rem;
  grid-template-areas: "imagen detail" "pay pay";
  grid-template-columns: repeat(2, 1fr);
}

.details {
  /* box-shadow: 0rem 0rem 1rem .5rem #00000010; */
  padding:0 1rem;
  margin-top: 0rem;
}

.main-image{
    top: 6rem;
}

@media (width<1200px) {

  .dialog-main-content {
    grid-template-columns: repeat(1, 1fr);
    height: max-content;
    grid-template-areas: "imagen" "detail" "pay";

  }

  .dialog-main-content{
    margin: 0;
  }

  .main-image{
    top: 0rem;
  }

  .tittle:first-child{
    font-size: 1.4rem;
  }

  .product-dialog {
    max-width: 20rem !important;
  }

  .details {
    padding: 0;
    margin: 0;
    box-shadow: none;
  }
}

/* Imagen del producto */
.product-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 0.5rem;
  /* background-color: rgb(255, 255, 255); */
  object-fit: cover;
}

/* Título "DESCRIPCION" */
.description {
  font-weight: bold;
  color: black;
  padding: 0.2rem 0;
  /* background-color: red; */
}

/* Fila de modificador (checkbox + label + precio + botones) */
.modificador-row {
  display: flex;
  gap: 1rem;
  padding: 0.3rem;
  align-items: center;
}

/* Checkbox de modificador */
.modificador-checkbox {
  /* outline: 2px solid var(--p-primary-color); */
  border-radius: 0.2rem;
}

/* Contenido de la fila (nombre y precio/cantidad a la derecha) */
.modificador-row-content {
  display: flex;
  width: 100%;
  gap: 1rem;
  justify-content: space-between;
}

/* Nombre del modificador */
.modificador-nombre {
  text-transform: lowercase;
}

/* Contenedor del precio y de los botones de cantidad */
.modificador-price-quantity {
  min-width: max-content;
  display: flex;
  align-items: center;
}

/* Precio */
.modificador-price {
  display: flex;
  align-items: center;
}

/* Botones + / - */
.modificador-quantity-btns {
  min-width: max-content;
  display: flex;
  /* margin-left: 1rem; */
}

/* Botón genérico de + / - */
.quantity-btn {
  /* margin-left: .5rem; */
  width: 2rem;
  height: 1.5rem;
  border: none;
}

/* Input de cantidad */
.quantity-input {
  width: 2rem;
  text-align: center;
  font-weight: bold;
  padding: 0;
  border: none;
  height: 1.5rem;
}

/* Sección de “INCLUYE” */
.includes-title {
  padding: 1rem 0;
}

/* Grid de productos base */
.product-base-grid {
  display: grid;
  gap: 1rem;
  padding:0rem;
  grid-template-columns: repeat(1, 1fr);
  /* border-radius: 0.5rem; */
  overflow: hidden;
}

/* Cada ítem de producto base */
.product-base-item {
  /* border: 2px solid var(--p-primary-color); */
  display: flex;
  border-radius: 0.5rem;
  /* margin:1rem 0; */
  /* background-color: #fff; */
  flex-direction: column;
  /* box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1); */
  /* padding: 1rem; */
  /* gap: 0.5rem; */
}

/* Encabezado del producto base */
.product-base-item-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  position: relative;
  border-radius: 0.5rem;
  /* padding: 1rem; */
}

/* Cantidad (Ej.: “2 x”) */
.product-base-qty {
  max-width: 100%;
  min-width: max-content;
}

/* Imagen del producto base */
.product-base-img {
  width: 4rem;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  box-shadow: 0rem 0rem .3rem #00000080;

  border-radius: 0.5rem;
}


/* Descripción del producto base */
.product-base-desc {
  max-width: 100%;
  text-transform:uppercase;
}

/* Contenedor para el botón “Cambiar” */
.product-base-change-btn-wrapper {
  display: flex;
  justify-content: end;
  width: 100%;
}

/* Botón “Cambiar” del producto base */
.product-base-change-btn {
  background-color: black;
  max-width: min-content;
  border: none;
  color: white;
  /* Si deseas que el texto sea blanco */
}

/* Sección inferior para pantallas grandes */
.dialog-bottom-fade {
  pointer-events: none;
  display: flex;
  align-items: end;
  justify-content: center;

  height: 5rem;
  bottom: 0rem;
  right: 0;
}

/* Animaciones y transiciones */
.cargado {
  opacity: 0;
  animation: fadeIn 0.1s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-100px);
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInLeftHand {
  from {
    opacity: 0;
    transform: translateX(-1000px);
  }

  to {
    opacity: 1;
  }
}

.cargado-left-hand {
  opacity: 0;
  animation: fadeInLeftHand 0.1s ease-out forwards;
}

@keyframes fadeInRightHand {
  from {
    opacity: 0;
    transform: translateX(1000px);
  }

  to {
    opacity: 1;
  }
}

.cargado-right-hand {
  opacity: 0;
  animation: fadeInRightHand 0.1s ease-out forwards;
}

/* Scrollbars ocultos en WebKit */
*::-webkit-scrollbar {
  overflow-y: auto;
  display: none;
}

/* Adaptación de fuentes para pantallas pequeñas */
@media (width < 700px) {
  * {
    font-size: 12.5px;
  }
}

.cart-addition-quantity-label {
    width: 3rem;
    height: 1.5rem;
    font-weight: bold;
    text-align: center;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
.cart-addition-quantity-control {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.411);
    margin-left: 1rem;
    align-items: center;
    display: flex;
    border-radius: 0.3rem;
}

/* Ajuste de capitalización para la clase “adicion” */
.adicion::first-letter {
  text-transform: uppercase;
}

/* Para texto en mayúsculas */
.mayuscula {
  text-transform: uppercase;
}

.text-description::first-letter{
  text-transform: uppercase;
}
</style>

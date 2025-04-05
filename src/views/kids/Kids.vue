<template>

<div  style="width: 100%;background-color: var(--p-primary-color); padding-bottom: 4rem;">
  <div class="container8" style="">


<div class="people" style="">


  <img v-for="i in [2,3,4].reverse()" :src="`/images/kids/${i}.png`" alt="" style="width: 100%;object-fit: contain;">

</div>


<div style="width: 100%; padding-bottom: 5rem; display: flex;flex-direction: column;align-items: center;background-color: var(--p-primary-color);min-height: 120vh;">
<h1 style="font-size: 5rem;margin:3rem ; color: white;text-shadow: 0 1rem .5rem #00000040;">
Monster kids
</h1>

<div class="grid" style="">
<MenuCard ref="card" style="grid-area: t;box-shadow: 0 1rem 1rem  #00000040;"  :product="product"></MenuCard>

<!-- <MenuCard style="grid-area: m"  :product="product"></MenuCard> -->


<div class="pc" style="">
  <p>
    <h2>La Gran Misión de los Monster Kids</h2>
<br>
<p>Había una vez, en la ciudad secreta de MonsterLand, un grupo de monstruos muy especiales. No eran monstruos cualquiera… ¡eran los Guardianes del Sabor! Cada uno tenía un poder único y delicioso que usaban para proteger el sabor del mundo.</p>
<br>
<p>Un día, el Gran Chef Cósmico les envió una misión:</p>

<span >
<br>
<p>“¡El sabor de la alegría está desapareciendo de los platos de los niños! Necesitamos que viajen al mundo real y lleven con ustedes la Caja Monster Kids para devolver la diversión, el color y el sabor a cada almuerzo y comida.”</p>
<br>
<p>El primero en alistarse fue Salchiclón, el líder valiente. — ¡Vamos equipo, esta misión necesita nuestro poder monstruoso!</p>
<br>
<p>Madurín se puso sus gafas y dijo: — Con estilo y sazón, salvaremos la diversión.</p>
<br>
<p>Quesón, siempre con una idea brillante, diseñó el mapa de sabor para encontrar a cada niño.</p>
<br>
<p>Chicharronator se cargó la mochila con crocancia y fuerza. — ¡Con cada mordida, una sonrisa asegurada!</p>
<br>
<p>Papatín corrió como un rayo por toda MonsterLand avisando que la aventura comenzaba. — ¡Vamos rápido, hay muchos niños por alegrar!</p>
<br>
<p>Pollón SM preparó su salsa secreta para darles valor a los más tímidos. — ¡Que nadie se quede sin probar nuestra energía!</p>
<br>
<p>Y por último, Guacamón, con su bigote sabio, les recordó: — No se olviden que el sabor más poderoso… ¡es el amor!</p>
<br>
<p>Así, los siete monstruos saltaron dentro de la Caja Monster Kids. Cada vez que un niño la abre, una parte de MonsterLand llega a su mesa con aventuras, colores y un sabor que ¡solo los valientes pueden probar!</p>
<br>
<p>¿Estás listo para unirte a la misión? Abre tu caja y deja que los Monstruos del Sabor entren a tu mundo.</p>
<br>
</span>




</p>

<Button style="margin: 1rem;" @click="clickCard" label="Estoy listo"></Button>


<div style="width: 100%;justify-content: center;display: flex;">
  <!-- <Button style="margin: 1rem;" v-if="!ver_mas" @click="ver_mas = true" label="Seguir leyendo"></Button>
  <Button style="margin: 1rem;background-color: black; position: absolute;bottom: -2rem;border: none;border-radius: 50%; width: 3rem; height:3rem;" icon="pi pi-angle-up" v-else @click="ver_mas = false" ></Button> -->

</div>

</div>




<div class="video"  controls style="" src="/Reel 1 Salchimonster Musica 2.mov">

  <iframe width="100%" height="100vh" style="height: 100%;min-height: 80vh;border-radius: .5rem;" src="https://www.youtube.com/embed/RbhYUm9TLQM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


</div>



<div class="movil" >
  <p>
    <h2>La Gran Misión de los Monster Kids</h2>
<br>
<p>Había una vez, en la ciudad secreta de MonsterLand, un grupo de monstruos muy especiales. No eran monstruos cualquiera… ¡eran los Guardianes del Sabor! Cada uno tenía un poder único y delicioso que usaban para proteger el sabor del mundo.</p>
<br>
<p>Un día, el Gran Chef Cósmico les envió una misión:</p>

<span >
<br>
<p>“¡El sabor de la alegría está desapareciendo de los platos de los niños! Necesitamos que viajen al mundo real y lleven con ustedes la Caja Monster Kids para devolver la diversión, el color y el sabor a cada almuerzo y comida.”</p>
<br>
<p>El primero en alistarse fue Salchiclón, el líder valiente. — ¡Vamos equipo, esta misión necesita nuestro poder monstruoso!</p>
<br>
<p>Madurín se puso sus gafas y dijo: — Con estilo y sazón, salvaremos la diversión.</p>
<br>
<p>Quesón, siempre con una idea brillante, diseñó el mapa de sabor para encontrar a cada niño.</p>
<br>
<p>Chicharronator se cargó la mochila con crocancia y fuerza. — ¡Con cada mordida, una sonrisa asegurada!</p>
<br>
<p>Papatín corrió como un rayo por toda MonsterLand avisando que la aventura comenzaba. — ¡Vamos rápido, hay muchos niños por alegrar!</p>
<br>
<p>Pollón SM preparó su salsa secreta para darles valor a los más tímidos. — ¡Que nadie se quede sin probar nuestra energía!</p>
<br>
<p>Y por último, Guacamón, con su bigote sabio, les recordó: — No se olviden que el sabor más poderoso… ¡es el amor!</p>
<br>
<p>Así, los siete monstruos saltaron dentro de la Caja Monster Kids. Cada vez que un niño la abre, una parte de MonsterLand llega a su mesa con aventuras, colores y un sabor que ¡solo los valientes pueden probar!</p>
<br>
<p>¿Estás listo para unirte a la misión? Abre tu caja y deja que los Monstruos del Sabor entren a tu mundo.</p>
<br>
</span>




</p>

<Button style="margin: 1rem;" @click="clickCard" label="Estoy listo"></Button>


<div style="width: 100%;justify-content: center;display: flex;">
  <!-- <Button style="margin: 1rem;" v-if="!ver_mas" @click="ver_mas = true" label="Seguir leyendo"></Button>
  <Button style="margin: 1rem;background-color: black; position: absolute;bottom: -2rem;border: none;border-radius: 50%; width: 3rem; height:3rem;" icon="pi pi-angle-up" v-else @click="ver_mas = false" ></Button> -->

</div>

</div>




</div>


</div>




<div class="people" >


<img v-for="i in [6,7,5]" :src="`/images/kids/${i}.png`" alt="" style="width: 100%;object-fit: contain;">

</div>


</div>
</div>



</template>



<script setup>

import MenuCard from '@/components/cards/MenuCard.vue';
import { onMounted , ref} from 'vue';
import { Button } from 'primevue';

import { usecartStore } from '@/store/shoping_cart';
import { useRoute } from 'vue-router';


const card = ref()

const clickCard = () => {
  if (card.value && card.value.$el) {
    card.value.$el.click();
  }
};
const store = usecartStore();
const route = useRoute();

const ver_mas = ref(false)

const product =  {
            "productogeneral_id": "347",
            "productogeneral_descripcionweb": "Salchipapa MiniKids con Papa Francesa,Salchicha Premum SM, Nuggets de pollo, jugo del valle,Alpinito,Monstruo del Imperio.",
            "productogeneral_descripcion": "MONSTERKIDS",
            "productogeneral_marca": "",
            "productogeneral_escombo": "0",
            "productogeneral_preciofijo": "1",
            "productogeneral_noalteratotalcambio": "0",
            "productogeneral_totalpreciomayor": "0",
            "productogeneral_leysunat": "0",
            "categoria_id": "120",
            "productogeneral_urlimagen": "salchimonsterrestaurantpe/productos/4bf95776-73e1-4593-9113-6cd383d50f70.jpg",
            "productogeneral_estado": "Activo",
            "notas": [],
            "lista_presentacion": [
                {
                    "productogeneral_id": "347",
                    "producto_id": "350",
                    "producto_presentacion": "Monster kids",
                    "producto_precio": "25900.00",
                    "producto_delivery": "1",
                    "producto_urlimagen": "salchimonsterrestaurantpe/productos/4bf95776-73e1-4593-9113-6cd383d50f70.jpg",
                    "producto_codigo": "",
                    "producto_codigointerno": null,
                    "producto_estado": "Activo"
                }]}


                onMounted(() => {
  setTimeout(() => {
    if (route.params.product_id) {
      store.currentProduct = store.menu.data.find(
        (p) => p.productogeneral_id == route.params.product_id
      );
      store.visibles.currentProduct = true;
    }
  }, 1000);


});

</script>


<style scoped>


.grid{
  display: grid;
  /* max-width: 900px; */
  grid-template-columns: 30rem 1fr;
  grid-template-rows: 15rem 2fr ;
  gap: 2rem;
  grid-template-areas: "t v "
                        "m v";
}

.people{
  display: flex;
  gap: 5rem;width: 100%; flex-direction: column;align-items: center;max-height: 80vh;padding: 3rem;
  position: sticky;top: 3rem;
}


.video{
  aspect-ratio: 9 /  16;width: 100%;position: sticky;top: 5rem; box-shadow: 0 1rem 1rem  #00000040; grid-area: v; max-height: 80vh;border-radius: 0.5em;
}

.container8{
  grid-template-columns: 1fr 1fr 1fr;
  display: grid;gap: 2rem; width: 100%;margin: auto; background-color: var(--p-primary-color);
}

@media (width < 1200px) {

  .container8{
    grid-template-columns: 1fr;
    grid-template-areas: none;
  }

  .people{
    display: none;
  }

}

@media (width < 957px) {

.container8{
  grid-template-columns: 1fr;
  grid-template-areas: none;
  display: block;
}
.grid{
  grid-template-columns:  1fr;
  grid-template-areas: none;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.people{
  display: none;
}

.movil{
  display: block;
}
.pc{
  display: none;
}
.video{
  position: static;
}
}



.pc{
  grid-area: m;display: flex;align-items: end; justify-content: end;flex-direction: column; max-height: max-content;text-overflow: clip;
;position: relative;  background-color: white; padding: 1rem;border-radius: .5rem;box-shadow: 0 1rem 1rem  #00000040;transition: all ease .3s;
}

.movil {
  grid-area: m;display: none;align-items: end; justify-content: end;flex-direction: column; max-height: max-content;text-overflow: clip;
  ;position: relative;  background-color: white; padding: 1rem;border-radius: .5rem;box-shadow: 0 1rem 1rem  #00000040;transition: all ease .3s;
}


@media (width < 1400px) {

.container8{
  /* grid-template-columns: 1fr; */
}

.people{

  /* gap: 1rem; */
  padding: 1rem;

}

}




</style>

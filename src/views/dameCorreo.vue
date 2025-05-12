<template>
  <div class="wrapper"
    style="background: url(https://backend.salchimonster.com/read-photo-product/6xjNbDfY);background-size: cover;backdrop-filter: blur(3rem);">
    <form class="user-form" v-if="show" @submit.prevent="submitForm">
      <!-- Nombre -->
      <div class="form-row">
        <h4>Nombre</h4>
        <InputText v-model.trim="user.user_name" placeholder="Nombre completo" required />
      </div>

      <!-- Teléfono -->
      <div class="form-row">
        <h4>Teléfono</h4>
        <InputText v-model.trim="user.user_phone" placeholder="Número de teléfono" required />
      </div>

      <!-- Dirección -->
      <div class="form-row">
        <h4>Dirección</h4>
        <InputText v-model.trim="user.user_address" placeholder="Dirección" required />
      </div>

      <!-- Email -->
      <div class="form-row">
        <h4>Email</h4>
        <InputText v-model.trim="user.email" placeholder="Correo electrónico" required />
      </div>

      <!-- Botón Guardar -->
      <div style="display: flex;justify-content: end;">
        <Button type="submit" label="Guardar" class="p-button-primary" />
      </div>

    </form>




    <div v-else-if="code" style="background-color: white; width: 100%;max-width: 40rem;padding: 2rem;border-radius: .5rem; ">



      <h3>Con este código puedes reclamar tu premio</h3>
      <h1 style="font-size: 4rem;text-align: center;">{{ code }}</h1>


      <RouterLink to="/">

        <Button label="Listo, ya lo guarde'" style="font-size: 2rem;width: 100%;"
        @click="show = true"></Button>
      </RouterLink>


    </div>


    <div v-else>


      <Button label="Ingresar datos" style="height:15rem;font-size: 2rem; aspect-ratio: 1 / 1;"
        @click="show = true"></Button>

    </div>




  </div>
</template>

<script setup>
import { ref } from 'vue'
import { InputText } from 'primevue'
import { Button } from 'primevue'
import { fetchService } from '@/service/utils/fetchService'
import { URI } from '@/service/conection'


const show = ref(false)

const code = ref('')

const user = ref({
  user_name: '',
  user_phone: '',
  user_address: '',
  email: ''
})

const submitForm = async () => {
  code.value = await fetchService.post(`${URI}/insert-user-to-email/`, user.value)
  show.value = false
}
</script>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  background-position: cover;
  top: 0;
  z-index: 100;
}

.user-form {
  width: 40rem;
  /* Escritorio */
  max-width: 95vw;
  /* Impide desbordes en móviles */
  background-color: #fff;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 1rem #00000030;
  border-radius: .5rem;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  /* Etiqueta | Campo */
  gap: 0.5rem;
  align-items: center;
}

/* ────── Móviles < 600 px ────── */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
    /* Apila etiqueta y campo */
  }
}
</style>

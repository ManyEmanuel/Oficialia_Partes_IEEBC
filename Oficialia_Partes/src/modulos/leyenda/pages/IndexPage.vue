<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Ley Protección de Datos Personales"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="replay"
            label="Actualizar Ley"
            @click="actualizarModal(true)"
          />
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="history"
            label="Ver historial"
            @click="historialModal(true)"
          />
        </div>
      </div>
    </div>
    <ModalInit />
    <TablaComp v-if="modulo == null ? false : modulo.leer" />
    <ModalComp />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useLeyendaStore } from "../../../stores/leyenda_store";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";

import ModalInit from "../components/ModalInit.vue";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";

const $q = useQuasar();
const leyendaStore = useLeyendaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "OP-CON-LEY";
onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  //leyendaStore.initLeyenda();
  //leyendaStore.updateEditar(false);
  leyendaStore.actualizarModal(true);
  $q.loading.hide();
};

const historialModal = (valor) => {
  leyendaStore.historialModal(true);
};
</script>

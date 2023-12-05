<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Correspondencia" icon="library_books" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <TablaComp v-if="modulo == null ? false : modulo.leer" />
    <ModalAsignacion />
    <ModalResumen />
    <ModalVisorComp />
    <ModalFinalización />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import TablaComp from "../components/TablaComp.vue";
import ModalAsignacion from "../components/ModalAsignacion.vue";
import TablaAdjuntos from "src/modulos/recepcion/components/TablaAdjuntos.vue";
import ModalResumen from "src/modulos/recepcion/components/ModalResumen.vue";
import ModalVisorComp from "src/modulos/recepcion/components/ModalVisorComp.vue";
import ModalFinalización from "../components/ModalFinalización.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "OP-REC-COR";
onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  //recepcionStore.loadFolio();
  $q.loading.hide();
};
</script>

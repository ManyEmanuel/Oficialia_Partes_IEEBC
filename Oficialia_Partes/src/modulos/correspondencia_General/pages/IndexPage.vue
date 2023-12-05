<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Correspondencia General"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row justify-center">
      <q-card class="col">
        <q-tabs
          v-model="tab"
          dense
          align="justify"
          class="text-purple-ieen"
          active-color="purple-ieen-1"
          indicator-color="pink-ieen-1"
        >
          <q-tab name="general" label="General" />
          <q-tab name="individual" label="Mi correspondencia" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated class="text-right">
          <q-tab-panel name="general">
            <TablaComp v-if="modulo == null ? false : modulo.leer" />
          </q-tab-panel>
          <q-tab-panel name="individual">
            <TablaInd v-if="modulo == null ? false : modulo.leer" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <ModalAsignacion />
    <ModalResumen />
    <ModalVisorComp />
    <ModalFinalización />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth_store";
import TablaComp from "../components/TablaComp.vue";
import TablaInd from "../components/TablaInd.vue";
import ModalAsignacion from "../components/ModalAsignacion.vue";
import TablaAdjuntos from "src/modulos/recepcion/components/TablaAdjuntos.vue";
import ModalResumen from "src/modulos/recepcion/components/ModalResumen.vue";
import ModalVisorComp from "src/modulos/recepcion/components/ModalVisorComp.vue";
import ModalFinalización from "src/modulos/correspondencia/components/ModalFinalización.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "OP-REC-GEN";
const tab = ref("general");
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

<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Recepcion-Documento"
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
            icon-right="add_circle_outline"
            label="Nuevo"
            @click="actualizarModal(true)"
          />
        </div>
      </div>
    </div>
    <TablaComp v-if="modulo == null ? false : modulo.leer" />
    <ModalComp />
    <ModalDoc />
    <ModalVisorComp />
    <ModalCompC />
    <ModalCompR />
    <ModalCompI />
    <ModalResumen />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useRecepcionStore } from "../../../stores/recepcion_store";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import { useClasificadorStore } from "../../../stores/clasificador_store";
import { useRemitentesStore } from "../../../stores/remitente_store";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalDoc from "../components/ModalDoc.vue";
import ModalVisorComp from "../components/ModalVisorComp.vue";
import ModalCompC from "../../clasificador/components/ModalComp.vue";
import ModalCompR from "../../remitentes/components/ModalComp.vue";
import ModalCompI from "../../instituciones/components/ModalComp.vue";
import ModalResumen from "src/modulos/recepcion/components/ModalResumen.vue";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const remitenteStore = useRemitentesStore();
const clasificadorStore = useClasificadorStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "OP-REC-DOC";
onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  //recepcionStore.loadFolio();
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  $q.loading.show();
  recepcionStore.initRecepcion();
  recepcionStore.loadFecha();
  recepcionStore.updateEditar(false);
  recepcionStore.actualizarModal(true);
  recepcionStore.loadAreasSelectList();
  clasificadorStore.loadClasificadorList();
  remitenteStore.loadRemitenteList();
  $q.loading.hide();
};
</script>

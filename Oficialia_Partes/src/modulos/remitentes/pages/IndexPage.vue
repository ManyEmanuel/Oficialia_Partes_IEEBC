<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el label="Remitentes" icon="library_books" />
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
    <ModalCompI />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useRemitentesStore } from "../../../stores/remitente_store";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";

import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalCompI from "../../instituciones/components/ModalComp.vue";

const $q = useQuasar();
const remitenteStore = useRemitentesStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "OP-CAT-REM";
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
  remitenteStore.initRemitente();
  remitenteStore.updateEditar(false);
  remitenteStore.actualizarModal(true);
  $q.loading.hide();
};
</script>

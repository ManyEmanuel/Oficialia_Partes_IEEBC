<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Bitácora de descarga de documentos"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <!--<div class="row">
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
    </div>-->
    <TablaComp v-if="modulo == null ? false : modulo.leer" />
  </q-page>
</template>
<script setup>
import { useQuasar } from "quasar";
import { useBitacoraStore } from "../../../stores/bitacora_store";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";

import TablaComp from "../components/TablaComp.vue";

const $q = useQuasar();
const bitacoraStore = useBitacoraStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const siglas = "OP-BIT-DOC";

onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>

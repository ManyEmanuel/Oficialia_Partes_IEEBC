<template>
  <q-page padding>
    <div class="row">
      <div class="col">
        <div class="q-pa-md q-gutter-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el
              label="Reporte por clasificación"
              icon="library_books"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>

    <TablaComp v-if="modulo == null ? false : modulo.leer" />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useReporteStore } from "src/stores/reporte_Especial_store";
import { useAuthStore } from "../../../stores/auth_store";
import { onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import TablaComp from "../components/TablaComp.vue";
const $q = useQuasar();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const reporteStore = useReporteStore();
const siglas = "OP-REP-ESP";
onBeforeMount(() => {
  leerPermisos();
});

const leerPermisos = async () => {
  $q.loading.show();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const prueba = async () => {
  $q.loading.show();
  let resp = await reporteStore.loadConteoClasificador();
  console.log(resp);
  $q.loading.hide();
};
</script>

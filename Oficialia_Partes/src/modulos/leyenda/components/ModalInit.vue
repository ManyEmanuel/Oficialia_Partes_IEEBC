<template>
  <div class="row">
    <div class="col">
      <q-card class="my-card">
        <q-card-section class="q-pt-xs">
          <div class="text-h5 q-mt-sm q-mb-xs">
            Ley de protección de datos personales
          </div>
          <br />
          <div class="text-h5 q-mt-sm q-mb-xs text-italic text-justify">
            " {{ leyendaActual.leyenda }} "
          </div>
          <div class="text-caption text-grey"></div>
        </q-card-section>
        <q-card-section>
          <div class="text-overline" align="right">
            Vigente desde: {{ leyendaActual.fecha_Registro }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useLeyendaStore } from "../../../stores/leyenda_store";
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const leyendaStore = useLeyendaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { leyendaActual } = storeToRefs(leyendaStore);

onBeforeMount(async () => {
  leyendaStore.loadVigente();
});
</script>

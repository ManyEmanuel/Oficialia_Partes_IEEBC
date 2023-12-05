<template>
  <q-dialog
    v-model="modalViewer"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Visor</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarModal(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <VuePdfEmbed :source="adjunto_url" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import VuePdfEmbed from "vue-pdf-embed";
import { useRecepcionStore } from "../../../stores/recepcion_store";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const { modalViewer, modal, adjunto_url } = storeToRefs(recepcionStore);
const actualizarModal = () => {
  //adjuntoStore.actualizarViewer(false);
};
</script>
<style></style>

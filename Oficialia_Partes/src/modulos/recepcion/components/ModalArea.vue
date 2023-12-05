<template>
  <q-dialog
    v-model="modalArea"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Areas de destino</div>
      </q-card-section>
      <q-card-section v-if="isCC == false">
        <div class="row items-start">
          <div
            v-for="item in lAreas"
            :key="item.value"
            class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
          >
            <q-checkbox
              v-model="item.select"
              :label="item.label"
              color="purple"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
        </div>
        <q-space />
        <q-card-actions align="right">
          <q-btn
            class="q-mr-sm q-mb-sm"
            label="Listo"
            icon-right="done"
            @click="getNombres(false)"
            flat
            dense
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
      <q-card-section v-if="isCC == true">
        <div class="row items-start">
          <div
            v-for="items in lAreasCC"
            :key="items.value"
            class="col-lg-6 col-md-6 col-sm-6 col-xs-6"
          >
            <q-checkbox
              v-model="items.select"
              :label="items.label"
              color="purple"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
        </div>
        <q-space />
        <q-card-actions align="right">
          <q-btn
            class="q-mr-sm q-mb-sm"
            label="Listo"
            icon-right="done"
            @click="getNombres(true)"
            flat
            dense
            v-close-popup
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useRecepcionStore } from "../../../stores/recepcion_store";
//

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const { modalArea, lAreas, lAreasCC, isCC } = storeToRefs(recepcionStore);

const actualizarArea = () => {
  //recepcionStore.initArea();
  recepcionStore.actualizarArea(false, false);
};

const getNombres = (valor) => {
  recepcionStore.loadNombresArea(valor);
};
</script>

<template>
  <q-dialog
    v-model="modalResumen"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <div class="text-h6 text-center">
          Folio {{ resumenRecepcion.folio }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              label="Fecha y hora de recepción"
              readonly
              v-model="resumenRecepcion.fecha_recepcion"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              label="Número de expediente"
              readonly
              v-model="resumenRecepcion.expediente"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              label="Clasificación del expediente"
              readonly
              v-model="resumenRecepcion.clasificacion"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              label="Institución donde se remite"
              readonly
              v-model="resumenRecepcion.institucion"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Quien remite"
              readonly
              v-model="resumenRecepcion.remitente"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Asunto del expediente"
              readonly
              v-model="resumenRecepcion.asunto"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Descripción del expediente"
              readonly
              v-model="resumenRecepcion.descripcion"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Áreas asignadas"
              readonly
              v-model="resumenRecepcion.area_asignado"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Áreas marcadas con copia"
              readonly
              v-model="resumenRecepcion.area_cc"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              label="Nota de la recepción del documento"
              readonly
              v-model="resumenRecepcion.nota"
              autogrow
            >
            </q-input>
          </div>
          <div class="text-caption q-mt-sm q-mb-xs text-italic text-justify">
            "{{ resumenRecepcion.leyenda }}"
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pa-sm">
        <TablaAdjuntos />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useRecepcionStore } from "../../../stores/recepcion_store";
import TablaAdjuntos from "./TablaAdjuntos.vue";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const { modalResumen, resumenRecepcion } = storeToRefs(recepcionStore);
</script>

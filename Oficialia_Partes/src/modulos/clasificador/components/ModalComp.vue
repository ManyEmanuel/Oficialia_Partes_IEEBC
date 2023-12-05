<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Clasificadores</div>
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
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="clasificador.nombre"
              label="Nombre del clasificador"
              lazy-rules
              hint="Ingrese nombre del clasificador"
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="clasificador.descripcion"
              label="Descripción del clasificador"
              hint="Ingrese una descripción del clasificador"
              autogrow
            >
            </q-input>
          </div>
          <br />
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModal(false)"
              />
              <q-btn
                label="Guardar"
                type="submit"
                color="positive"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useClasificadorStore } from "../../../stores/clasificador_store";
import { useRecepcionStore } from "src/stores/recepcion_store";

const $q = useQuasar();
const clasificadorStore = useClasificadorStore();
const recepcionStore = useRecepcionStore();
const { modal, clasificador, isEditar } = storeToRefs(clasificadorStore);

const actualizarModal = () => {
  clasificadorStore.initClasificador();
  clasificadorStore.updateEditar(false);
  clasificadorStore.actualizarModal(false);
};

const onSubmit = async () => {
  let resp = null;
  if (isEditar.value == true) {
    resp = await clasificadorStore.updateClasificador(clasificador.value);
  } else {
    resp = await clasificadorStore.createClasificador(clasificador.value);
    clasificadorStore.loadClasificadorList();
  }
  if (resp.success) {
    $q.notify({
      type: "positive",
      message: resp.data,
    });
    //loading.value = false;
    actualizarModal(false);
  } else {
    $q.notify({
      type: "negative",
      message: resp.data,
    });
    //loading.value = false;
  }
};
</script>

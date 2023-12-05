<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Instituciones</div>
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
              v-model="institucion.nombre"
              label="Nombre de la institución"
              hint="Ingrese el nombre de la institución"
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="institucion.siglas"
              label="Siglas de la institución"
              hint="Ingrese las siglas de la institución"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="institucion.descripcion"
              label="Descripción de la institución"
              hint="Ingrese una descripción institución"
              autogrow
            >
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-input
              v-model="institucion.telefono"
              type="tel"
              label="Teléfono de la institución"
              hint="Ingrese el teléfono de la institución"
            >
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-input
              v-model="institucion.correo"
              type="email"
              label="Correo de la institución"
              hint="Ingrese el correo de la institución"
            >
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 text-center">
            <q-checkbox label="Activar" v-model="institucion.activo" />
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
import { useInstitucionesStore } from "../../../stores/instituciones_store";

const $q = useQuasar();
const institucionStore = useInstitucionesStore();
const { modal, institucion, isEditar } = storeToRefs(institucionStore);

const actualizarModal = () => {
  institucionStore.initInstitucion();
  institucionStore.updateEditar(false);
  institucionStore.actualizarModal(false);
};

const onSubmit = async () => {
  let resp = null;
  if (isEditar.value == true) {
    resp = await institucionStore.updateInstitucion(institucion.value);
  } else {
    resp = await institucionStore.createInstitucion(institucion.value);
    institucionStore.loadInstitucionesList();
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

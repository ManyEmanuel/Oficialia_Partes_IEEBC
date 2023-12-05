<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Remitentes</div>
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
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-select
              v-model="institucion_Id"
              :options="opcionesInstitucion"
              use-input
              @filter="filterInst"
              label="Instituciones"
              hint="Seleccione una institución"
              lazy-rules
              :rules="[(val) => !!val || 'La institución es requerida']"
            >
              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click="actualizarInstitucion()"
                >
                  <q-tooltip>Agregar remitente</q-tooltip>
                </q-btn>
              </template>
            </q-select>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="remitente.nombres"
              label="Nombre de remitente"
              hint="Ingrese el nombre del remitente"
              lazy-rules
              :rules="[(val) => !!val || 'El nombre es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="remitente.apellido_Paterno"
              label="Apellido paterno"
              hint="Ingrese el apellido paterno"
            >
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="remitente.apellido_Materno"
              label="Apellido materno"
              hint="Ingrese el apellido materno"
            >
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-input
              v-model="remitente.cargo"
              label="Cargo del remitente"
              hint="Ingrese el cargo del remitente"
            >
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-input
              v-model="remitente.telefono"
              type="tel"
              label="Teléfono del remitente"
              hint="Ingrese el teléfono del remitente"
            >
            </q-input>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <q-input
              v-model="remitente.correo"
              type="email"
              label="Correo del remitente"
              hint="Ingrese el correo del remitente"
            >
            </q-input>
          </div>

          <br />
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
import { ref, onBeforeMount, watch } from "vue";
import { useRemitentesStore } from "../../../stores/remitente_store";
import { useInstitucionesStore } from "../../../stores/instituciones_store";

const $q = useQuasar();
const remitenteStore = useRemitentesStore();
const institucionStore = useInstitucionesStore();
const { modal, remitente, isEditar } = storeToRefs(remitenteStore);
const { institucionesOpt } = storeToRefs(institucionStore);
const opcionesInstitucion = ref([...institucionesOpt.value]);
const institucion_Id = ref(null);

const actualizarModal = () => {
  remitenteStore.initRemitente();
  remitenteStore.updateEditar(false);
  remitenteStore.actualizarModal(false);
  institucion_Id.value = null;
};

const actualizarInstitucion = () => {
  institucionStore.actualizarModal(true);
};

const filtro = () => {};

onBeforeMount(() => {
  institucionStore.loadInstitucionesList();
});

watch(remitente.value, (val) => {
  if (val.id != null) {
    cargarInstitucion(val);
  }
});

const cargarInstitucion = async (val) => {
  const institucionFiltrada = institucionesOpt.value.find(
    (x) => x.value == `${val.institucion_id}`
  );
  institucion_Id.value = institucionFiltrada;
};

const onSubmit = async () => {
  let resp = null;
  remitente.value.institucion_id = institucion_Id.value.value;
  if (isEditar.value == true) {
    resp = await remitenteStore.updateRemitente(remitente.value);
  } else {
    resp = await remitenteStore.createRemitente(remitente.value);
    remitenteStore.loadRemitenteList();
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

const filterInst = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesInstitucion.value = institucionesOpt.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesInstitucion.value = institucionesOpt.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

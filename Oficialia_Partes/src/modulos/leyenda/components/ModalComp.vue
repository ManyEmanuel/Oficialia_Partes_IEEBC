<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Ley de protección de datos personales</div>
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
              v-model="leyenda.leyenda"
              label="Ley de protección de datos personales"
              lazy-rules
              type="textarea"
              hint="Ingrese la ley"
              :rules="[(val) => !!val || 'La ley es requerida']"
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
import { ref, onBeforeMount } from "vue";
import { useLeyendaStore } from "../../../stores/leyenda_store";

const $q = useQuasar();
const leyendaStore = useLeyendaStore();
const { modal, leyenda } = storeToRefs(leyendaStore);

onBeforeMount(() => {
  leyendaStore.loadLeyendas();
});

const actualizarModal = () => {
  //leyendaStore.initLeyenda();
  //leyendaStore.updateEditar(false);
  leyendaStore.actualizarModal(false);
};

const onSubmit = async () => {
  let resp = null;
  resp = await leyendaStore.updateLey(leyenda.value);
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

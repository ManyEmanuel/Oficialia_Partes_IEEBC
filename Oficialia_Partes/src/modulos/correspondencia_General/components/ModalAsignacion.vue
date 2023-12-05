<template>
  <q-dialog
    v-model="modalAsignacion"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Personal del área</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarEmpleado()"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <div class="row items-start">
          <div
            v-for="item in lEmpleados"
            :key="item.empleado_Id"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <q-checkbox
              v-model="item.accede"
              :label="item.label"
              color="purple"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
              :true-value="true"
              :false-value="false"
            />
          </div>
        </div>
        <div class="row items-start">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="notaAsignacion"
              autogrow
              label="Nota de asignación"
              hint="Ingrese una nota para el usuario asignado, si el caso lo requiere"
            >
            </q-input>
          </div>
        </div>
        <q-space />
        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            type="reset"
            color="negative"
            @click="actualizarEmpleado()"
          />
          <q-btn
            label="Asignar"
            @click="asignacion()"
            color="positive"
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
import { useCorrespondenciaGeneralStore } from "../../../stores/correspondencia_General_store";

const $q = useQuasar();
const correspondenciaGeneralStore = useCorrespondenciaGeneralStore();
const { modalAsignacion, lEmpleados, recepcion_Id, notaAsignacion } =
  storeToRefs(correspondenciaGeneralStore);

const actualizarEmpleado = () => {
  correspondenciaGeneralStore.actualizarEmpleado(false);
};

const asignacion = async () => {
  $q.loading.show();
  let resp = null;
  let edicionResp = null;
  let personalArray = [];
  let personalEdicionArray = [];
  let personalAsignado = lEmpleados.value.filter(
    (x) => x.accede == true && x.id_Registro == 0
  );
  let personalEdicion = lEmpleados.value.filter(
    (x) =>
      x.id_Registro != 0 &&
      (x.accede != x.registro || x.nota != notaAsignacion.value)
  );
  personalArray = personalAsignado.map((personal) => {
    return {
      empleado_Id: personal.empleado_Id,
      recepcion_Documento_Id: recepcion_Id.value,
      accede: personal.accede,
      sub_asignado: true,
      nota: notaAsignacion.value,
      atendido: false,
      observaciones: "",
    };
  });

  personalEdicionArray = personalEdicion.map((edicionPersonal) => {
    return {
      id: edicionPersonal.id_Registro,
      empleado_Id: edicionPersonal.empleado_Id,
      recepcion_Documento_Id: edicionPersonal.recepcion_Documento_Id,
      accede: edicionPersonal.accede,
      sub_asignado: true,
      nota: notaAsignacion.value,
      atendido: false,
      observaciones: "",
    };
  });
  if (personalArray.length > 0) {
    resp = await correspondenciaGeneralStore.createAsignacionEmpleados(
      personalArray
    );
    if (resp.success) {
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      //actualizarModal(false);
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
      //loading.value = false;
    }
  }

  if (personalEdicionArray.length > 0) {
    edicionResp = await correspondenciaGeneralStore.editAsignacionEmpleados(
      personalEdicionArray
    );
    if (edicionResp.success) {
      $q.notify({
        type: "positive",
        message: edicionResp.data,
      });
      //actualizarModal(false);
    } else {
      $q.notify({
        type: "negative",
        message: edicionResp.data,
      });
      //loading.value = false;
    }
  }

  $q.loading.hide();
};
</script>

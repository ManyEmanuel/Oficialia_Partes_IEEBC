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
              v-model="notaAsignacionPersonal"
              autogrow
              label="Nota de asignación para el personal"
              hint="Ingrese una nota para el personal asignado, si el caso lo requiere"
            >
            </q-input>
          </div>
        </div>
        <br />
        <div class="text-h6">Áreas a asignar</div>
        <br />
        <div class="row items-start">
          <div
            v-for="item in lAreas"
            :key="item.area_Id"
            class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
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
        <div v-if="lAreas.length > 0" class="row items-start">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="notaAsignacionArea"
              autogrow
              label="Nota de asignación para las áreas"
              hint="Ingrese una nota para las areas asignadas, si el caso lo requiere"
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
import { useCorrespondenciaAdministrativaStore } from "../../../stores/correspondencia_Administrativa_store";

const $q = useQuasar();
const correspondenciaAdminStore = useCorrespondenciaAdministrativaStore();
const {
  modalAsignacion,
  lEmpleados,
  recepcion_Id,
  lAreas,
  notaAsignacionPersonal,
  notaAsignacionArea,
} = storeToRefs(correspondenciaAdminStore);

const actualizarEmpleado = () => {
  correspondenciaAdminStore.actualizarEmpleado(false);
};

const asignacion = async () => {
  $q.loading.show();
  let resp = null;
  let areaResp = null;
  let edicionResp = null;
  let areaEdicionResp = null;
  let personalArray = [];
  let personalEdicionArray = [];
  let areaArray = [];
  let areaEdicionArray = [];

  let personalAsignado = lEmpleados.value.filter(
    (x) => x.accede == true && x.id_Registro == 0
  );
  let personalEdicion = lEmpleados.value.filter(
    (x) =>
      x.id_Registro != 0 &&
      (x.accede != x.registro || x.nota != notaAsignacionPersonal.value)
  );
  let areAsignado = lAreas.value.filter((x) => x.accede == true && x.id == 0);

  let areaEdicion = lAreas.value.filter(
    (x) =>
      x.id != 0 &&
      (x.accede != x.registro || x.nota != notaAsignacionArea.value)
  );

  console.log("Este es el area de edicion", areaEdicion);
  let nombreArea = await correspondenciaAdminStore.obtenerArea();
  console.log("Este es el nombre del area", nombreArea);
  personalArray = personalAsignado.map((personal) => {
    return {
      empleado_Id: personal.empleado_Id,
      recepcion_Documento_Id: recepcion_Id.value,
      accede: personal.accede,
      sub_asignado: true,
      nota: notaAsignacionPersonal.value,
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
      nota: notaAsignacionPersonal.value,
      atendido: false,
      observaciones: "",
    };
  });

  areaArray = areAsignado.map((area) => {
    return {
      area_Id: area.area_Id,
      accede: area.accede,
      cc: area.cc,
      recepcion_Documento_Id: area.recepcion_Documento_Id,
      area_Origen: "Asignado en " + nombreArea.data,
      nota: notaAsignacionArea.value,
      atendido: false,
      observaciones: "",
    };
  });

  areaEdicionArray = areaEdicion.map((area) => {
    return {
      id: area.id,
      area_Id: area.area_Id,
      accede: area.accede,
      cc: area.cc,
      recepcion_Documento_Id: area.recepcion_Documento_Id,
      nota: notaAsignacionArea.value,
      atendido: false,
      observaciones: "",
    };
  });

  if (personalArray.length > 0) {
    resp = await correspondenciaAdminStore.createAsignacionEmpleados(
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
  if (areaArray.length > 0) {
    areaResp = await correspondenciaAdminStore.createAsignacionAreas(areaArray);
    if (areaResp.success) {
      $q.notify({
        type: "positive",
        message: areaResp.data,
      });
      //actualizarModal(false);
    } else {
      $q.notify({
        type: "negative",
        message: areaResp.data,
      });
      //loading.value = false;
    }
  }
  if (personalEdicionArray.length > 0) {
    edicionResp = await correspondenciaAdminStore.editAsignacionEmpleados(
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

  if (areaEdicionArray.length > 0) {
    areaEdicionResp = await correspondenciaAdminStore.editAsignacionesAreas(
      areaEdicionArray
    );
    if (areaEdicionResp.success) {
      $q.notify({
        type: "positive",
        message: areaEdicionResp.data,
      });
      //actualizarModal(false);
    } else {
      $q.notify({
        type: "negative",
        message: areaEdicionResp.data,
      });
      //loading.value = false;
    }
  }

  $q.loading.hide();
};
</script>

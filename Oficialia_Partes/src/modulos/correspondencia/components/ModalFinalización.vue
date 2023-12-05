<template>
  <q-dialog
    v-model="modalFinalizacion"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Seguimiento al folio {{ folio }}</div>
        <q-space />
        <q-btn
          icon="close"
          @click="actualizarFinalizacion()"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section class="row">
        <div class="col">
          <q-table
            :rows="finalizados"
            :columns="columns"
            :filter="filter"
            :loading="loading"
            :pagination="pagination"
            rows-per-page-label="Filas por pagina"
            no-data-label="No hay registros"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <div v-if="col.name === 'estatus'">
                    <label v-if="col.value == false || col.value == null"
                      >En proceso
                    </label>
                    <label v-else>Atendido </label>
                  </div>
                  <div v-else-if="col.name === 'nota'">
                    <label v-if="col.value === '' || col.value == null">
                    </label>
                    <label v-else>{{ col.value }} </label>
                  </div>
                  <label v-else>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch } from "vue";
import { useCorrespondenciaStore } from "../../../stores/correspondencia_store";

const $q = useQuasar();
const correspondenciaStore = useCorrespondenciaStore();
const { modalFinalizacion, finalizados, folio } =
  storeToRefs(correspondenciaStore);

const actualizarFinalizacion = () => {
  correspondenciaStore.actualizarFinalizacion(false);
};

const columns = [
  {
    name: "area",
    required: true,
    align: "center",
    label: "Area/Empleado",
    field: "area",
    sortable: true,
  },
  {
    name: "estatus",
    required: true,
    align: "center",
    label: "Seguimiento",
    field: "estatus",
    sortable: true,
  },
  {
    name: "nota",
    required: true,
    align: "center",
    label: "Observaciones",
    field: "nota",
    sortable: true,
  },
];

const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});
</script>

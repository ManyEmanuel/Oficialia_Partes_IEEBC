<template>
  <q-dialog
    v-model="historial"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <div class="q-pa-xs">
        <q-table
          :rows="leyendas"
          :columns="columns"
          :filter="filter"
          :loading="loading"
          row-key="id"
          rows-per-page-label="Filas por pagina"
          no-data-label="No hay registros"
        >
          <template v-slot:top="">
            <div class="q-table__title">Historial de ley</div>
            <q-space />
            <q-btn
              flat
              round
              dense
              icon="close"
              @click="historialModal(false)"
              class="q-ml-md"
            />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name == 'color'">
                  <q-badge :color="col.value" :label="col.value" />
                </div>
                <div v-else-if="col.name === 'leyenda'">
                  <q-btn
                    v-if="modulo.actualizar"
                    flat
                    round
                    color="purple-ieen"
                    icon="visibility"
                    @click="editar(col.value)"
                  >
                    <q-tooltip anchor="top middle" self="center middle">{{
                      col.value
                    }}</q-tooltip>
                  </q-btn>
                </div>
                <label v-else>{{ col.value }}</label>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useLeyendaStore } from "../../../stores/leyenda_store";
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const leyendaStore = useLeyendaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { leyendas, historial } = storeToRefs(leyendaStore);

onBeforeMount(() => {
  leyendaStore.loadHistorial();
});

const historialModal = () => {
  leyendaStore.historialModal(false);
};

const columns = [
  {
    name: "empleado",
    align: "center",
    label: "Personal que la modifico",
    field: "empleado",
    sortable: true,
  },
  {
    name: "fecha",
    align: "center",
    label: "Fecha entrada en vigor",
    field: "fecha",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus de la ley",
    field: "estatus",
    sortable: true,
  },
  {
    name: "leyenda",
    align: "center",
    label: "Ver ley",
    field: "leyenda",
    sortable: true,
    style: "width: 90px",
    headerStyle: "width: 100px",
  },
];

const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 10,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>

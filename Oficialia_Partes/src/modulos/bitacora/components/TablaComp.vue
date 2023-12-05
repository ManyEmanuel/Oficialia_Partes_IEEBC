<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="bitacoraList"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="name"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
          <div class="column items-end">
            <div class="col">
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filter"
                placeholder="Buscar.."
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useBitacoraStore } from "../../../stores/bitacora_store";
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const bitacoraStore = useBitacoraStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { bitacoraList, bitacora } = storeToRefs(bitacoraStore);

onBeforeMount(() => {
  bitacoraStore.loadBitacoraList();
});

const columns = [
  {
    name: "folio",
    align: "center",
    label: "Folio de recepción",
    field: "folio",
    sortable: true,
  },
  {
    name: "documento",
    align: "center",
    label: "Nombre del documento",
    field: "documento",
    sortable: true,
  },
  {
    name: "empleado",
    align: "center",
    label: "Personal que lo descargo",
    field: "empleado",
    sortable: true,
  },
  {
    name: "fecha_Descarga",
    align: "center",
    label: "Fecha de la descarga",
    field: "fecha_Descarga",
    sortable: true,
  },
  {
    name: "tipo_Dispositivo",
    align: "center",
    label: "Dispositivo donde se descargo",
    field: "tipo_Dispositivo",
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

const filter = ref("");
</script>

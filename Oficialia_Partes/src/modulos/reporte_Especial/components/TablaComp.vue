<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="totalClasificador"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
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
            <div class="col">
              Fecha: {{ textModel }}
              <q-btn
                icon-right="event"
                color="purple-ieen"
                label="Busqueda por fecha"
              >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="model"
                    :locale="myLocale"
                    mask="YYYY-MM-DD"
                    color="purple"
                    range
                  >
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn
                        label="Buscar"
                        color="primary"
                        flat
                        @click="buscarFecha()"
                        v-close-popup
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
              <q-btn
                type="button"
                class="q-ma-sm"
                color="purple-ieen"
                icon-right="search"
                label="Ver todos"
                @click="verTodos()"
              >
              </q-btn>

              <q-btn
                round
                color="purple-ieen"
                icon="picture_as_pdf"
                @click="crearReporte()"
              >
                <q-tooltip
                  >Generar reporte con la información de la tabla</q-tooltip
                >
              </q-btn>
            </div>
          </div>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import moment from "moment/moment";
import { useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useReporteStore } from "../../../stores/reporte_Especial_store";
import { useRecepcionStore } from "src/stores/recepcion_store";
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const reporteStore = useReporteStore();
const recepcionStore = useRecepcionStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { totalClasificador } = storeToRefs(reporteStore);
const model = ref(moment().format("YYYY-MM-DD"));
let textModel = ref(moment().format("YYYY-MM-DD"));
const { myLocale } = storeToRefs(recepcionStore);

onBeforeMount(() => {
  reporteStore.loadConteoClasificador();
});

const columns = [
  {
    name: "nombre",
    align: "center",
    label: "Nombre de clasificador",
    field: "nombre",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripcion del clasificador",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "total",
    align: "center",
    label: "Total de registros",
    field: "total",
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

watch(model, (nuevoValor, viejoValor) => {
  console.log(typeof nuevoValor);
  console.log(nuevoValor);
  if (typeof nuevoValor != "string") {
    console.log(nuevoValor);
    let { from, to } = nuevoValor;
    console.log("Esto es from", from, "Esto es to", to);
    textModel.value = "desde " + from + " hasta " + to;
  } else {
    textModel.value = nuevoValor;
  }
});

const verTodos = async () => {
  $q.loading.show();
  reporteStore.loadConteoClasificador();
  model.value = moment().format("YYYY-MM-DD");
  $q.loading.hide();
};

const buscarFecha = async () => {
  $q.loading.show();
  let resp = null;
  console.log(typeof model.value, "Esto es model", model.value);
  if (typeof model.value != "string") {
    let { from, to } = model.value;
    resp = await reporteStore.loadClasificadorFecha(from, to);
  } else {
    resp = await reporteStore.loadClasificadorFecha(model.value, 0);
  }
  $q.loading.hide();
};

const crearReporte = async () => {
  $q.loading.show();
  let resp = await reporteStore.createReporte(textModel.value);
  console.log("esto es resp", resp);
  let { success, data } = resp;
  if (success === true) {
    $q.notify({
      type: "positive",
      message: data,
    });
  } else {
    $q.notify({
      type: "negative",
      message: data,
    });
  }
  $q.loading.hide();
};
</script>

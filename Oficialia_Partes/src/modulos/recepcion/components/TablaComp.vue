<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="recepciones"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        :pagination="pagination"
        row-key="name"
        class="columna-fija"
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
                @click="verTodos"
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
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="modulo.actualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editar(col.value)"
                >
                  <q-tooltip>Editar registro</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="detalle(col.value)"
                >
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <!--<q-btn
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar registro</q-tooltip>
                </q-btn>-->
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  <q-separator />
  <!--<div class="row">
    <q-btn label="Prueba" @click="PruebaFecha()"> </q-btn>
    <q-date v-model="model" range :locale="myLocale" mask="YYYY-MM-DD" />
    Model: {{ model }}
    <q-btn label="ver todos" @click="recepcionStore.loadRecepciones()"> </q-btn>
  </div>-->
</template>

<script setup>
import { storeToRefs } from "pinia";
import moment from "moment/moment";
import { format, useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useRecepcionStore } from "../../../stores/recepcion_store";
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { recepciones, prueba, valores, myLocale } = storeToRefs(recepcionStore);
const model = ref(moment().format("YYYY-MM-DD"));
let textModel = ref(moment().format("YYYY-MM-DD"));

onBeforeMount(() => {
  recepcionStore.loadRecepciones();
  recepcionStore.loadResponsable();
});

const columns = [
  {
    name: "folio",
    required: true,
    align: "center",
    label: "Folio",
    field: "folio",
    sortable: true,
    field: (row) => row.folio,
  },
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
  },
  {
    name: "clasificacion",
    align: "center",
    label: "Clasificación del folio",
    field: "clasificacion",
    sortable: true,
  },
  {
    name: "institucion",
    align: "center",
    label: "Institución del remitente",
    field: "institucion",
    sortable: true,
  },
  {
    name: "remitente",
    align: "center",
    label: "Nombre del remitente",
    field: "remitente",
    sortable: true,
  },
  {
    name: "asunto",
    align: "center",
    label: "Asunto del oficio",
    field: "asunto",
    sortable: true,
  },
  {
    name: "expediente_Oficio",
    align: "center",
    label: "Expediente del oficio",
    field: "expediente_Oficio",
    sortable: true,
  },
  {
    name: "fecha_Recepcion",
    align: "center",
    label: "Fecha y hora de recepción",
    field: "fecha_Recepcion",
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

const verValores = async () => {
  console.log(valores.value);
};

const editar = async (id) => {
  $q.loading.show();
  await recepcionStore.loadRecepcion(id);
  recepcionStore.updateEditar(true);
  recepcionStore.actualizarModal(true);
  //await recepcionStore.loadRemitente(id);
  //remitenteStore.updateEditar(true);
  //await espera();
  //remitenteStore.actualizarModal(true);
  $q.loading.hide();
};

const crearReporte = async () => {
  $q.loading.show();
  let resp = await recepcionStore.createReporte(
    recepciones.value,
    textModel.value
  );
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

const detalle = async (id) => {
  let empleado = null;
  let area = null;
  if (localStorage.getItem("tipoEmp") == "JefeArea") {
    area = parseInt(localStorage.getItem("area"));
    empleado = 0;
  } else if (localStorage.getItem("tipoEmp") == "Empleado") {
    empleado = parseInt(localStorage.getItem("empleado"));
    area = 0;
  }
  await recepcionStore.loadResumenRecepcion(id, area, empleado, true);
  recepcionStore.actualizarResumen(true);
};

const buscarFecha = async () => {
  $q.loading.show();
  let resp = null;
  if (typeof model.value != "string") {
    let { from, to } = model.value;
    resp = await recepcionStore.loadRecepcionesFecha(from, to);
  } else {
    resp = await recepcionStore.loadRecepcionesFecha(model.value, 0);
  }
  $q.loading.hide();
};

const verTodos = async () => {
  recepcionStore.loadRecepciones();
  model.value = moment().format("YYYY-MM-DD");
};
watch(model, (nuevoValor, viejoValor) => {
  console.log(typeof nuevoValor);
  console.log(nuevoValor);
  if (typeof nuevoValor != "string") {
    console.log(nuevoValor);
    let { from, to } = nuevoValor;
    console.log("Esto es from", from, "Esto es to", to);
    textModel.value = "Desde " + from + " hasta " + to;
  } else {
    textModel.value = nuevoValor;
  }
});

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminación de registro",
    message: "¿Está seguro de eliminar el registro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "positive",
      label: "¡Sí!, Eliminar",
    },
    cancel: {
      color: "negative",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await recepcionStore.deleteRecepcion(id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};
</script>
<style lang="sass">
.columna-fija
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: #fff

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

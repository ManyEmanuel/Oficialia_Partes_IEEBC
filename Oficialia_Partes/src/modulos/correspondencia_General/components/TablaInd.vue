<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="correspondenciasInd"
        :columns="columns"
        :filter="filter"
        :loading="loading"
        class="columna-fija"
        :pagination="pagination"
        visible-columns="folio,institucion,remitente,fecha_Recepcion,expediente_Oficio,id,atendido"
        rows-per-page-label="Filas por página"
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
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              auto-width
            >
              <div v-if="col.name === 'id'">
                <q-btn
                  size="sm"
                  color="purple-ieen"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                >
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="how_to_reg"
                  @click="asignar(col.value)"
                >
                  <q-tooltip>Asignar empleado</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="attach_file"
                  @click="adjunto(col.value)"
                >
                  <q-tooltip>Archivos adjuntos</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="search"
                  @click="detalle(col.value)"
                  ><q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="person"
                  @click="asignaciones(col.value)"
                >
                  <q-tooltip>Ver asignación</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name === 'atendido'">
                <q-btn
                  v-if="col.value == false || col.value == null"
                  flat
                  round
                  color="purple-ieen"
                  icon="rule"
                  @click="editarAsignacion(props.row.id_registro)"
                >
                  <q-tooltip>Atender la asignación</q-tooltip>
                </q-btn>
                <label v-else>Atendido </label>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <strong>Clasificación del oficio: </strong>
                {{ props.row.clasificacion }}
                <br />
                <strong>Asunto del oficio: </strong> {{ props.row.asunto }}
                <br />
                <strong>Asignación de origen: </strong> {{ props.row.origen }}
                <br />
                <strong>Tipo de notificación: </strong> {{ props.row.tipo }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
  <q-dialog
    v-model="modalAdjuntos"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-actions align="right">
        <q-btn
          icon="close"
          @click="actualizarAdjunto(false)"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-actions>
      <TablaAdjuntos />
      <ModalVisorComp />
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="modelAtencion"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 450px; max-width: 80vw" class="q-pa-xs">
      <q-card-actions align="right">
        <div class="text-h6 text-center">Finalizar asignación</div>
        <q-space />
        <q-btn
          icon="close"
          @click="modelAtencion = false"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-actions>

      <q-card-section>
        <q-input
          v-model="textoAsignación"
          label="Nota de conclusión"
          hint="Descripción breve, en su caso, referencia de número de oficio"
          autogrow
          lazy-rules
          :rules="[(val) => !!val || 'Agregue una descripción']"
        >
        </q-input>
      </q-card-section>
      <q-space />
      <div class="text-right q-gutter-xs">
        <q-btn
          label="Cancelar"
          type="reset"
          color="negative"
          @click="modelAtencion = false"
        />
        <q-btn
          label="Finalizar"
          @click="finalizarAsignacion()"
          color="positive"
          class="q-ml-sm"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import moment from "moment/moment";
import { onBeforeMount, ref, watch } from "vue";
import { useCorrespondenciaGeneralStore } from "../../../stores/correspondencia_General_store";
import { useCorrespondenciaStore } from "../../../stores/correspondencia_store";
import { useRecepcionStore } from "src/stores/recepcion_store";
import { useAuthStore } from "../../../stores/auth_store";
import TablaAdjuntos from "src/modulos/recepcion/components/TablaAdjuntos.vue";
import ModalVisorComp from "src/modulos/recepcion/components/ModalVisorComp.vue";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const correspondenciaGeneralStore = useCorrespondenciaGeneralStore();
const correspondenciaStore = useCorrespondenciaStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { correspondenciasInd, modalAdjuntos } = storeToRefs(
  correspondenciaGeneralStore
);
const { myLocale } = storeToRefs(recepcionStore);
const model = ref(moment().format("YYYY-MM-DD"));
let textModel = ref(moment().format("YYYY-MM-DD"));
let tipo = localStorage.getItem("tipoEmp");
console.log(tipo);
onBeforeMount(() => {
  console.log("Entro al before de correspondencia Indivifdual");
  correspondenciaGeneralStore.loadCorrespondenciaIndividual();
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
    name: "atendido",
    align: "center",
    label: "Seguimiento",
    field: "atendido",
    sortable: true,
  },
  {
    name: "fecha_Recepcion",
    align: "center",
    label: "Fecha y hora de recepción",
    field: "fecha_Recepcion",
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
    name: "origen",
    align: "center",
    label: "Asignación de origen",
    field: "origen",
    sortable: false,
  },
  {
    name: "tipo",
    align: "center",
    label: "Tipo de notificación",
    field: "tipo",
    sortable: false,
  },
  {
    name: "id_registro",
    align: "center",
    label: "Atender",
    field: "id_registro",
    sortable: false,
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
let id_registro = ref();
let textoAsignación = ref("");
let modelAtencion = ref(false);

const verValores = async () => {
  console.log(valores.value);
};

const buscarFecha = async () => {
  $q.loading.show();
  let resp = null;
  if (typeof model.value != "string") {
    let { from, to } = model.value;
    resp = await correspondenciaGeneralStore.loadCorrespondenciaFechaInd(
      from,
      to
    );
  } else {
    resp = await correspondenciaGeneralStore.loadCorrespondenciaFechaInd(
      model.value,
      0
    );
  }
  $q.loading.hide();
};

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
  correspondenciaGeneralStore.loadCorrespondenciaIndividual();
  model.value = moment().format("YYYY-MM-DD");
};

const asignar = async (id) => {
  $q.loading.show();
  await correspondenciaGeneralStore.loadPersonalArea(id);
  correspondenciaGeneralStore.actualizarEmpleado(true);
  //await recepcionStore.loadRemitente(id);
  //remitenteStore.updateEditar(true);
  //await espera();
  //remitenteStore.actualizarModal(true);
  $q.loading.hide();
};

const adjunto = async (id) => {
  await recepcionStore.loadDocumentos(id);
  actualizarAdjunto(true);
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
  await recepcionStore.loadResumenRecepcion(id, area, empleado, false);
  recepcionStore.actualizarResumen(true);
};

const crearReporte = async () => {
  $q.loading.show();
  let resp = await correspondenciaGeneralStore.createReporte(
    correspondenciasInd.value,
    textModel.value,
    true
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

const actualizarAdjunto = (valor) => {
  correspondenciaGeneralStore.actualizarAdjunto(valor);
};

const editarAsignacion = async (id) => {
  id_registro.value = id;
  modelAtencion.value = true;
};

const asignaciones = async (id) => {
  await correspondenciaStore.loadAsignaciones(id);
  correspondenciaStore.actualizarFinalizacion(true);
};

const finalizarAsignacion = async () => {
  $q.loading.show();
  let resp = await correspondenciaStore.createAtencionAsignacion(
    id_registro.value,
    textoAsignación.value
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
  textoAsignación.value = "";
  modelAtencion.value = false;
  correspondenciaGeneralStore.loadCorrespondenciaIndividual();
  $q.loading.hide();
};
/*
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
};*/
</script>
<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */


  /* specifying max-width so the example can
    highlight the sticky column on any browser window */


  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #fff !important

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
</style>

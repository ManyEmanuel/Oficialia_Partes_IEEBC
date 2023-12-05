<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Recepción de documento</div>
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
            <q-input
              label="Fecha y hora de recepción"
              hint="Ingrese fecha y hora"
              v-model="recepcion.fecha_Recepcion"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="recepcion.fecha_Recepcion"
                      :locale="myLocale"
                      mask="YYYY-MM-DD HH:mm"
                      color="purple"
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="recepcion.fecha_Recepcion"
                      mask="YYYY-MM-DD HH:mm"
                      color="purple"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="black"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <q-input
              v-model="recepcion.expediente_Oficio"
              label="Oficio/Expediente"
              hint="Ingrese el numero del oficio o expediente"
              lazy-rules
              :rules="[(val) => !!val || 'El oficio/expediente es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              v-model="clasificador_Id"
              :options="opcionesClasificadores"
              use-input
              @filter="filterCla"
              label="Clasificador"
              hint="Seleccione un clasificador"
              lazy-rules
              :rules="[(val) => !!val || 'El clasificador es requerido']"
            >
              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click="actualizarClasificador()"
                >
                  <q-tooltip>Agregar clasificador</q-tooltip>
                </q-btn>
              </template>
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-select
              v-model="remitente_Id"
              :options="opcionesRemitentes"
              use-input
              @filter="filterRem"
              label="Remitente"
              hint="Seleccione un remitente"
              lazy-rules
              :rules="[(val) => !!val || 'El remitente es requerido']"
            >
              <template v-slot:after>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click="actualizarRemitente()"
                >
                  <q-tooltip>Agregar remitente</q-tooltip>
                </q-btn>
              </template>
            </q-select>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="textoArea.nombre"
              readonly
              autogrow
              label="Área en turno"
              hint="Seleccione área(s) en turno"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click="actualizarArea(false)"
                />
              </template>
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="textoArea.nombreCC"
              readonly
              autogrow
              label="CC"
              hint="Seleccione área(s) para marcar copia"
            >
              <template v-slot:append>
                <q-btn
                  round
                  dense
                  flat
                  icon="add"
                  @click="actualizarArea(true)"
                />
              </template>
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="recepcion.asunto"
              autogrow
              label="Asunto"
              hint="Ingrese el asunto del oficio/expediente"
              lazy-rules
              :rules="[(val) => !!val || 'El asunto es requerido']"
            >
            </q-input>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-input
              v-model="recepcion.descripcion"
              autogrow
              label="Descripción"
              hint="Ingrese una descripción del oficio/expediente"
              lazy-rules
              :rules="[(val) => !!val || 'El asunto es requerido']"
            >
            </q-input>
          </div>
          <div
            v-if="isEditar == true"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12"
          >
            <TablaAdjuntos />
          </div>

          <div
            v-if="isEditar == true"
            class="text-caption q-mt-sm q-mb-xs text-italic text-justify"
          >
            "{{ leyenda.leyenda }}"
          </div>
          <div
            v-if="isEditar == false"
            class="text-caption q-mt-sm q-mb-xs text-italic text-justify"
          >
            "{{ leyendaActual.leyenda }}"
          </div>
          <q-space />
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
    <ModalArea />
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useRecepcionStore } from "../../../stores/recepcion_store";
import { useLeyendaStore } from "src/stores/leyenda_store";
import { useClasificadorStore } from "../../../stores/clasificador_store";
import { useRemitentesStore } from "../../../stores/remitente_store";
import { useAuthStore } from "../../../stores/auth_store";
import ModalArea from "../components/ModalArea.vue";
import ModalDoc from "../components/ModalDoc.vue";
import TablaAdjuntos from "./TablaAdjuntos.vue";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const leyendaStore = useLeyendaStore();
const remitenteStore = useRemitentesStore();
const clasificadorStore = useClasificadorStore();
const adjuntos = ref(null);
const anexos = ref(null);
const authStore = useAuthStore();
const {
  modal,
  modalDocs,
  recepcion,
  isEditar,
  myLocale,
  lAreas,
  lAreasCC,
  lAdjuntos,
  areaN,
  adjunto_url,
  //area,
  textoArea,
  datosModal,
} = storeToRefs(recepcionStore);
const { leyendaActual, leyenda } = storeToRefs(leyendaStore);
const { clasificadoresOpt } = storeToRefs(clasificadorStore);
const { remitentesOpt } = storeToRefs(remitenteStore);
const opcionesRemitentes = ref([...remitentesOpt.value]);
const opcionesClasificadores = ref([...clasificadoresOpt.value]);
let clasificador_Id = ref(null);
let remitente_Id = ref(null);
const listOpciones = ref([]);
const columns = [
  {
    name: "titulo",
    align: "center",
    label: "Nombre del documento",
    field: "titulo",
    sortable: true,
  },
  {
    name: "anexo",
    align: "center",
    label: "Tipo documento",
    field: "anexo",
    sortable: true,
  },
  /* {
    name: "hojas",
    align: "center",
    label: "Páginas del documento",
    field: "hojas",
    sortable: true,
  },*/
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
  },
];

const actualizarModal = () => {
  recepcionStore.initRecepcion();
  //recepcionStore.initArea();
  recepcionStore.updateEditar(false);
  recepcionStore.actualizarModal(false);
  clasificador_Id.value = null;
  remitente_Id.value = null;
};

const actualizarClasificador = () => {
  //recepcionStore.actualizarModal(false);
  clasificadorStore.actualizarModal(true);
};

const actualizarRemitente = () => {
  remitenteStore.actualizarModal(true);
};

const verDocs = async (id) => {
  $q.loading.show();
  await recepcionStore.loadDocumento(id);
  recepcionStore.actualizarViewer(true);
  $q.loading.hide();
};

const descargar = async (id) => {
  $q.loading.show();
  await recepcionStore.loadDocumento(id);
  const adjunto_Item = lAdjuntos.value.find((x) => x.id == id);
  const link = document.createElement("a");
  link.href = recepcionStore.adjunto_url;
  link.setAttribute("download", adjunto_Item.titulo);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

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
    const resp = await recepcionStore.deleteAdjunto(recepcion.value.id, id);
    if (resp.success) {
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
      });
      recepcionStore.loadDocumentos(recepcion.value.id);
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
      });
    }
  });
};

const actualizarArea = (valor) => {
  //recepcionStore.initArea();
  recepcionStore.actualizarArea(true, valor);
};

const actualizarVar = () => {
  clasificador_Id.value = null;
  remitente_Id.value = null;
};

const actualizarDoc = (valor) => {
  recepcionStore.actualizarDocs(valor);
  //clasificador_Id.value = null;
  //remitente_Id.value = null;
};

onBeforeMount(() => {
  clasificadorStore.loadClasificadorList();
  remitenteStore.loadRemitenteList();
  leyendaStore.loadVigente();
});

watch(recepcion.value, (val) => {
  if (val.id != null) {
    cargarClasificador(val);
    cargarRemitente(val);
    cargarLeyenda(val);
  }
});

const cargarClasificador = async (val) => {
  if (clasificador_Id.value == null) {
    let clasificadorFiltrado = clasificadoresOpt.value.find(
      (x) => x.value == `${val.clasificacion_Id}`
    );
    clasificador_Id.value = clasificadorFiltrado;
  }
};

const cargarRemitente = async (val) => {
  if (remitente_Id.value == null) {
    let remitenteFiltrado = remitentesOpt.value.find(
      (x) => x.value == `${val.remitente_Id}`
    );
    remitente_Id.value = remitenteFiltrado;
  }
};

const cargarLeyenda = async (val) => {
  leyendaStore.loadLeyenda(val.configuracion_Oficialia_Id);
};

const AgruparAreas = async () => {
  let areasArray = [];
  let asignadoAreas = lAreas.value.filter(
    (x) => x.select == true || x.area_Id != 0
  );
  let copiaAreas = lAreasCC.value.filter(
    (x) => x.select == true || x.area_Id != 0
  );
  let unicAreas = asignadoAreas.concat(copiaAreas);
  if (isEditar.value == true) {
    let nuevasAreas = unicAreas.filter((x) => x.area_Id == 0);
    let actualizarAreas = unicAreas.filter((x) => x.area_Id != 0);
    areasArray = actualizarAreas.map((area) => {
      return {
        id: area.area_Id,
        area_Id: area.value,
        accede: area.select,
        cc: area.cc,
        recepcion_Documento_Id: area.recepcion_Documento_Id,
        area_Origen: "Asignado en Oficialia de partes",
        atendido: false,
        observaciones: "",
      };
    });
    let nuevasAreasArray = nuevasAreas.map((nuevo) => {
      return {
        area_Id: nuevo.value,
        accede: nuevo.select,
        cc: nuevo.cc,
        recepcion_Documento_Id: recepcion.value.id,
        area_Origen: "Asignado en Oficialia de partes",
        atendido: false,
        observaciones: "",
      };
    });
    let respArea = await recepcionStore.createNuevaArea(nuevasAreasArray);
    console.log("registro de area", respArea);
  } else {
    areasArray = unicAreas.map((area) => {
      return {
        area_Id: area.value,
        accede: area.select,
        cc: area.cc,
        area_Origen: "Asignado en Oficialia de partes",
        atendido: false,
        observaciones: "",
      };
    });
  }
  recepcion.value.areas = areasArray;
};

const onSubmit = async () => {
  let resp = null;
  $q.loading.show();
  await AgruparAreas();
  recepcion.value.remitente_Id = remitente_Id.value.value;
  recepcion.value.clasificacion_Id = clasificador_Id.value.value;
  recepcion.value.configuracion_Oficialia_Id = leyendaActual.value.id;
  if (isEditar.value == true) {
    resp = await recepcionStore.updateRecepcion(recepcion.value);
    actualizarModal();
    $q.loading.hide();
  } else {
    resp = await recepcionStore.createRecepcion(recepcion.value);
    $q.loading.hide();
    actualizarDoc(true);
    modal.value = false;
    remitente_Id.value = null;
    clasificador_Id.value = null;
  }

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
};

const filterRem = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesRemitentes.value = remitentesOpt.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesRemitentes.value = remitentesOpt.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterCla = (val, update) => {
  if (val === "") {
    update(() => {
      opcionesClasificadores.value = clasificadoresOpt.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    opcionesClasificadores.value = clasificadoresOpt.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

<style lang="sass">
.my-sticky-header-column-table
  /* height or max-height is important */
  height: 310px

  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  td:first-child
    /* bg color is important for td; just specify one */
    background-color: #c1f4cd !important

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

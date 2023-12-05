<template>
  <q-table
    title="Documentos adjuntos"
    :rows="lAdjuntos"
    :columns="columns"
    :filter="filter"
    :loading="loading"
    row-key="id"
    hide-bottom
    :rows-per-page-options="[0]"
    :visible-columns="visibleColumns"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.name == 'color'">
            <q-badge :color="col.value" :label="col.value" />
          </div>
          <div v-else-if="col.name === 'id'">
            <!--<q-btn flat round color="purple-ieen" icon="edit">
                <q-tooltip>Editar registro</q-tooltip>
              </q-btn>
              <q-btn flat round color="purple-ieen" icon="delete">
                <q-tooltip>Eliminar registro</q-tooltip>
              </q-btn>-->
            <q-btn
              flat
              round
              color="purple-ieen"
              icon="preview"
              @click="verDocs(col.value)"
            >
              <q-tooltip>Ver documento</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="purple-ieen"
              icon="sim_card_download"
              @click="descargar(col.value)"
            >
              <q-tooltip>Descargar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="modalAdjuntos == false && modalResumen == false"
              flat
              round
              color="purple-ieen"
              icon="delete"
              @click="eliminar(col.value)"
            >
              <q-tooltip>Eliminar archivo</q-tooltip>
            </q-btn>
          </div>
          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
    </template>
    <template
      v-if="modalAdjuntos == false && modalResumen == false"
      v-slot:bottom-row
    >
      <q-tr>
        <q-td colspan="100%" class="text-right">
          <q-btn
            label="Agregar documento"
            color="purple-ieen"
            icon="add"
            @click="actualizarDoc(true)"
          >
            <q-tooltip>Agregar documento</q-tooltip>
          </q-btn></q-td
        >
      </q-tr>
    </template>
  </q-table>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useRecepcionStore } from "../../../stores/recepcion_store";
import { useCorrespondenciaStore } from "src/stores/correspondencia_store";
import { useAuthStore } from "../../../stores/auth_store";
import { getDataDevice, getCurrentLocation } from "src/helpers/helpers";

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const correspondenciaStore = useCorrespondenciaStore();
const adjuntos = ref(null);
const anexos = ref(null);
const authStore = useAuthStore();
const { lAdjuntos, adjunto_url, recepcion, modalResumen } =
  storeToRefs(recepcionStore);
const { modalAdjuntos } = storeToRefs(correspondenciaStore);
const clasificador_Id = ref(null);
const remitente_Id = ref(null);
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
  {
    name: "Documento",
    align: "center",
    label: "",
    field: "documento_URL",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Opciones",
    field: "id",
    sortable: false,
  },
];

const visibleColumns = ["titulo", "anexo", "id"];
const verDocs = async (id) => {
  $q.loading.show();
  await recepcionStore.loadDocumento(id);
  recepcionStore.actualizarViewer(true);
  $q.loading.hide();
};

const descargar = async (id) => {
  $q.loading.show();
  let nombre = lAdjuntos.value.find((x) => x.id == id);
  //const { data_device, geo } = await get_additional_info();
  //let prueba = await getCurrentLocation();
  let prueba2 = getDataDevice();
  //console.log(prueba, prueba2);
  let resp = await recepcionStore.loadDocumentoDescarga({
    documento_Id: id,
    descarga: false,
  });
  let blob = new window.Blob([resp.data], { type: "application/pdf" });
  const adjunto = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = adjunto;
  link.setAttribute("download", nombre.titulo);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminación de documento",
    message: "¿Está seguro de eliminar el documento?",
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
    const resp = await recepcionStore.deleteAdjunto(id);
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
    $q.loading.hide();
  });
};

/*const descargar = async (id) => {
  $q.loading.show();
  await recepcionStore.loadDocumento(id);
  const adjunto_Item = lAdjuntos.value.find((x) => x.id == id);
  const link = document.createElement("a");
  link.href = recepcionStore.adjunto_url;
  link.setAttribute("download", adjunto_Item.titulo);
  document.body.appendChild(link);
  link.click();
  $q.loading.hide();
};*/

const registroDescarga = async (id) => {};

const actualizarDoc = async () => {
  recepcionStore.actualizarDocs(true);
};

/*const filterFn = (val, update) => {
    console.log("Si entra al filtro");
    if (val === "") {
      update(() => {
        options = filtro;

        // here you have access to "ref" which
        // is the Vue reference of the QSelect
      });
      return;
    }

    update(() => {
      console.log("Estos son las opciones", options);
      const needle = val.toLowerCase();
      console.log("neddle", needle);
      console.log("remitentes", filtro);
      options = filtro.filter(
        (v) => v.toString().toLowerCase().indexOf(needle) > -1
      );
    });
  };*/
</script>

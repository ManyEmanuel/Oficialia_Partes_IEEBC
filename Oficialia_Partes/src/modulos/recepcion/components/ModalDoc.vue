<template>
  <q-dialog
    v-model="modalDocs"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <div class="text-h6">Carga de archivos adjuntos y anexos</div>
      </q-card-section>
      <q-card-section>
        <q-form class="row q-col-gutter-xs" @submit="onSubmit">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-file
              v-model="adjuntos"
              label="Archivos Adjuntos"
              filled
              use-chips
              multiple
              counter
              autogrow
              append
              accept=".pdf"
              hint="Seleccione los archivos adjuntos"
            >
            </q-file>
          </div>
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <q-file
              v-model="anexos"
              label="Anexos"
              use-chips
              filled
              multiple
              counter
              autogrow
              append
              accept=".pdf"
              hint="Seleccione los anexos"
            />
          </div>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                label="Cancelar"
                type="reset"
                color="negative"
                @click="actualizarModalDoc()"
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
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { ref, onBeforeMount, watch, computed } from "vue";
import { useRecepcionStore } from "../../../stores/recepcion_store";
import { useClasificadorStore } from "../../../stores/clasificador_store";
import { useRemitentesStore } from "../../../stores/remitente_store";
//

const $q = useQuasar();
const recepcionStore = useRecepcionStore();
const remitenteStore = useRemitentesStore();
const clasificadorStore = useClasificadorStore();
const { modalDocs, isEditar, recepcion } = storeToRefs(recepcionStore);
const adjuntos = ref(null);
const files = ref(null);
const uploadProgress = ref([]);
const uploading = ref(null);
const anexos = ref(null);

const actualizarModalDoc = () => {
  adjuntos.value = null;
  anexos.value = null;
  recepcionStore.actualizarDocs(false);
  recepcionStore.loadDocumentos(recepcion.value.id);
  if (isEditar.value == false) {
    recepcionStore.actualizarModal(false);
    recepcionStore.initRecepcion();
  }

  // recepcionStore.actualizarArea(false, false);
};

const getNombres = (valor) => {
  recepcionStore.loadNombresArea(valor);
};

onBeforeMount(() => {
  //recepcionStore.loadAreasSelectList();
  //clasificadorStore.loadClasificadorList();
  //remitenteStore.loadRemitenteList();
});

const onSubmit = async () => {
  let documentos = [];
  let resp = null;
  $q.loading.show();
  if (adjuntos.value != null) {
    adjuntos.value.forEach(async (item) => {
      let nombre = item.name.split(".");
      documentos.push({
        titulo: nombre[0],
        documento: item,
        is_Anexo: false,
      });
    });
  }
  if (anexos.value != null) {
    anexos.value.forEach(async (items) => {
      let nombre = items.name.split(".");
      documentos.push({
        titulo: nombre[0],
        documento: items,
        is_Anexo: true,
      });
    });
  }

  if (documentos.length > 0) {
    resp = await recepcionStore.createDocumentoBueno(documentos);

    if (resp.success) {
      $q.notify({
        type: "positive",
        message: resp.data,
      });

      actualizarModalDoc();
      if (isEditar.value == false) {
        recepcionStore.initRecepcion();
      }
    } else {
      $q.notify({
        type: "negative",
        message: resp.data,
      });
      //loading.value = false;
    }
  } else {
    actualizarModalDoc();
    if (isEditar.value == false) {
      recepcionStore.initRecepcion();
    }
  }
  $q.loading.hide();
};
</script>

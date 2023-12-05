<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="remitentes"
        :columns="columns"
        :filter="filter"
        :pagination="pagination"
        :loading="loading"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
      >
        <template v-slot:top-right>
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
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'color'">
                <q-badge :color="col.value" :label="col.value" />
              </div>
              <div v-else-if="col.name === 'id'">
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
                  v-if="modulo.eliminar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminar(col.value)"
                >
                  <q-tooltip>Eliminar registro</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { onBeforeMount, ref } from "vue";
import { useRemitentesStore } from "../../../stores/remitente_store";
import { useAuthStore } from "../../../stores/auth_store";

const $q = useQuasar();
const remitenteStore = useRemitentesStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { remitentes } = storeToRefs(remitenteStore);

onBeforeMount(() => {
  remitenteStore.loadRemitentes();
});

const columns = [
  {
    name: "institucion",
    align: "center",
    label: "Institución",
    field: "institucion",
    sortable: true,
  },
  {
    name: "nombre",
    align: "center",
    label: "Nombre del remitente",
    field: "nombre",
    sortable: true,
  },
  {
    name: "cargo",
    align: "center",
    label: "Cargo del remitente",
    field: "cargo",
    sortable: true,
  },
  {
    name: "telefono",
    align: "center",
    label: "Telefono del remitente",
    field: "telefono",
    sortable: true,
  },
  {
    name: "correo",
    align: "center",
    label: "Correo del remitente",
    field: "correo",
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

const pagination = ref({
  //********** */
  page: 1,
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");

const editar = async (id) => {
  $q.loading.show();
  await remitenteStore.loadRemitente(id);
  remitenteStore.updateEditar(true);
  //await espera();
  remitenteStore.actualizarModal(true);
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
    const resp = await remitenteStore.deleteRemitente(id);
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

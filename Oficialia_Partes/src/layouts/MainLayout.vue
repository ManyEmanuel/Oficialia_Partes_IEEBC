<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        />

        <q-toolbar-title> Oficialía de partes </q-toolbar-title>
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="no_notificaciones > 0" color="red" floating>{{
            no_notificaciones > 5 ? "5+" : no_notificaciones
          }}</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <div>
                <q-item
                  style="max-width: 420px"
                  v-for="notificacion in notificaciones_all"
                  :key="notificacion.id"
                  clickable
                  v-ripple
                  @click="detalle(notificacion.recepcion_Id, notificacion.id)"
                >
                  <q-item-section>
                    <q-item-label>{{ notificacion.titulo }}</q-item-label>
                    <q-item-label caption lines="3"
                      >{{ notificacion.descripcion }}
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    {{ notificacion.fecha_Registro }}
                    <q-badge
                      v-if="notificacion.leido == false"
                      color="blue"
                      rounded
                      class="q-mr-sm"
                    />
                  </q-item-section>
                </q-item>
              </div>
              <q-card
                v-if="notificaciones.length > 0"
                class="text-center no-shadow no-border"
              >
                <q-btn
                  label="Ver todos"
                  color="purple-ieen"
                  style="max-width: 120px !important"
                  flat
                  dense
                  class="text-indigo-8"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-footer reveal bordered class="bg-purple-ieen">
      <q-toolbar>
        <q-toolbar-title
          ><div>
            &#169; Unidad Informática y Estadística Electoral
          </div></q-toolbar-title
        >
      </q-toolbar>
    </q-footer>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="300"
      :breakpoint="1024"
      class="text-black"
    >
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding class="margin top">
          <q-item
            v-if="recepcionList.some((element) => element == 'OP-REC-DOC')"
            :to="{ name: 'recepcion_documentos' }"
          >
            <q-item-section avatar>
              <q-icon name="library_books" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Recepción de documentos</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            v-if="recepcionList.some((element) => element == 'OP-REC-COR')"
            :to="{ name: 'correspondencia' }"
          >
            <q-item-section avatar>
              <q-icon name="attach_email" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Correspondencia</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item
            v-if="recepcionList.some((element) => element == 'OP-REC-ADM')"
            :to="{ name: 'correspondencia_administrativa' }"
          >
            <q-item-section avatar>
              <q-icon name="attach_email" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Correspondencia Administrativa</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="recepcionList.some((element) => element == 'OP-REC-GEN')"
            :to="{ name: 'correspondencia_general' }"
          >
            <q-item-section avatar>
              <q-icon name="attach_email" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Correspondencia General</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-expansion-item
            v-if="catalagosList.length > 0"
            expand-separator
            icon="menu_book"
            label="Catálogos"
            class="text-purple-ieen label-title text-bold"
          >
            <q-item
              v-if="catalagosList.some((element) => element == 'OP-CAT-CLA')"
              :to="{ name: 'clasificador' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="library_books" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Clasificadores</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="catalagosList.some((element) => element == 'OP-CAT-INS')"
              :to="{ name: 'instituciones' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="library_books" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Instituciones</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item
              v-if="catalagosList.some((element) => element == 'OP-CAT-REM')"
              :to="{ name: 'remitentes' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="library_books" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Remitentes</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            v-if="configuracionList.length > 0"
            expand-separator
            icon="build"
            label="Configuración"
            class="text-purple-ieen label-title text-bold"
          >
            <q-item
              v-if="
                configuracionList.some((element) => element == 'OP-CON-LEY')
              "
              :to="{ name: 'ley_datos_personales' }"
              :content-inset-level="2"
              :header-inset-level="2"
            >
              <q-item-section avatar>
                <q-icon name="library_books" color="purple-ieen" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-purple-ieen label-title text-bold"
                  >Ley de datos personales</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            v-if="bitacoraList.some((element) => element == 'OP-REP-ESP')"
            :to="{ name: 'reporte_clasificacion' }"
          >
            <q-item-section avatar>
              <q-icon name="list_alt" color="purple-ieen" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-purple-ieen label-title text-bold"
                >Reporte por clasificación</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img
        class="absolute-top"
        src="~assets/FondoIEEBC1.jpg"
        style="height: 150px"
      >
        <div class="bg-transparent">
          <div class="text-weight-bold text-black">
            <br />
            Bienvenido(a) {{ usuario }}
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
//import EssentialLink from "components/EssentialLink.vue";

/*const linksList = [
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "school",
    link: "https://quasar.dev",
  },
  {
    title: "Github",
    caption: "github.com/quasarframework",
    icon: "code",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Discord Chat Channel",
    caption: "chat.quasar.dev",
    icon: "chat",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Forum",
    caption: "forum.quasar.dev",
    icon: "record_voice_over",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Twitter",
    caption: "@quasarframework",
    icon: "rss_feed",
    link: "https://twitter.quasar.dev",
  },
  {
    title: "Facebook",
    caption: "@QuasarFramework",
    icon: "public",
    link: "https://facebook.quasar.dev",
  },
  {
    title: "Quasar Awesome",
    caption: "Community Quasar projects",
    icon: "favorite",
    link: "https://awesome.quasar.dev",
  },
];*/

import { defineComponent, ref } from "vue";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount } from "vue";
import { useNotificacionStore } from "../stores/notificaciones_store";
import { useRecepcionStore } from "../stores/recepcion_store";
import { useAuthStore } from "../stores/auth_store";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",

  components: {
    //EssentialLink,
  },

  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const notificacionStore = useNotificacionStore();
    const recepcionStore = useRecepcionStore();
    const { notificaciones, no_notificaciones, notificaciones_all } =
      storeToRefs(notificacionStore);
    const { modulos, sistemas, apps } = storeToRefs(authStore);
    const catalagosList = ref([]);
    const configuracionList = ref([]);
    const recepcionList = ref([]);
    const bitacoraList = ref([]);
    const usuario = ref("");
    onBeforeMount(() => {
      if (route.query.key) {
        localStorage.setItem("key", route.query.key);
      }

      if (route.query.sistema) {
        localStorage.setItem("sistema", route.query.sistema);
      }

      if (route.query.usr) {
        localStorage.setItem("usuario", route.query.usr);
        usuario.value = localStorage.getItem("usuario");
      } else {
        if (localStorage.getItem("usuario") != null) {
          usuario.value = localStorage.getItem("usuario");
        }
      }
      loadMenu();
      cargaNotificacion();
    });

    const cargaNotificacion = async () => {
      await notificacionStore.loadNotificaciones();
      await notificacionStore.loadNotificacionesAll();
    };

    const connection = new HubConnectionBuilder()
      .withUrl("http://oficialia-de-partes.ieebc.mx:9095/hubOP", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("key")}`,
        },
      })
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("notificar", (data) => {
      notificacionStore.loadNotificaciones();
      notificacionStore.loadNotificacionesAll();
      $q.notify({
        message: data,
        icon: "announcement",
      });
    });

    connection
      .start()
      .then(() => {
        console.log("connected");
      })
      .catch((err) => {
        console.log(err);
      });

    const loadMenu = async () => {
      $q.loading.show();
      await authStore.loadSistemas();
      await authStore.loadModulos();
      await authStore.loadDatosEmp();
      await authStore.loadRolEmp();
      console.log("Estos son los modulos", modulos.value);
      modulos.value.forEach((element) => {
        switch (element.siglas_Modulo) {
          case "OP-CAT-CLA":
            catalagosList.value.push("OP-CAT-CLA");
            break;
          case "OP-CAT-INS":
            catalagosList.value.push("OP-CAT-INS");
            break;
          case "OP-CAT-REM":
            catalagosList.value.push("OP-CAT-REM");
            break;
          case "OP-CON-LEY":
            configuracionList.value.push("OP-CON-LEY");
            break;
          case "OP-REC-DOC":
            recepcionList.value.push("OP-REC-DOC");
            break;
          case "OP-REC-COR":
            recepcionList.value.push("OP-REC-COR");
            break;
          case "OP-REC-ADM":
            recepcionList.value.push("OP-REC-ADM");
            break;
          case "OP-REC-GEN":
            recepcionList.value.push("OP-REC-GEN");
            break;
          case "OP-REP-ESP":
            bitacoraList.value.push("OP-REP-ESP");
            break;
        }
      });
      $q.loading.hide();
    };

    const show = () => {
      $q.bottomSheet({
        message: "Aplicaciones",
        grid: true,
        actions: apps.value,
      }).onOk((action) => {
        if (action.label == "Cerrar sesión") {
          localStorage.clear();
          //window.location = "http://sistema.ieenayarit.org:9271?return=false";
          window.location =
            "http://oficialia-de-partes.ieebc.mx:9099?return=false";
        } else if (action.label == "Ir a universo") {
          //window.location = "http://sistema.ieenayarit.org:9271?return=true";
          window.location =
            "http://oficialia-de-partes.ieebc.mx:9099?return=true";
        } else {
          window.location =
            action.url +
            `/#/?key=${localStorage.getItem("key")}&sistema=${
              action.id
            }&usr=${localStorage.getItem("usuario")}`;
        }
      });
    };

    const detalle = async (id, idNotificacion) => {
      let empleado = null;
      let area = null;
      if (localStorage.getItem("tipoEmp") == "JefeArea") {
        area = parseInt(localStorage.getItem("area"));
        empleado = 0;
      } else if (localStorage.getItem("tipoEmp") == "Empleado") {
        empleado = parseInt(localStorage.getItem("empleado"));
        area = 0;
      }
      await notificacionStore.leerNotificacion(idNotificacion);
      await recepcionStore.loadResumenRecepcion(id, area, empleado, false);
      notificacionStore.loadNotificaciones();
      notificacionStore.loadNotificacionesAll();
      recepcionStore.actualizarResumen(true);
    };

    const actualizarAdjunto = (valor) => {
      correspondenciaAdminStore.actualizarAdjunto(valor);
    };

    return {
      //essentialLinks: linksList,
      drawer: ref(false),
      leftDrawerOpen,
      catalagosList,
      configuracionList,
      recepcionList,
      no_notificaciones,
      notificaciones,
      notificaciones_all,
      bitacoraList,
      usuario,
      detalle,
      show,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
<style lang="scss">
.text-purple-ieen {
  color: #673e84 !important;
}
.bg-purple-ieen {
  background: #673e84 !important;
}
.text-purple-ieen-1 {
  color: #863399 !important;
}
.bg-purple-ieen-1 {
  background: #863399 !important;
}
.text-purple-ieen-2 {
  color: #a25eb5 !important;
}
.bg-purple-ieen-2 {
  background: #a25eb5 !important;
}
.text-purple-ieen-3 {
  color: #bb83ca !important;
}
.bg-purple-ieen-3 {
  background: #bb83ca !important;
}
.text-pink-ieen-1 {
  color: #b32572 !important;
}
.bg-pink-ieen-1 {
  background: #b32572 !important;
}
.text-pink-ieen-2 {
  color: #cc5599 !important;
}
.bg-pink-ieen-2 {
  background: #cc5599 !important;
}
.text-pink-ieen-3 {
  color: #dd85ba !important;
}
.bg-pink-ieen-3 {
  background: #dd85ba !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>

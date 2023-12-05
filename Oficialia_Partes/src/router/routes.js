const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/clasificador",
        name: "clasificador",
        component: () => import("../modulos/clasificador/pages/IndexPage"),
      },
      {
        path: "/instituciones",
        name: "instituciones",
        component: () => import("../modulos/instituciones/pages/IndexPage"),
      },
      {
        path: "/remitentes",
        name: "remitentes",
        component: () => import("../modulos/remitentes/pages/IndexPage"),
      },
      {
        path: "/ley_datos_personales",
        name: "ley_datos_personales",
        component: () => import("../modulos/leyenda/pages/IndexPage"),
      },
      {
        path: "/recepcion_documentos",
        name: "recepcion_documentos",
        component: () => import("../modulos/recepcion/pages/IndexPage"),
      },
      {
        path: "/correspondencia",
        name: "correspondencia",
        component: () => import("../modulos/correspondencia/pages/IndexPage"),
      },
      {
        path: "/correspondencia_administrativa",
        name: "correspondencia_administrativa",
        component: () =>
          import("../modulos/correspondencia_Administrativa/pages/IndexPage"),
      },
      {
        path: "/correspondencia_general",
        name: "correspondencia_general",
        component: () =>
          import("../modulos/correspondencia_General/pages/IndexPage"),
      },
      {
        path: "/bitacora_documento",
        name: "bitacora_documento",
        component: () => import("../modulos/bitacora/pages/IndexPage"),
      },

      {
        path: "/reporte_clasificacion",
        name: "reporte_clasificacion",
        component: () => import("../modulos/reporte_Especial/pages/IndexPage"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;

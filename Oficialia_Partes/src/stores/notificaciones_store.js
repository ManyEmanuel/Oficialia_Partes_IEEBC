import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useNotificacionStore = defineStore("Notificaciones", {
  state: () => ({
    notificaciones: [],
    notificaciones_all: [],
    no_notificaciones: 0,
  }),

  actions: {
    async loadNotificaciones() {
      try {
        const resp = await api.get("/NotificacionesOP");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          console.log(data);
          if (success == true) {
            if (data) {
              const notificaciones_array = data.notificaciones.map(
                (notificacion) => {
                  return {
                    id: notificacion.id,
                    empleado_Id: notificacion.empleado_Id,
                    recepcion_Id: notificacion.recepcion_Id,
                    titulo: notificacion.titulo,
                    descripcion: notificacion.descripcion,
                    leido: notificacion.leido,
                    fecha_Registro: notificacion.fecha_Registro,
                  };
                }
              );
              this.notificaciones = notificaciones_array;
              console.log("Esto es notificiacion", notificaciones_array);
              this.no_notificaciones = data.no_Notificaciones;
            }
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadNotificacionesAll() {
      try {
        const resp = await api.get("/NotificacionesOP/GetAll");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            if (data) {
              const notificaciones_array = data.map((notificacion) => {
                return {
                  id: notificacion.id,
                  empleado_Id: notificacion.empleado_Id,
                  recepcion_Id: notificacion.recepcion_Id,
                  titulo: notificacion.titulo,
                  descripcion: notificacion.descripcion,
                  leido: notificacion.leido,
                  fecha_Registro: notificacion.fecha_Registro,
                };
              });
              this.notificaciones_all = notificaciones_array;
            }
          }
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async leerNotificacion(notificacionId) {
      try {
        const resp = await api.get(`/NotificacionesOP/Leer/${notificacionId}`);
        console.log("Esto es resp", resp);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          return { success, data };
        } else {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});

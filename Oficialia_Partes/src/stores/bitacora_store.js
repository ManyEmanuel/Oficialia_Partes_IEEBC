import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useBitacoraStore = defineStore("bitacora", {
  state: () => ({
    bitacora: {
      id: null,
      empleado_Id: null,
      empleado: null,
      recepcion_Documento_Adjunto_Id: null,
      folio: null,
      documento: null,
      fecha_Descarga: null,
      longitud: null,
      latitud: null,
      sO_Dispositivo: null,
      tipo_Dispositivo: null,
      iP_Solicitante: null,
    },
    bitacoraList: [],
  }),
  actions: {
    initBitacora() {
      this.bitacora.id = null;
      this.bitacora.empleado_Id = null;
      this.bitacora.empleado = null;
      this.bitacora.recepcion_Documento_Adjunto_Id = null;
      this.bitacora.folio = null;
      this.bitacora.documento = null;
      this.bitacora.fecha_Descarga = null;
      this.bitacora.longitud = null;
      this.bitacora.latitud = null;
      this.bitacora.sO_Dispositivo = null;
      this.bitacora.tipo_Dispositivo = null;
      this.bitacora.iP_Solicitante = null;
    },

    async loadBitacoraList() {
      try {
        const resp = await api.get("/BitacoraOP");

        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let bitacorArray = data.map((bitacora) => {
                return {
                  id: bitacora.id,
                  empleado: bitacora.empleado,
                  folio: bitacora.folio,
                  documento: bitacora.documento,
                  fecha_Descarga: bitacora.fecha_Descarga,
                  tipo_Dispositivo: bitacora.tipo_Dispositivo,
                };
              });
              this.bitacoraList = bitacorArray;
            }
          } else {
            return { success, data };
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
  },
});

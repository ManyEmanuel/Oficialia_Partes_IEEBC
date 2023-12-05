import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useRemitentesStore = defineStore("remitente", {
  state: () => ({
    modal: false,
    isEditar: false,
    isLoading: false,
    instituciones: [],
    remitentesOpt: [],
    remitentes: [],
    remitente: {
      id: null,
      institucion_id: null,
      nombres: null,
      apellido_Paterno: null,
      apellido_Materno: null,
      cargo: null,
      telefono: null,
      correo: null,
    },
  }),
  actions: {
    initRemitente() {
      this.remitente.id = null;
      this.remitente.institucion_id = null;
      this.remitente.nombres = null;
      this.remitente.apellido_Paterno = null;
      this.remitente.apellido_Materno = null;
      this.remitente.cargo = null;
      this.remitente.telefono = null;
      this.remitente.correo = null;
    },
    initListRemitente() {
      this.remitentesOpt = null;
    },

    async loadRemitenteList() {
      try {
        const resp = await api.get("/Remitentes");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let remitenteArray = data.map((remitente) => {
                return {
                  label:
                    remitente.institucion +
                    " - " +
                    remitente.nombres +
                    " " +
                    remitente.apellido_Paterno +
                    " " +
                    remitente.apellido_Materno,
                  value: remitente.id,
                };
              });
              this.remitentesOpt = remitenteArray;
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
      } catch (error) {}
    },

    async loadRemitentes() {
      try {
        const resp = await api.get("/Remitentes");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let remitenteArray = data.map((remitente) => {
                return {
                  id: remitente.id,
                  institucion: remitente.institucion,
                  nombre:
                    remitente.nombres +
                    " " +
                    remitente.apellido_Paterno +
                    " " +
                    remitente.apellido_Materno,
                  cargo: remitente.cargo,
                  telefono: remitente.telefono,
                  correo: remitente.correo,
                };
              });
              this.remitentes = remitenteArray;
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

    async loadRemitente(id) {
      try {
        const resp = await api.get(`/Remitentes/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.remitente.id = data.id;
            this.remitente.institucion_id = data.institucion_Id;
            this.remitente.nombres = data.nombres;
            this.remitente.apellido_Paterno = data.apellido_Paterno;
            this.remitente.apellido_Materno = data.apellido_Materno;
            this.remitente.cargo = data.cargo;
            this.remitente.telefono = data.telefono;
            this.remitente.correo = data.correo;
            return { success };
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createRemitente(remitente) {
      try {
        const resp = await api.post("/Remitentes", remitente);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadRemitentes();
            return { success, data };
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
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async updateRemitente(remitente) {
      try {
        const resp = await api.put(`/Remitentes/${remitente.id}`, remitente);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadRemitentes();
            return { success, data };
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
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async deleteRemitente(id) {
      try {
        const resp = await api.delete(`/Remitentes/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          console.log(resp.data);
          console.log("Esto es success", success, "Esto es data", data);
          if (success === true) {
            this.loadRemitentes();
            return { success, data };
          } else {
            return { success, data };
          }
        } else {
          return {
            success: false,
            data: "Ocurrio un error, intentelo de nuevo",
          };
        }
      } catch (e) {
        console.log(e);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    updateEditar(valor) {
      this.isEditar = valor;
    },

    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});

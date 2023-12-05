import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useInstitucionesStore = defineStore("institucion", {
  state: () => ({
    modal: false,
    isEditar: false,
    isLoading: false,
    instituciones: [],
    institucionesOpt: [],
    institucion: {
      id: null,
      nombre: null,
      siglas: null,
      descripcion: null,
      telefono: null,
      correo: null,
      activo: false,
    },
  }),
  actions: {
    initInstitucion() {
      this.institucion.id = null;
      this.institucion.nombre = null;
      this.institucion.siglas = null;
      this.institucion.descripcion = null;
      this.institucion.telefono = null;
      this.institucion.correo = null;
      this.institucion.activo = false;
    },

    async loadInstituciones() {
      try {
        const resp = await api.get("/Instituciones");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let institucionArray = data.map((institucion) => {
                return {
                  id: institucion.id,
                  siglas: institucion.siglas,
                  nombre: institucion.nombre,
                  telefono: institucion.telefono,
                  correo: institucion.correo,
                };
              });
              this.instituciones = institucionArray;
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

    async loadInstitucionesList() {
      try {
        const resp = await api.get("/Instituciones");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let institucionesArray = data.map((institucion) => {
                return {
                  label: institucion.nombre,
                  value: institucion.id,
                };
              });
              this.institucionesOpt = institucionesArray;
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

    async loadInstitucion(id) {
      try {
        const resp = await api.get(`/Instituciones/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.institucion.id = data.id;
            this.institucion.nombre = data.nombre;
            this.institucion.siglas = data.siglas;
            this.institucion.descripcion = data.descripcion;
            this.institucion.telefono = data.telefono;
            this.institucion.correo = data.correo;
            this.institucion.activo = data.activo;
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

    async createInstitucion(institucion) {
      try {
        const resp = await api.post("/Instituciones", institucion);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadInstituciones();
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

    async updateInstitucion(institucion) {
      try {
        const resp = await api.put(
          `/Instituciones/${institucion.id}`,
          institucion
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadInstituciones();
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

    async deleteInstitucion(id) {
      try {
        const resp = await api.delete(`/Instituciones/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          console.log(resp.data);
          console.log("Esto es success", success, "Esto es data", data);
          if (success === true) {
            this.loadInstituciones();
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
      } catch (error) {
        console.log(error);
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

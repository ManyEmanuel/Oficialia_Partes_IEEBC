import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useClasificadorStore = defineStore("clasificador", {
  state: () => ({
    modal: false,
    isEditar: false,
    isLoading: false,
    clasificadores: [],
    clasificadoresOpt: [],
    clasificador: {
      id: null,
      nombre: null,
      descripcion: null,
    },
  }),
  actions: {
    initClasificador() {
      this.clasificador.id = null;
      this.clasificador.nombre = null;
      this.clasificador.descripcion = null;
    },

    initListClasificador() {
      this.clasificadoresOpt = null;
    },

    async loadClasificadores() {
      try {
        const resp = await api.get("/Clasificaciones");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let clasificadorArray = data.map((clasificador) => {
                return {
                  id: clasificador.id,
                  nombre: clasificador.nombre,
                  descripcion: clasificador.descripcion,
                };
              });
              this.clasificadores = clasificadorArray;
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

    async loadClasificadorList() {
      try {
        const resp = await api.get("/Clasificaciones");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let clasificadorArray = data.map((clasificador) => {
                return {
                  label: clasificador.nombre,
                  value: clasificador.id,
                };
              });
              this.clasificadoresOpt = clasificadorArray;
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

    async loadClasificador(id) {
      try {
        const resp = await api.get(`/Clasificaciones/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.clasificador.id = data.id;
            this.clasificador.nombre = data.nombre;
            this.clasificador.descripcion = data.descripcion;
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
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createClasificador(clasificador) {
      try {
        const resp = await api.post("/Clasificaciones", clasificador);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadClasificadores();
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

    async updateClasificador(clasificador) {
      try {
        const resp = await api.put(
          `/Clasificaciones/${clasificador.id}`,
          clasificador
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadClasificadores();
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

    async deleteClasificador(id) {
      try {
        const resp = await api.delete(`/Clasificaciones/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;

          if (success === true) {
            this.loadClasificadores();
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

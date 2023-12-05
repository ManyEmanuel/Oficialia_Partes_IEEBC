import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useLeyendaStore = defineStore("leyenda", {
  state: () => ({
    modal: false,
    historial: false,
    isEditar: false,
    isLoading: false,
    leyendas: [],
    leyendaActual: {
      id: null,
      empleado: null,
      empleado_Id: null,
      fecha_Registro: null,
      leyenda: null,
    },
    leyenda: {
      id: null,
      empleado: null,
      empleado_Id: null,
      fecha_Registro: null,
      leyenda: null,
    },
  }),
  actions: {
    initLeyenda() {
      this.leyenda.id = null;
      this.leyenda.empleado = null;
      this.leyenda.empleado_Id = null;
      this.leyenda.fecha_Registro = null;
      this.leyenda.leyenda = null;
    },

    async loadVigente() {
      try {
        const resp = await api.get(`/ConfiguracionOficialia/GetLast`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.leyendaActual.id = data.id;
            this.leyendaActual.empleado = data.empleado;
            this.leyendaActual.empleado_Id = data.empleado_Id;
            let fecha = data.fecha_Registro.split(" ");
            this.leyendaActual.fecha_Registro = fecha[0];
            this.leyendaActual.leyenda = data.leyenda;
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadHistorial() {
      try {
        const resp = await api.get("/ConfiguracionOficialia");
        const resph = await api.get("/ConfiguracionOficialia/GetLast");
        const vigente = resph.data.data;
        console.log(resp);
        let leyendasArray = [];
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              console.log("Esto es data", data);
              data.forEach((item) => {
                console.log(item.id);
                let fecha = item.fecha_Registro.split(" ");
                if (item.id === vigente.id) {
                  leyendasArray.push({
                    id: item.id,
                    leyenda: item.leyenda,
                    empleado: item.empleado,
                    fecha: fecha[0],
                    estatus: "Vigente",
                  });
                } else {
                  leyendasArray.push({
                    id: item.id,
                    leyenda: item.leyenda,
                    empleado: item.empleado,
                    fecha: fecha[0],
                    estatus: "Sin vigencia",
                  });
                }
              });
              this.leyendas = leyendasArray;
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadLeyendas() {
      try {
        const resp = await api.get(`/ConfiguracionOficialia/GetLast`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.leyenda.id = data.id;
            this.leyenda.empleado = data.empleado;
            this.leyenda.empleado_Id = data.empleado_Id;
            let fecha = data.fecha_Registro.split(" ");
            this.leyenda.fecha_Registro = fecha[0];
            this.leyenda.leyenda = data.leyenda;
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

    async loadLeyenda(id) {
      try {
        const resp = await api.get(`/ConfiguracionOficialia/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.leyenda.id = data.id;
            this.leyenda.empleado = data.empleado;
            this.leyenda.empleado_Id = data.empleado_Id;
            let fecha = data.fecha_Registro.split(" ");
            this.leyenda.fecha_Registro = fecha[0];
            this.leyenda.leyenda = data.leyenda;
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

    async updateLey(leyenda) {
      try {
        const emp = await api.get("/Empleados/ByUsuario");
        let numEmp = emp.data.data;
        leyenda.empleado_Id = numEmp.id;
        const resp = await api.post("/ConfiguracionOficialia", leyenda);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadVigente();
            this.loadHistorial();
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
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    /*async ObtenerEmpleado(){
      try {
        const resp = await api.get("/Empleados/ByUsuario");
        if(resp.status == 200){
          const {success, data} = resp.data;
          if(success === true){

          }
        }

      } catch (error) {

      }
    }*/

    historialModal(valor) {
      this.historial = valor;
    },

    updateEditar(valor) {
      this.isEditar = valor;
    },

    actualizarModal(valor) {
      this.modal = valor;
    },
  },
});

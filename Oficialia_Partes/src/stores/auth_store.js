import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    modulos: [],
    sistemas: [],
    apps: [],
    modulo: null,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    async loadDatosEmp() {
      try {
        const resp = await api.get(`/Empleados/ByUsuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              localStorage.setItem("empleado", data.id);
              if (data.area_Id == 13) {
                const emp = await api.get("/ResponsablesAreas");
                let datosEmp = emp.data.data;
                let numEmp = datosEmp.find((x) => x.empleado_Id == data.id);
                console.log("Este es el num de empleado", numEmp);
                localStorage.setItem("area", numEmp.area_Id);
              } else {
                localStorage.setItem("area", data.area_Id);
              }
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

    async loadRolEmp() {
      try {
        //if (parseInt(localStorage.getItem("area")) != 13) {
        const resp = await api.get(`/ResponsablesAreas/ResposableByUsuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          console.log("Esto es data del rol", data);
          if (success === true) {
            if (data != null) {
              if (
                data.empleado_Id == parseInt(localStorage.getItem("empleado"))
              ) {
                localStorage.setItem("tipoEmp", "JefeArea");
              } else {
                localStorage.setItem("tipoEmp", "Empleado");
              }
            } else {
              localStorage.setItem("tipoEmp", "JefeArea");
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
        //} else {
        //localStorage.setItem("tipoEmp", "ConsejeroElectoral");
        // }
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadSistemas() {
      try {
        const resp = await api.get(`/SistemasUsuarios/ByUSuario`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const sistemasArray = data.map((sistema) => {
                return {
                  sistema_Id: sistema.sistema_Id,
                  sistema: sistema.sistema,
                  url: sistema.url,
                };
              });
              console.log(sistemasArray);
              this.sistemas = sistemasArray;

              const appsArray = data.map((app) => {
                return {
                  id: app.sistema_Id,
                  label: app.sistema,
                  avatar: app.logo_Url,
                  url: app.url,
                };
              });
              const logOut = {
                id: 0,
                label: "Cerrar sesión",
                avatar:
                  "http://sistema.ieenayarit.org:9170/Imagenes/Sistemas/dbb9640f-dd18-4fc3-b530-7041d8594240.png",
                url: "",
              };
              const universoIEEN = {
                id: 0,
                label: "Ir a universo",
                avatar:
                  "http://sistema.ieenayarit.org:9170/Imagenes/Sistemas/67cfdabe-0538-4324-b711-93bcb6cb9a60.png",
                url: "",
              };

              appsArray.push(universoIEEN);
              appsArray.push(logOut);
              this.apps = appsArray;
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
    async loadModulos() {
      try {
        const sistema = localStorage.getItem("sistema");
        const resp = await api.get(
          `/PermisosModulosUsuarios/Bysuario/${sistema}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const modulosArray = data.map((modulo) => {
                return {
                  siglas_Modulo: modulo.siglas_Modulo,
                  registrar: modulo.registrar,
                  actualizar: modulo.actualizar,
                  eliminar: modulo.eliminar,
                  leer: modulo.leer,
                };
              });
              this.modulos = modulosArray;
              console.log(modulosArray);
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

    async loadModulo(siglas) {
      try {
        if ((this.modulos = [])) await this.loadModulos();
        this.modulo = this.modulos.find((x) => x.siglas_Modulo == siglas);
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

import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import moment from "moment/moment";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const useCorrespondenciaStore = defineStore("correspondencia", {
  state: () => ({
    modal: false,
    modalAsignacion: false,
    modalAdjuntos: false,
    modalFinalizacion: false,
    correspondencias: [],
    finalizados: [],
    folio: null,
    recepcion_Id: null,
    lEmpleados: [],
    notaAsignacion: null,
    empleado: {
      id: null,
      empleado_Id: null,
      recepcion_Documento_Id: null,
      accede: null,
      sub_asignado: null,
    },
  }),

  actions: {
    async loadCorrespondencias() {
      try {
        let recepcionArray = null;
        let recepcion = null;
        let areaRecepcion = null;
        let copia = null;
        const resp = await api.get("/RecepcionDocumentos");
        const { success, data } = resp.data;
        switch (localStorage.getItem("tipoEmp")) {
          case "JefeArea":
            recepcion = await api.get(
              `/RecepcionDocumentosAreas/ByArea/${localStorage.getItem("area")}`
            );
            areaRecepcion = recepcion.data.data;
            console.log("estas son las areas", recepcion.data.data);
            recepcionArray = areaRecepcion.map((recepcion) => {
              let asignado = data.find(
                (x) => x.id == recepcion.recepcion_Documento_Id
              );
              if (recepcion.cc == true) {
                copia = "Marcado con copia";
              } else {
                copia = "Turnado directamente";
              }
              return {
                id: asignado.id,
                id_registro: recepcion.id,
                remitente: asignado.remitente,
                anexo: asignado.clasificacion,
                institucion: asignado.institucion,
                folio: asignado.folio,
                asunto: asignado.asunto,
                clasificacion: asignado.clasificacion,
                expediente_Oficio: asignado.expediente_Oficio,
                fecha_Recepcion: asignado.fecha_Recepcion,
                fecha_Registro: asignado.fecha_Registro,
                origen: recepcion.area_Origen,
                tipo: copia,
                acceso: recepcion.accede,
                atendido: recepcion.atendido,
                observaciones: recepcion.observaciones,
              };
            });
            console.log("Este es el resultado", recepcionArray);
            break;
          case "Empleado":
            recepcion = await api.get(
              `/RecepcionDocumentosEmpleados/ByUsuario`
            );
            areaRecepcion = recepcion.data.data;
            recepcionArray = areaRecepcion.map((recepcion) => {
              let asignado = data.find(
                (x) => x.id == recepcion.recepcion_Documento_Id
              );
              return {
                id: asignado.id,
                id_registro: recepcion.id,
                remitente: asignado.remitente,
                anexo: asignado.clasificacion,
                institucion: asignado.institucion,
                folio: asignado.folio,
                asunto: asignado.asunto,
                clasificacion: asignado.clasificacion,
                expediente_Oficio: asignado.expediente_Oficio,
                fecha_Recepcion: asignado.fecha_Recepcion,
                fecha_Registro: asignado.fecha_Registro,
                origen: "Asignado por jefe de área",
                tipo: "Asignación",
                acceso: recepcion.accede,
                atendido: recepcion.atendido,
                observaciones: recepcion.observaciones,
              };
            });
            break;
        }

        this.correspondencias = recepcionArray
          .filter((x) => x.acceso == true)
          .reverse();
        console.log("Esto es correspondencia", this.correspondencias);
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadCorrespondenciasFecha(inicio, fin) {
      try {
        //this.loadCorrespondencias();
        //let registros = [...this.correspondencias];
        //this.correspondencias = null;
        let recepcionArray = null;
        let recepcion = null;
        let areaRecepcion = null;
        let copia = null;
        const resp = await api.get("/RecepcionDocumentos");
        const { success, data } = resp.data;
        if (fin != 0) {
          let inicial = new Date(inicio);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          let final = new Date(fin);
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
          switch (localStorage.getItem("tipoEmp")) {
            case "JefeArea":
              recepcion = await api.get(
                `/RecepcionDocumentosAreas/ByArea/${localStorage.getItem(
                  "area"
                )}`
              );
              areaRecepcion = recepcion.data.data;
              recepcionArray = areaRecepcion.map((recepcion) => {
                let valorFiltro = false;
                let asignado = data.find(
                  (x) => x.id == recepcion.recepcion_Documento_Id
                );
                if (recepcion.cc == true) {
                  copia = "Marcado con copia";
                } else {
                  copia = "Turnado directamente";
                }
                let fechaString = asignado.fecha_Recepcion.split(" ");
                let fecha = new Date(fechaString[0]);
                fecha.setMinutes(
                  fecha.getMinutes() + fecha.getTimezoneOffset()
                );
                if (fecha >= inicial && fecha <= final) {
                  valorFiltro = true;
                } else {
                  valorFiltro = false;
                }
                return {
                  id: asignado.id,
                  id_registro: recepcion.id,
                  remitente: asignado.remitente,
                  anexo: asignado.clasificacion,
                  institucion: asignado.institucion,
                  folio: asignado.folio,
                  asunto: asignado.asunto,
                  clasificacion: asignado.clasificacion,
                  expediente_Oficio: asignado.expediente_Oficio,
                  fecha_Recepcion: asignado.fecha_Recepcion,
                  fecha_Registro: asignado.fecha_Registro,
                  origen: recepcion.area_Origen,
                  tipo: copia,
                  acceso: recepcion.accede,
                  filtro: valorFiltro,
                  atendido: recepcion.atendido,
                  observaciones: recepcion.observaciones,
                };
              });
              break;
            case "Empleado":
              recepcion = await api.get(
                `/RecepcionDocumentosEmpleados/ByUsuario`
              );
              areaRecepcion = recepcion.data.data;
              recepcionArray = areaRecepcion.map((recepcion) => {
                let valorFiltro = false;
                let asignado = data.find(
                  (x) => x.id == recepcion.recepcion_Documento_Id
                );
                let fechaString = asignado.fecha_Recepcion.split(" ");
                let fecha = new Date(fechaString[0]);
                fecha.setMinutes(
                  fecha.getMinutes() + fecha.getTimezoneOffset()
                );
                if (fecha >= inicial && fecha <= final) {
                  valorFiltro = true;
                } else {
                  valorFiltro = false;
                }
                return {
                  id: asignado.id,
                  id_registro: recepcion.id,
                  remitente: asignado.remitente,
                  anexo: asignado.clasificacion,
                  institucion: asignado.institucion,
                  folio: asignado.folio,
                  asunto: asignado.asunto,
                  clasificacion: asignado.clasificacion,
                  expediente_Oficio: asignado.expediente_Oficio,
                  fecha_Recepcion: asignado.fecha_Recepcion,
                  fecha_Registro: asignado.fecha_Registro,
                  origen: "Asignado por jefe de área",
                  tipo: "Asignación",
                  acceso: recepcion.accede,
                  filtro: valorFiltro,
                  atendido: recepcion.atendido,
                  observaciones: recepcion.observaciones,
                };
              });
              break;
          }
        } else {
          let inicial = new Date(inicio);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          switch (localStorage.getItem("tipoEmp")) {
            case "JefeArea":
              recepcion = await api.get(
                `/RecepcionDocumentosAreas/ByArea/${localStorage.getItem(
                  "area"
                )}`
              );
              areaRecepcion = recepcion.data.data;
              console.log("estas son las areas", recepcion.data.data);
              recepcionArray = areaRecepcion.map((recepcion) => {
                let valorFiltro = false;
                let asignado = data.find(
                  (x) => x.id == recepcion.recepcion_Documento_Id
                );
                if (recepcion.cc == true) {
                  copia = "Marcado con copia";
                } else {
                  copia = "Turnado directamente";
                }
                let fechaString = asignado.fecha_Recepcion.split(" ");
                let fecha = new Date(fechaString[0]);
                fecha.setMinutes(
                  fecha.getMinutes() + fecha.getTimezoneOffset()
                );
                if (fecha.getTime() == inicial.getTime()) {
                  valorFiltro = true;
                } else {
                  valorFiltro = false;
                }
                return {
                  id: asignado.id,
                  id_registro: recepcion.id,
                  remitente: asignado.remitente,
                  anexo: asignado.clasificacion,
                  institucion: asignado.institucion,
                  folio: asignado.folio,
                  asunto: asignado.asunto,
                  clasificacion: asignado.clasificacion,
                  expediente_Oficio: asignado.expediente_Oficio,
                  fecha_Recepcion: asignado.fecha_Recepcion,
                  fecha_Registro: asignado.fecha_Registro,
                  origen: recepcion.area_Origen,
                  tipo: copia,
                  acceso: recepcion.accede,
                  filtro: valorFiltro,
                  atendido: recepcion.atendido,
                  observaciones: recepcion.observaciones,
                };
              });
              break;
            case "Empleado":
              recepcion = await api.get(
                `/RecepcionDocumentosEmpleados/ByUsuario`
              );
              areaRecepcion = recepcion.data.data;
              recepcionArray = areaRecepcion.map((recepcion) => {
                let valorFiltro = false;
                let asignado = data.find(
                  (x) => x.id == recepcion.recepcion_Documento_Id
                );
                let fechaString = asignado.fecha_Recepcion.split(" ");
                let fecha = new Date(fechaString[0]);
                fecha.setMinutes(
                  fecha.getMinutes() + fecha.getTimezoneOffset()
                );
                if (fecha.getTime() == inicial.getTime()) {
                  valorFiltro = true;
                } else {
                  valorFiltro = false;
                }
                return {
                  id: asignado.id,
                  id_registro: recepcion.id,
                  remitente: asignado.remitente,
                  anexo: asignado.clasificacion,
                  institucion: asignado.institucion,
                  folio: asignado.folio,
                  asunto: asignado.asunto,
                  clasificacion: asignado.clasificacion,
                  expediente_Oficio: asignado.expediente_Oficio,
                  fecha_Recepcion: asignado.fecha_Recepcion,
                  fecha_Registro: asignado.fecha_Registro,
                  origen: "Asignado por jefe de área",
                  tipo: "Asignación",
                  acceso: recepcion.accede,
                  filtro: valorFiltro,
                  atendido: recepcion.atendido,
                  observaciones: recepcion.observaciones,
                };
              });
              break;
          }
        }
        this.correspondencias = recepcionArray
          .filter((x) => x.acceso == true && x.filtro == true)
          .reverse();
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadPersonalArea(id) {
      this.recepcion_Id = id;
      this.notaAsignacion = null;
      let idEmpleado = parseInt(localStorage.getItem("empleado"));
      let arrayEmpleado = null;
      try {
        const resp = await api.get("/Empleados/GetListaByArea");
        const perResp = await api.get(
          `/RecepcionDocumentosEmpleados/ByRecepcion/${id}`
        );
        const { success, data } = resp.data;
        const personalRegistro = perResp.data.data;
        let notaFilter = personalRegistro.find((x) => x.nota != null);
        if (notaFilter != undefined) {
          this.notaAsignacion = notaFilter.nota;
        }
        arrayEmpleado = data.map((empleado) => {
          let respuesta = personalRegistro.find(
            (elemento) => elemento.empleado_Id == empleado.value
          );
          if (respuesta != undefined) {
            return {
              label: empleado.label,
              empleado_Id: parseInt(empleado.value),
              accede: respuesta.accede,
              registro: respuesta.accede,
              id_Registro: respuesta.id,
              nota: respuesta.nota,
            };
          } else {
            return {
              label: empleado.label,
              empleado_Id: parseInt(empleado.value),
              accede: false,
              registro: false,
              id_Registro: 0,
              nota: "",
            };
          }
        });
        this.lEmpleados = arrayEmpleado.filter(
          (x) => x.empleado_Id != idEmpleado
        );
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createReporte(registros, texto) {
      try {
        let img = new Image();
        let totalPagesExp = "{total_pages_count_string}";
        img.src = require("../assets/LOGO.png");
        let body = [];
        let nombreReporte = null;
        let fecha = [];
        let origenAsignacion;
        let area = parseInt(localStorage.getItem("area"));
        let tipoEmp = localStorage.getItem("tipoEmp").toString();
        let respEmp = await api.get(`/Empleados/ByArea/${area}`);
        let empleados = respEmp.data.data;
        let nombreEmpleado = "";
        let num = 1;
        if (tipoEmp == "JefeArea") {
          for (let item of registros) {
            nombreEmpleado = "";
            if (item.origen != null) {
              origenAsignacion = item.origen.replace("Asignado en", "");
            } else {
              origenAsignacion = item.origen;
            }
            let listEmp = await api.get(
              `/RecepcionDocumentosEmpleados/ByRecepcion/${item.id}`
            );
            let { data } = listEmp.data;
            if (data.length > 0) {
              empleados.forEach((emp) => {
                let filtro = data.find((x) => x.empleado_Id == emp.id);
                console.log("Esto es filtro", filtro);
                if (filtro != undefined) {
                  nombreEmpleado = nombreEmpleado.concat(" " + filtro.empleado);
                }
              });
            } else {
              nombreEmpleado = "Sin asignar";
            }
            /*if (data != undefined) {
              let { data } = prueba.data;
              console.log("Esto es data dentro de empleados", data);
            }*/

            body.push([
              num.toString(),
              item.folio,
              item.institucion,
              item.remitente,
              item.expediente_Oficio,
              item.asunto,
              item.fecha_Recepcion,
              origenAsignacion,
              nombreEmpleado,
            ]);
            let onlyDate = item.fecha_Recepcion.split(" ");
            fecha.push([onlyDate[0]]);
            num = num + 1;
          }
        } else {
          registros.forEach((item) => {
            body.push([
              num.toString(),
              item.folio,
              item.institucion,
              item.remitente,
              item.expediente_Oficio,
              item.asunto,
              item.fecha_Recepcion,
              "Jefe de área",
            ]);
            let onlyDate = item.fecha_Recepcion.split(" ");
            fecha.push([onlyDate[0]]);
            num = num + 1;
          });
        }

        let totalCifra = texto.split(" ");
        let textoReporte = "";
        if (totalCifra.length == 1) {
          let filtro = fecha.find((elemento) => elemento != texto);
          if (filtro == undefined) {
            textoReporte = "Recibidos el " + texto;
            nombreReporte = "Correspondencia_del_" + texto;
          } else {
            textoReporte = "Recibidos hasta el " + texto;
            nombreReporte = "Correspondencia_General_hasta_" + texto;
          }
        } else {
          textoReporte = "Recibidos " + texto;
          nombreReporte =
            "Correspondencia_" +
            totalCifra[0] +
            "_" +
            totalCifra[1] +
            "_" +
            totalCifra[2] +
            "_" +
            totalCifra[3];
        }
        jsPDF.autoTableSetDefaults({
          headStyles: { fillColor: [84, 37, 131], halign: "center" },
          styles: {
            halign: "center",
            valign: "middle",
          },
        });
        const doc = new jsPDF({
          orientation: "landscape",
          format: "letter",
        });
        doc.addImage(img, "png", 15, 13, 35, 20);
        doc.setFontSize(15);
        doc.text(
          "Oficialía de partes \n" + "Reporte de correspondencia",
          140,
          15,
          null,
          null,
          "center",
          22
        );
        doc.setFontSize(11);
        doc.text(textoReporte, 140, 30, null, null, "center");
        doc.setFontSize(11);
        doc.text(
          "Correspondencias recibidas: " + registros.length,
          260,
          33,
          null,
          null,
          "right"
        );
        if (tipoEmp == "JefeArea") {
          autoTable(doc, {
            theme: "grid",
            startY: 35,
            head: [
              [
                "#",
                "Folio",
                "Institución",
                "Remitente",
                "Número de expediente",
                "Asunto",
                "Fecha y hora de recepción",
                "Turnado por:",
                "Turnado a:",
              ],
            ],
            body: body,
            didDrawPage: function (data) {
              let str = "Página " + doc.internal.getNumberOfPages();
              if (typeof doc.putTotalPages === "function") {
                str = str + " de " + totalPagesExp;
              }
              doc.setFontSize(11);
              doc.text(str, 300, 205, null, null, "right");
            },
          });
        } else {
          autoTable(doc, {
            theme: "grid",
            startY: 35,
            head: [
              [
                "#",
                "Folio",
                "Institución",
                "Remitente",
                "Número de expediente",
                "Asunto",
                "Fecha y hora de recepción",
                "Turnado por:",
              ],
            ],
            body: body,
            didDrawPage: function (data) {
              let str = "Página " + doc.internal.getNumberOfPages();
              if (typeof doc.putTotalPages === "function") {
                str = str + " de " + totalPagesExp;
              }
              doc.setFontSize(11);
              doc.text(str, 300, 205, null, null, "right");
            },
          });
        }

        if (typeof doc.putTotalPages === "function") {
          doc.putTotalPages(totalPagesExp);
        }

        doc.save(nombreReporte + ".pdf");

        return {
          success: true,
          data: "Reporte generado con éxito",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createAsignacionEmpleados(empleados) {
      let bandera = [];
      try {
        for (let empleado of empleados) {
          const resp = await api.post(
            "/RecepcionDocumentosEmpleados",
            empleado
          );
        }
        return { success: true, data: "Asignacion de empleado(s) completa" };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async editAsignacionEmpleados(empleados) {
      try {
        for (let empleado of empleados) {
          const resp = await api.put(
            `/RecepcionDocumentosEmpleados/${empleado.id}`,
            empleado
          );
        }
        return {
          success: true,
          data: "Edición del acceso a empledo(s) realizado",
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createAtencionAsignacion(id, mensaje) {
      try {
        let tipoEmp = localStorage.getItem("tipoEmp").toString();
        if (tipoEmp == "JefeArea") {
          const resp = await api.get(`/RecepcionDocumentosAreas/${id}`);
          let { data, success } = resp.data;
          if (success == true) {
            let registro = {
              id: data.id,
              area_Id: data.area_Id,
              area_Origen: data.area_Origen,
              recepcion_Documento_Id: data.recepcion_Documento_Id,
              accede: data.accede,
              atendido: true,
              observaciones: mensaje,
              cc: data.cc,
              nota: data.nota,
            };
            const respEditar = await api.put(
              `/RecepcionDocumentosAreas/${id}`,
              registro
            );
            let respuesta = respEditar.data.success;
            if (respuesta == true) {
              return {
                success: true,
                data: "Atención al registro asignado completado",
              };
            } else {
              return {
                success: false,
                data: "Error al finalizar la atención",
              };
            }
          } else {
            return {
              success: success,
              data: "Error al aaceder al registro",
            };
          }
        } else {
          const resp = await api.get(`/RecepcionDocumentosEmpleados/${id}`);
          let { data, success } = resp.data;
          if (success == true) {
            let registro = {
              empleado_Id: data.empleado_Id,
              recepcion_Documento_Id: data.recepcion_Documento_Id,
              accede: data.accede,
              cc: true,
              sub_asignado: data.sub_asignado,
              nota: data.nota,
              atendido: true,
              observaciones: mensaje,
            };
            const respEditar = await api.put(
              `/RecepcionDocumentosEmpleados/${id}`,
              registro
            );
            let respuesta = respEditar.data.success;
            if (respuesta == true) {
              return {
                success: true,
                data: "Atención al registro asignado completado",
              };
            } else {
              return {
                success: false,
                data: "Error al finalizar la atención",
              };
            }
          } else {
            return {
              success: success,
              data: "Error al aaceder al registro",
            };
          }
        }
      } catch (error) {}
    },

    async loadAsignaciones(id) {
      try {
        const resp = await api.get(`/RecepcionDocumentos/${id}`);
        let { success, data } = resp.data;
        let listArea = [];
        let listPersonal = [];
        let listFinal = [];
        this.folio = data.folio;
        const respArea = await api.get(
          `/RecepcionDocumentosAreas/ByRecepcion/${id}`
        );
        let comprobacionArea = respArea.data.data;
        if (comprobacionArea.length >= 1) {
          listArea = comprobacionArea.map((areas) => {
            return {
              area: areas.area,
              estatus: areas.atendido,
              nota: areas.observaciones,
            };
          });
        }

        const respPersonal = await api.get(
          `/RecepcionDocumentosEmpleados/ByRecepcion/${id}`
        );
        let comprobacionEmpleado = respPersonal.data.data;
        if (comprobacionEmpleado.length >= 1) {
          listPersonal = comprobacionEmpleado.map((empleado) => {
            return {
              area: empleado.empleado,
              estatus: empleado.atendido,
              nota: empleado.observaciones,
            };
          });
        }

        listFinal = listArea.concat(listPersonal);
        this.finalizados = listFinal;
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    actualizarEmpleado(valor) {
      this.modalAsignacion = valor;
    },
    actualizarAdjunto(valor) {
      this.modalAdjuntos = valor;
    },
    actualizarFinalizacion(valor) {
      this.modalFinalizacion = valor;
    },
  },
});

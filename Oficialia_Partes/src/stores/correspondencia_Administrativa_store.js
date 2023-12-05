import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const useCorrespondenciaAdministrativaStore = defineStore(
  "correspondenciasAdmin",
  {
    state: () => ({
      modal: false,
      modalAsignacion: false,
      modalAdjuntos: false,
      correspondencias: [],
      correspondenciasGeneral: [],
      recepcion_Id: null,
      lEmpleados: [],
      notaAsignacionPersonal: null,
      notaAsignacionArea: null,
      lAreas: [],
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
                `/RecepcionDocumentosAreas/ByArea/${localStorage.getItem(
                  "area"
                )}`
              );
              areaRecepcion = recepcion.data.data;
              recepcionArray = areaRecepcion.map((recepcion) => {
                let areaAsignado = "";
                let areaCopia = "";
                let asignado = data.find(
                  (x) => x.id == recepcion.recepcion_Documento_Id
                );

                if (recepcion.cc == true) {
                  copia = "Marcado con copia";
                } else {
                  copia = "Turnado directamente";
                }

                for (let asignaciones of asignado.areas) {
                  if (asignaciones.cc == false) {
                    areaAsignado = areaAsignado.concat(
                      asignaciones.area + ", "
                    );
                  } else {
                    areaCopia = areaCopia.concat(asignaciones.area + ", ");
                  }
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
                  area_asignacion: areaAsignado,
                  area_copia: areaCopia,
                };
              });
              break;
            case "Empleado":
              recepcion = await api.get(
                `/RecepcionDocumentosEmpleados/ByUsuario`
              );
              areaRecepcion = recepcion.data.data;
              recepcionArray = areaRecepcion.map((recepcion) => {
                let areaAsignado = "";
                let areaCopia = "";
                let asignado = data.find(
                  (x) => x.id == recepcion.recepcion_Documento_Id
                );
                for (let asignaciones of asignado.areas) {
                  if (asignaciones.cc == false) {
                    areaAsignado = areaAsignado.concat(
                      asignaciones.area + ", "
                    );
                  } else {
                    areaCopia = areaCopia.concat(asignaciones.area + ", ");
                  }
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
                  atendido: recepcion.atendido,
                  observaciones: recepcion.observaciones,
                  area_asignacion: areaAsignado,
                  area_copia: areaCopia,
                };
              });
              break;
          }
          this.correspondencias = recepcionArray
            .filter((x) => x.acceso == true)
            .reverse();
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
                  let areaAsignado = "";
                  let areaCopia = "";
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
                  for (let asignaciones of asignado.areas) {
                    if (asignaciones.cc == false) {
                      areaAsignado = areaAsignado.concat(
                        asignaciones.area + ", "
                      );
                    } else {
                      areaCopia = areaCopia.concat(asignaciones.area + ", ");
                    }
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
                    area_asignacion: areaAsignado,
                    area_copia: areaCopia,
                  };
                });
                break;
              case "Empleado":
                recepcion = await api.get(
                  `/RecepcionDocumentosEmpleados/ByUsuario`
                );
                areaRecepcion = recepcion.data.data;
                recepcionArray = areaRecepcion.map((recepcion) => {
                  let areaAsignado = "";
                  let areaCopia = "";
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
                  for (let asignaciones of asignado.areas) {
                    if (asignaciones.cc == false) {
                      areaAsignado = areaAsignado.concat(
                        asignaciones.area + ", "
                      );
                    } else {
                      areaCopia = areaCopia.concat(asignaciones.area + ", ");
                    }
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
                    area_asignacion: areaAsignado,
                    area_copia: areaCopia,
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
                recepcionArray = areaRecepcion.map((recepcion) => {
                  let valorFiltro = false;
                  let areaAsignado = "";
                  let areaCopia = "";
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
                  for (let asignaciones of asignado.areas) {
                    if (asignaciones.cc == false) {
                      areaAsignado = areaAsignado.concat(
                        asignaciones.area + ", "
                      );
                    } else {
                      areaCopia = areaCopia.concat(asignaciones.area + ", ");
                    }
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
                    area_asignacion: areaAsignado,
                    area_copia: areaCopia,
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
                  let areaAsignado = "";
                  let areaCopia = "";
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
                  for (let asignaciones of asignado.areas) {
                    if (asignaciones.cc == false) {
                      areaAsignado = areaAsignado.concat(
                        asignaciones.area + ", "
                      );
                    } else {
                      areaCopia = areaCopia.concat(asignaciones.area + ", ");
                    }
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
                    area_asignacion: areaAsignado,
                    area_copia: areaCopia,
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

      async loadCorrespondenciaGeneral() {
        try {
          let recepcionArray = null;
          const resp = await api.get("/RecepcionDocumentos");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              if (data) {
                let recepcionArray = data.map((recepcion) => {
                  return {
                    id: recepcion.id,
                    remitente: recepcion.remitente,
                    anexo: recepcion.clasificacion,
                    institucion: recepcion.institucion,
                    folio: recepcion.folio,
                    asunto: recepcion.asunto,
                    clasificacion: recepcion.clasificacion,
                    expediente_Oficio: recepcion.expediente_Oficio,
                    fecha_Recepcion: recepcion.fecha_Recepcion,
                    fecha_Registro: recepcion.fecha_Registro,
                  };
                });
                this.correspondenciasGeneral = recepcionArray;
              }
            } else {
              return { success, data };
            }
            //await this.loadCorrespondenciaIndividual(data);
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

      async loadCorrespondenciaGeneralFecha(inicio, fin) {
        try {
          await this.loadCorrespondenciaGeneral();
          let registros = [...this.correspondenciasGeneral];
          this.correspondenciasGeneral = null;
          let recepcionFiltroArray = null;
          if (fin != 0) {
            let inicial = new Date(inicio);
            inicial.setMinutes(
              inicial.getMinutes() + inicial.getTimezoneOffset()
            );
            let final = new Date(fin);
            final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
            recepcionFiltroArray = registros.map((recepcion) => {
              let valorFiltro = null;
              let fechaString = recepcion.fecha_Recepcion.split(" ");
              let fecha = new Date(fechaString[0]);
              fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
              if (fecha >= inicial && fecha <= final) {
                valorFiltro = true;
              } else {
                valorFiltro = false;
              }
              return {
                id: recepcion.id,
                remitente: recepcion.remitente,
                anexo: recepcion.clasificacion,
                institucion: recepcion.institucion,
                folio: recepcion.folio,
                asunto: recepcion.asunto,
                clasificacion: recepcion.clasificacion,
                expediente_Oficio: recepcion.expediente_Oficio,
                fecha_Recepcion: recepcion.fecha_Recepcion,
                fecha_Registro: recepcion.fecha_Registro,
                filtro: valorFiltro,
              };
            });
          } else {
            let inicial = new Date(inicio);
            inicial.setMinutes(
              inicial.getMinutes() + inicial.getTimezoneOffset()
            );
            recepcionFiltroArray = registros.map((recepcion) => {
              let valorFiltro = null;
              let fechaString = recepcion.fecha_Recepcion.split(" ");
              let fecha = new Date(fechaString[0]);
              fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
              if (fecha.getTime() == inicial.getTime()) {
                valorFiltro = true;
              } else {
                valorFiltro = false;
              }
              return {
                id: recepcion.id,
                remitente: recepcion.remitente,
                anexo: recepcion.clasificacion,
                institucion: recepcion.institucion,
                folio: recepcion.folio,
                asunto: recepcion.asunto,
                clasificacion: recepcion.clasificacion,
                expediente_Oficio: recepcion.expediente_Oficio,
                fecha_Recepcion: recepcion.fecha_Recepcion,
                fecha_Registro: recepcion.fecha_Registro,
                filtro: valorFiltro,
              };
            });
          }
          this.correspondenciasGeneral = recepcionFiltroArray.filter(
            (x) => x.filtro == true
          );
        } catch (error) {
          console.log(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async loadPersonalArea(id) {
        this.notaAsignacionArea = null;
        this.notaAsignacionPersonal = null;
        this.recepcion_Id = id;
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
            this.notaAsignacionPersonal = notaFilter.nota;
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
          this.loadAreasCargo(id);
        } catch (error) {
          console.log(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },
      async loadAreasCargo(id) {
        let idArea = parseInt(localStorage.getItem("area"));
        let arrayAreas = null;
        let resp = null;
        try {
          let listAreas = await api.get(
            `/RecepcionDocumentosAreas/ByRecepcion/${id}`
          );
          let listAreasPermiso = listAreas.data.data;
          let notaFilter = listAreasPermiso.find((x) => x.nota != null);
          if (notaFilter != undefined) {
            this.notaAsignacionArea = notaFilter.nota;
          }
          if (idArea == 3) {
            resp = await api.get("/Areas/GetLista");
            const { success, data } = resp.data;
            arrayAreas = data.map((area) => {
              let respuesta = listAreasPermiso.find(
                (elemento) => elemento.area_Id == area.value
              );

              if (respuesta != undefined) {
                return {
                  label: area.label,
                  area_Id: area.value,
                  accede: respuesta.accede,
                  registro: respuesta.accede,
                  cc: false,
                  recepcion_Documento_Id: id,
                  id: respuesta.id,
                  nota: respuesta.nota,
                };
              } else {
                return {
                  label: area.label,
                  area_Id: area.value,
                  accede: false,
                  registro: false,
                  cc: false,
                  recepcion_Documento_Id: id,
                  id: 0,
                  nota: "",
                };
              }
            });
          } else {
            resp = await api.get(`/Areas/ByPadre/${idArea}`);
            const { success, data } = resp.data;
            arrayAreas = data.map((area) => {
              let respuesta = listAreasPermiso.find(
                (elemento) => elemento.area_Id == area.value
              );
              if (respuesta != undefined) {
                return {
                  label: area.label,
                  area_Id: area.value,
                  accede: respuesta.accede,
                  registro: respuesta.accede,
                  cc: respuesta.cc,
                  recepcion_Documento_Id: id,
                  id: respuesta.id,
                  nota: respuesta.nota,
                };
              } else {
                return {
                  label: area.label,
                  area_Id: area.value,
                  accede: false,
                  registro: false,
                  cc: false,
                  recepcion_Documento_Id: id,
                  id: 0,
                  nota: "",
                };
              }
            });
          }
          this.lAreas = arrayAreas.filter((x) => x.value != idArea);
        } catch (error) {}
      },

      async createReporte(registros, texto, individual) {
        try {
          let img = new Image();
          let totalPagesExp = "{total_pages_count_string}";
          img.src = require("../assets/LOGO.png");
          let body = [];
          let nombreReporte = null;
          let fecha = [];
          let num = 1;
          let origenAsignacion;
          let area = parseInt(localStorage.getItem("area"));
          let respEmp = await api.get(`/Empleados/ByArea/${area}`);
          let empleados = respEmp.data.data;
          let nombreArea = "Asignado en ".concat(empleados[0].area);
          let nombreEmpleado = "";
          let nombreAtendio = "";
          if (individual == false) {
            registros.forEach((item) => {
              body.push([
                num.toString(),
                item.folio,
                item.institucion,
                item.remitente,
                item.expediente_Oficio,
                item.asunto,
                item.fecha_Recepcion,
              ]);
              let onlyDate = item.fecha_Recepcion.split(" ");
              fecha.push([onlyDate[0]]);
              num = num + 1;
            });
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

            autoTable(doc, {
              theme: "grid",
              startY: 35,
              head: [
                [
                  "#",
                  "Folio",
                  "Consumible",
                  "Cantidad",
                  "Número de expediente",
                  "Asunto",
                  "Fecha y hora de recepción",
                ],
              ],
              body: body,
              bodyStyles: { fontSize: 8 },
              didDrawPage: function (data) {
                let str = "Página " + doc.internal.getNumberOfPages();
                if (typeof doc.putTotalPages === "function") {
                  str = str + " de " + totalPagesExp;
                }
                doc.setFontSize(11);
                doc.text(str, 300, 205, null, null, "right");
              },
            });
            if (typeof doc.putTotalPages === "function") {
              doc.putTotalPages(totalPagesExp);
            }

            doc.save(nombreReporte + ".pdf");

            return {
              success: true,
              data: "Reporte generado con éxito",
            };
          } else {
            for (let item of registros) {
              nombreEmpleado = "";
              nombreAtendio = "";
              if (item.origen != null) {
                origenAsignacion = item.origen.replace("Asignado en", "");
              } else {
                origenAsignacion = item.origen;
              }
              let listArea = await api.get(
                `/RecepcionDocumentosAreas/ByRecepcion/${item.id}`
              );
              let listEmp = await api.get(
                `/RecepcionDocumentosEmpleados/ByRecepcion/${item.id}`
              );
              let { data } = listEmp.data;
              let dataArea = listArea.data.data;
              if (dataArea.length > 0) {
                dataArea.forEach((are) => {
                  if (are.accede == true && are.cc == false) {
                    nombreEmpleado = nombreEmpleado.concat(
                      are.area_Siglas + "\n"
                    );
                    if (are.atendido == true) {
                      nombreAtendio = nombreAtendio.concat(
                        are.area_Siglas + "\n"
                      );
                    }
                  }
                });
              }
              if (data.length > 0) {
                empleados.forEach((emp) => {
                  let filtro = data.find((x) => x.empleado_Id == emp.id);
                  if (filtro != undefined) {
                    nombreEmpleado = nombreEmpleado.concat(
                      filtro.empleado + "\n"
                    );
                    if (data.atendido == true) {
                      nombreAtendio = nombreAtendio.concat(
                        filtro.empleado + "\n"
                      );
                    }
                  }
                });
              }
              if (nombreEmpleado == "") {
                nombreEmpleado = "Sin asignar";
              }
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
                nombreAtendio,
              ]);
              let onlyDate = item.fecha_Recepcion.split(" ");
              fecha.push([onlyDate[0]]);
              num = num + 1;
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
                  "Turnado por",
                  "Asignado a",
                  "Atendido por",
                ],
              ],
              body: body,
              bodyStyles: { fontSize: 8 },
              didDrawPage: function (data) {
                let str = "Página " + doc.internal.getNumberOfPages();
                if (typeof doc.putTotalPages === "function") {
                  str = str + " de " + totalPagesExp;
                }
                doc.setFontSize(11);
                doc.text(str, 300, 205, null, null, "right");
              },
            });
            if (typeof doc.putTotalPages === "function") {
              doc.putTotalPages(totalPagesExp);
            }

            doc.save(nombreReporte + ".pdf");

            return {
              success: true,
              data: "Reporte generado con éxito",
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

      async createAsignacionEmpleados(empleados) {
        let bandera = [];
        try {
          for (let empleado of empleados) {
            const resp = await api.post(
              "/RecepcionDocumentosEmpleados",
              empleado
            );
          }
          return { success: true, data: "Asignacion de empleado(s) realizado" };
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      async createAsignacionAreas(areas) {
        try {
          for (let area of areas) {
            const resp = await api.post("/RecepcionDocumentosAreas/", area);
          }
          return { success: true, data: "Asignacion de area(s) realizada" };
        } catch (error) {
          console.error(error);
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },
      async editAsignacionesAreas(areas) {
        try {
          for (let area of areas) {
            let resp = await api.put(
              `/RecepcionDocumentosAreas/${area.id}`,
              area
            );
          }
          return {
            success: true,
            data: "Edición de acceso de areas realizado",
          };
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

      async obtenerArea() {
        try {
          const resp = await api.get("/Areas/AreaByUsuario");
          const { data, success } = resp.data;
          return { data: data.area };
        } catch (error) {
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
    },
  }
);

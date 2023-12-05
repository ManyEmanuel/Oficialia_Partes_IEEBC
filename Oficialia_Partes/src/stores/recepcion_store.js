import moment from "moment-timezone";
import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const useRecepcionStore = defineStore("recepcion", {
  state: () => ({
    modal: false,
    modalArea: false,
    modalDocs: false,
    modalPersonal: false,
    modalViewer: false,
    modalResumen: false,
    isCC: false,
    isEditar: false,
    isLoading: false,
    adjunto_url: null,
    datosModal: null,
    lAreas: [],
    lAreasCC: [],
    lAdjuntos: [],
    lAnexos: [],
    empleados: [],
    recepciones: [],
    descarga: [],
    adjuntos: [],
    valores: [],

    areaN: {
      area_Id: null,
      recepcion_Documento_Id: null,
      accede: null,
      cc: null,
    },
    myLocale: {
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months:
        "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
          "_"
        ),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
      format24h: true,
      pluralDay: "dias",
    },
    recepcion: {
      id: null,
      remitente_Id: null,
      clasificacion_Id: null,
      configuracion_Oficialia_Id: null,
      fecha_Recepcion: null,
      asunto: null,
      descripcion: null,
      expediente_Oficio: null,
      areas: [],
      adjunto: [],
    },
    resumenRecepcion: {
      id: null,
      leyenda: null,
      remitente: null,
      clasificacion: null,
      institucion: null,
      folio: null,
      asunto: null,
      descripcion: null,
      expediente: null,
      fecha_recepcion: null,
      area_asignado: null,
      area_cc: null,
      nota: null,
    },
    textoArea: {
      nombre: null,
      nombreCC: null,
    },
    adjunto: {
      id: null,
      documento_Id: null,
      titulo: null,
      documento: null,
      is_Anexo: null,
    },

    empleado: {
      id: null,
      empleado_Id: null,
      recepcion_Documento_Id: null,
      accede: null,
      sub_asignado: null,
    },
  }),
  actions: {
    initRecepcion() {
      this.recepcion.id = null;
      this.recepcion.remitente_Id = null;
      this.recepcion.clasificacion_Id = null;
      this.recepcion.fecha_Recepcion = null;
      this.recepcion.asunto = null;
      this.recepcion.descripcion = null;
      this.recepcion.expediente_Oficio = null;
      this.recepcion.area = [];
      this.textoArea.nombre = null;
      this.textoArea.nombreCC = null;
    },

    initAdjunto() {
      this.adjunto.id = null;
      this.adjunto.documento_Id = null;
      this.adjunto.titulo = null;
      this.adjunto.documento = null;
      this.adjunto.is_Anexo = null;
    },

    /*initArea() {
      this.area.area_Id = null;
      this.area.accede = null;
      this.area.cc = null;
      this.textoArea.nombre = null;
      this.textoArea.nombreCC = null;
    },*/

    initAreaCC() {
      this.areaCC.id = null;
      this.areaCC.area_Id = null;
      this.areaCC.recepcion_Documento_Id = null;
      this.areaCC.accede = null;
      this.areaCC.nombre = null;
    },

    initEmpleado() {
      this.empleado.id = null;
      this.empleado.empleado_Id = null;
      this.empleado.recepcion_Documento_Id = null;
      this.empleado.accede = null;
      this.empleado.sub_asignado = null;
    },

    async loadFecha() {
      var fecha = moment.tz("America/Mazatlan").format("YYYY-MM-DD HH:mm");
      this.recepcion.fecha_Recepcion = fecha;
    },

    async loadAreasEdit() {
      this.recepcion.areas.forEach((item) => {
        if (item.cc == false) {
          let indice = this.lAreas.findIndex((elemento, indice) => {
            if (elemento.value === item.area_Id) {
              return true;
            }
          });
        } else if (item.cc == true) {
          let indice = this.lAreasCC.findIndex((elemento, indice) => {
            if (elemento.value === item.area_Id) {
              return true;
            }
          });
        }
      });
      console.log("Estos son las areas ya registradas", this.recepcion.areas);
    },

    async loadAreasSelectList() {
      try {
        const resp = await api.get("/Areas");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let areaArray = data.map((area) => {
                return {
                  label: area.nombre,
                  value: area.id,
                  select: false,
                  cc: false,
                  area_Id: 0,
                  recepcion_Documento_Id: 0,
                };
              });
              let areaArrayCC = data.map((area) => {
                return {
                  label: area.nombre,
                  value: area.id,
                  select: false,
                  cc: true,
                  area_Id: 0,
                  recepcion_Documento_Id: 0,
                };
              });
              this.lAreas = [...areaArray];
              this.lAreasCC = [...areaArrayCC];
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

    async loadRecepciones() {
      try {
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
              this.recepciones = recepcionArray;
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

    async loadRecepcionesFecha(inicio, fin) {
      try {
        await this.loadRecepciones();
        let registros = [...this.recepciones];
        this.recepciones = null;
        let recepcionFiltroArray = null;
        if (fin != 0) {
          let inicial = new Date(inicio);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          let final = new Date(fin);
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
          recepcionFiltroArray = registros.map((recepcion) => {
            let fechaString = recepcion.fecha_Recepcion.split(" ");
            let fecha = new Date(fechaString[0]);
            fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
            if (fecha >= inicial && fecha <= final) {
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
                filtro: true,
              };
            } else {
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
                filtro: false,
              };
            }
          });
        } else {
          let inicial = new Date(inicio);
          inicial.setMinutes(
            inicial.getMinutes() + inicial.getTimezoneOffset()
          );
          recepcionFiltroArray = registros.map((recepcion) => {
            let fechaString = recepcion.fecha_Recepcion.split(" ");
            let fecha = new Date(fechaString[0]);
            fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
            if (fecha.getTime() == inicial.getTime()) {
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
                filtro: true,
              };
            } else {
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
                filtro: false,
              };
            }
          });
        }
        this.recepciones = recepcionFiltroArray.filter((x) => x.filtro == true);
        return {
          success: true,
          data: "Busqueda finalizada",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async loadRecepcion(id) {
      try {
        await this.loadAreasSelectList();
        await this.loadDocumentos(id);
        const resp = await api.get(`/RecepcionDocumentos/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          console.log("ESte es el area,", data);
          if (success === true) {
            this.recepcion.id = data.id;
            this.recepcion.configuracion_Oficialia_Id =
              data.configuracion_Oficialia_Id;
            this.recepcion.remitente_Id = data.remitente_Id;
            this.recepcion.clasificacion_Id = data.clasificacion_Id;
            this.recepcion.asunto = data.asunto;
            this.recepcion.descripcion = data.descripcion;
            this.recepcion.expediente_Oficio = data.expediente_Oficio;
            this.recepcion.fecha_Recepcion = data.fecha_Recepcion;
            this.recepcion.areas = data.areas;
            let asignado = data.areas.filter((x) => x.cc == false);
            let copia = data.areas.filter((x) => x.cc == true);
            let textoAsignado = asignado.map(function (
              asignados,
              index,
              array
            ) {
              return asignados.area;
            });
            let textoCopia = copia.map(function (copias, index, array) {
              return copias.area;
            });
            this.textoArea.nombre = textoAsignado.toString();
            this.textoArea.nombreCC = textoCopia.toString();
            await this.loadAreasEdit();
            console.log("Estas son las areas asignadas", this.lAreas);
            console.log("Estas son las areas copia", this.lAreasCC);
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

    async loadDocumentos(valor) {
      try {
        const resp = await api.get(
          `/RecepcionDocumentoAdjuntos/ByRecepcion/${valor}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let documentoArray = data.map((documento) => {
                let tipo = "";
                if (documento.is_Anexo == true) {
                  tipo = "Anexo";
                } else {
                  tipo = "Oficio/Expediente";
                }
                return {
                  id: documento.id,
                  titulo: documento.titulo,
                  anexo: tipo,
                  hojas: 8,
                  documento_URL: documento.documento_URL,
                };
              });
              this.lAdjuntos = documentoArray;
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
    async loadResponsable() {
      try {
        const resp = await api.get("/ResponsablesAreas/ResposableByUsuario");
        const { data } = resp.data;
        console.log("Este es el empleado", localStorage.getItem("usuario"));
        console.log("Este es responsable", data.empleado);
        if (data.empleado === localStorage.getItem("usuario")) {
          console.log("Si son iguales");
        } else {
          console.log("No son iguales");
        }
      } catch (error) {}
    },

    async loadDocumento(id) {
      try {
        this.adjunto_url = "";
        const resp = await api.post(
          `/RecepcionDocumentoAdjuntos/GetDocumento`,
          { documento_Id: id, descarga: false },
          {
            responseType: "blob",
          }
        );
        console.log("Esto es data", resp.data);
        if (resp.status == 200) {
          let blob = new window.Blob([resp.data], {
            type: "application/pdf",
          });
          this.adjunto_url = window.URL.createObjectURL(blob);
          return { success: true };
        } else {
          return {
            success: false,
            data: "Error al descargar archivo, intentelo de nuevo",
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

    async loadNombresArea(valor) {
      if (valor == false) {
        let asignado = this.lAreas.filter((x) => x.select == true);
        let textoAsignado = asignado.map(function (asignados, index, array) {
          return asignados.label;
        });
        this.textoArea.nombre = textoAsignado.toString();
      } else {
        let copia = this.lAreasCC.filter((x) => x.select == true);
        let textoCopia = copia.map(function (copias, index, array) {
          return copias.label;
        });
        this.textoArea.nombreCC = textoCopia.toString();
      }
    },

    async loadResumenRecepcion(id, area, empleado, general) {
      try {
        let respNota = null;
        let nota = null;
        let areaAsignado = "";
        let ccopia = "";
        if (general == true) {
          respNota = await api.get(
            `/RecepcionDocumentosAreas/ByRecepcion/${id}`
          );
          await this.loadDocumentos(id);
          const resp = await api.get(`/RecepcionDocumentos/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            for (let asignaciones of data.areas) {
              console.log("Esto es la copia", asignaciones.cc);
              if (asignaciones.cc == false) {
                areaAsignado = areaAsignado.concat(asignaciones.area + ", ");
              } else {
                ccopia = ccopia.concat(asignaciones.area + ", ");
              }
            }
            if (success === true) {
              this.resumenRecepcion.id = data.id;
              this.resumenRecepcion.leyenda = data.leyenda;
              this.resumenRecepcion.remitente = data.remitente;
              this.resumenRecepcion.clasificacion = data.clasificacion;
              this.resumenRecepcion.institucion = data.institucion;
              this.resumenRecepcion.folio = data.folio;
              this.resumenRecepcion.asunto = data.asunto;
              this.resumenRecepcion.descripcion = data.descripcion;
              this.resumenRecepcion.expediente = data.expediente_Oficio;
              this.resumenRecepcion.fecha_recepcion = data.fecha_Recepcion;
              this.resumenRecepcion.area_asignado = areaAsignado;
              this.resumenRecepcion.area_cc = ccopia;
              this.resumenRecepcion.nota = nota;
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } else if (general == false) {
          if (area != 0) {
            respNota = await api.get(
              `/RecepcionDocumentosAreas/ByRecepcion/${id}`
            );
            let resultado = respNota.data.data;
            let filtro = resultado.find((x) => x.area_Id == area);
            nota = filtro.nota;
          } else if (empleado != 0) {
            respNota = await api.get(
              `/RecepcionDocumentosEmpleados/ByRecepcion/${id}`
            );
            let resultado = respNota.data.data;
            let filtro = resultado.find((x) => x.empleado_Id == empleado);
            nota = filtro.nota;
          }

          await this.loadDocumentos(id);
          const resp = await api.get(`/RecepcionDocumentos/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            for (let asignaciones of data.areas) {
              if (asignaciones.cc == false) {
                areaAsignado = areaAsignado.concat(asignaciones.area + ", ");
              } else {
                ccopia = ccopia.concat(asignaciones.area + ", ");
              }
            }
            if (success === true) {
              this.resumenRecepcion.id = data.id;
              this.resumenRecepcion.leyenda = data.leyenda;
              this.resumenRecepcion.remitente = data.remitente;
              this.resumenRecepcion.clasificacion = data.clasificacion;
              this.resumenRecepcion.institucion = data.institucion;
              this.resumenRecepcion.folio = data.folio;
              this.resumenRecepcion.asunto = data.asunto;
              this.resumenRecepcion.descripcion = data.descripcion;
              this.resumenRecepcion.expediente = data.expediente_Oficio;
              this.resumenRecepcion.fecha_recepcion = data.fecha_Recepcion;
              this.resumenRecepcion.area_asignado = areaAsignado;
              this.resumenRecepcion.area_cc = ccopia;
              this.resumenRecepcion.nota = nota;
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        }
        console.log("Esto es resumenRecepcion ", this.resumenRecepcion);
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createDocumentoBueno(documentos) {
      let bandera = [];
      for (let documento of documentos) {
        let bodyFormData = new FormData();
        bodyFormData.append("titulo", documento.titulo);
        bodyFormData.append("documento_Adjunto", documento.documento);
        bodyFormData.append("is_Anexo", documento.is_Anexo);
        let resp = await api.post(
          `/RecepcionDocumentoAdjuntos/${this.recepcion.id}`,
          bodyFormData,
          {
            headers: {
              "Conten-Type": `multipart/form-data";
              boundary=${bodyFormData.boundary}`,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );
        bandera.push = resp.data;
      }
      console.log("Esto es bandera", bandera);
      return { success: true, data: "Registro de documentos completa" };
    },

    async createNuevaArea(area) {
      try {
        await area.forEach(async (item) => {
          const resp = await api.post("/RecepcionDocumentosAreas/", {
            area_Id: item.area_Id,
            recepcion_Documento_Id: item.recepcion_Documento_Id,
            accede: item.accede,
            cc: item.cc,
            area_Origen: item.area_Origen,
          });
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
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
        });
      } catch (error) {
        console.error(error);
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async createRecepcion(recepcion) {
      try {
        const resp = await api.post("/RecepcionDocumentos", recepcion);
        if (resp.status == 200) {
          const { success, data, id } = resp.data;
          if (success === true) {
            this.recepcion.id = id;
            this.loadRecepciones();
            //this.actualizarDocs(true);
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

    async createReporte(registros, texto) {
      try {
        let img = new Image();
        let totalPagesExp = "{total_pages_count_string}";
        img.src = require("../assets/IEEN300.png");
        let body = [];
        let nombreReporte = null;
        let fecha = [];
        let num = 1;
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
        console.log("Esto es body", body, " esto es fecha", fecha);
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

    async loadDocumentoDescarga(documento) {
      try {
        let resp = await api.post(
          `RecepcionDocumentoAdjuntos/GetDocumento`,
          documento,
          {
            responseType: "blob",
          }
        );
        console.log("Esto es resp", resp);
        return { success: true, data: resp.data };
      } catch (error) {
        console.log(error);
      }
    },

    async updateRecepcion(recepcion) {
      try {
        const resp = await api.put(
          `/RecepcionDocumentos/${recepcion.id}`,
          recepcion
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.loadRecepciones();
            //this.actualizarDocs(true);
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

    async deleteRecepcion(id) {
      try {
        const resp = await api.delete(`/RecepcionDocumentos/${id}`);
        if (resp.status == 200) {
          let { success, data } = resp.data;
          console.log(resp.data);
          console.log("Esto es success", success, "Esto es data", data);
          if (success === true) {
            this.loadRecepciones();
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

    async deleteAdjunto(id) {
      try {
        const resp = await api.delete(
          `/RecepcionDocumentoAdjuntos/${this.recepcion.id}`
        );
        if (resp.status == 200) {
          let { success, data } = resp.data;
          if (success === true) {
            this.loadDocumentos(this.recepcion.id);
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
      if ((valor = false)) {
        this.datosModal = null;
      }
    },

    actualizarArea(valor, cc) {
      this.isCC = cc;
      this.modalArea = valor;
    },

    actualizarDocs(valor) {
      this.modalDocs = valor;
    },

    actualizarViewer(valor) {
      this.modalViewer = valor;
    },
    actualizarResumen(valor) {
      this.modalResumen = valor;
    },

    /*async loadFolio() {
      const resp = await api.get("/RecepcionDocumentos");
      let fecha = new Date();
      let anio = fecha.getFullYear();
      if (resp.status == 200) {
        const { success, data } = resp.data;
        if (success === true) {
          console.log("Este es el data", data.length);
          if (data.length > 0) {
            let listado = data[data.length - 1];
            let folio = listado.folio;
            let numfolio = folio.split("-");
            if (anio == Number(numfolio[2])) {
              let num = Number(numfolio[1]) + 1;
              if (num <= 9) {
                this.recepcion.folio = "OP-000" + num + "-" + anio;
              } else if (num >= 10 && num <= 99) {
                this.recepcion.folio = "OP-00" + num + "-" + anio;
              } else if (num >= 100 && num <= 999) {
                this.recepcion.folio = "OP-0" + num + "-" + anio;
              } else {
                this.recepcion.folio = "OP-" + num + "-" + anio;
              }
            } else {
              this.recepcion.folio = "OP-0001-" + anio;
            }
          } else {
            this.recepcion.folio = "OP-0001-" + anio;
          }
        }
        console.log("Este es el nuevo folio", this.recepcion.folio);
      }
    },*/
  },
});

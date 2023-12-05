import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const useReporteStore = defineStore("reporte", {
  state: () => ({
    totalClasificador: [],
  }),
  actions: {
    async loadConteoClasificador() {
      try {
        const docu = await api.get("/RecepcionDocumentos");
        let documentos = docu.data.data;
        const resp = await api.get("/Clasificaciones");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let clasificadorArray = data.map((clasificador) => {
                let total = 0;
                let filtro = documentos.filter(
                  (x) => x.clasificacion_Id == clasificador.id
                );
                if (filtro != undefined) {
                  total = filtro.length;
                }

                return {
                  nombre: clasificador.nombre,
                  descripcion: clasificador.descripcion,
                  total: total,
                };
              });
              this.totalClasificador = clasificadorArray;
            }
            console.log("Esto es el total", this.totalClasificador);
          } else {
            return { data: this.totalClasificador };
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
    async loadClasificadorFecha(inicio, fin) {
      try {
        const docu = await api.get("/RecepcionDocumentos");
        let documento = docu.data.data;
        let documentos = null;

        const resp = await api.get("/Clasificaciones");
        let inicial = new Date(inicio);
        inicial.setMinutes(inicial.getMinutes() + inicial.getTimezoneOffset());
        let final = "";
        if (fin != 0) {
          final = new Date(fin);
          final.setMinutes(final.getMinutes() + final.getTimezoneOffset());
        }
        let documentosArray = documento.map((recepcion) => {
          let valorFiltro = false;
          let fechaString = recepcion.fecha_Recepcion.split(" ");
          let fecha = new Date(fechaString[0]);
          fecha.setMinutes(fecha.getMinutes() + fecha.getTimezoneOffset());
          if (fin != 0) {
            if (fecha >= inicial && fecha <= final) {
              valorFiltro = true;
            } else {
              valorFiltro = false;
            }
          } else {
            if (fecha.getTime() == inicial.getTime()) {
              valorFiltro = true;
            } else {
              valorFiltro = false;
            }
          }
          return {
            clasificacion_Id: recepcion.clasificacion_Id,
            filtro: valorFiltro,
          };
        });
        documentos = documentosArray.filter((x) => x.filtro == true);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              let clasificadorArray = data.map((clasificador) => {
                let total = 0;
                let filtro = documentos.filter(
                  (x) => x.clasificacion_Id == clasificador.id
                );
                if (filtro != undefined) {
                  total = filtro.length;
                }

                return {
                  nombre: clasificador.nombre,
                  descripcion: clasificador.descripcion,
                  total: total,
                };
              });
              this.totalClasificador = clasificadorArray;
            }
            console.log("Esto es el total", this.totalClasificador);
          } else {
            return { data: this.totalClasificador };
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

    async createReporte(texto) {
      try {
        let totalCifra = texto.split(" ");
        let textoReporte = "";
        let nombreReporte = "";
        let img = new Image();
        let totalList = 0;
        let totalPagesExp = "{total_pages_count_string}";
        img.src = require("../assets/IEEN300.png");
        let body = [];
        let num = 1;
        this.totalClasificador.forEach((item) => {
          body.push([num.toString(), item.nombre, item.total]);
          num = num + 1;
          totalList = totalList + item.total;
        });
        jsPDF.autoTableSetDefaults({
          headStyles: { fillColor: [84, 37, 131], halign: "center" },
          styles: {
            halign: "center",
            valign: "middle",
          },
        });
        if (totalCifra.length == 1) {
          let resp = await api.get("/RecepcionDocumentos");
          let { data } = resp.data;

          if (data.length == totalList) {
            textoReporte = "Recibidos hasta el " + texto;
            nombreReporte = "Reporte_General_Clasificador_hasta_" + texto;
          } else {
            textoReporte = "Recibidos el " + texto;
            nombreReporte = "Reporte_Clasificadores_del_" + texto;
          }
        } else {
          textoReporte = "Recibidos " + texto;
          nombreReporte =
            "Reporte_Clasificadores_" +
            totalCifra[0] +
            "_" +
            totalCifra[1] +
            "_" +
            totalCifra[2] +
            "_" +
            totalCifra[3];
        }
        const doc = new jsPDF();
        doc.addImage(img, "png", 15, 8, 35, 18);
        doc.setFontSize(15);
        doc.text(
          "Oficialía de partes \n" + "Reporte de recepción por clasificadores",
          105,
          15,
          null,
          null,
          "center",
          22
        );
        doc.setFontSize(12);
        doc.text(textoReporte, 105, 27, null, null, "center", 22);
        autoTable(doc, {
          theme: "grid",
          startY: 35,
          head: [["#", "Clasificador", "Total"]],
          body: body,
          didDrawPage: function (data) {
            let str = "Página " + doc.internal.getNumberOfPages();
            if (typeof doc.putTotalPages === "function") {
              str = str + " de " + totalPagesExp;
            }
            doc.setFontSize(11);
            doc.text(str, 240, 290, null, null, "right");
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
  },
});

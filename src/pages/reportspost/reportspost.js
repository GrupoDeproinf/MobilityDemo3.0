import SelectBox from "devextreme-react/select-box";
import * as ReportsService from "../../api/reportspost";
import React, { useState, useEffect } from "react";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import { Toast } from "devextreme-react/toast";
import ExportJsonExcel from "js-export-excel";
import Moment from "moment";
import "./reportspost.scss";
export default function Reports() {
  const [Clientes, setClientes] = useState([]);
  const [Formularios, setFormularios] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [fechaInicial] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [FechaFinal, setFechaFinal] = useState(new Date());
  const initialState = {
    cliente: "",
    formulario: "",
    region: "TODAS LAS REGIONES",
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaFinal: new Date(),
    moneda: "Bs"
  };
  const [FiltrosReporte, setFiltrosReporte] = useState(initialState);

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const moneda = ["Bs", "$"]

  const columnas = [
    "formulario",
    "fecha_Formulario",
    // "hora_Formulario",
    "fecha_Sincronizado",
    // "hora_Sincronizado",
    "region",
    "usuario",
    "razon_social",
    "canal",
    "ciudad",
    "cod_est",
    "establecimiento",
    "categoria",
    "subcategoria",
    "marcaProducto",
    "codigo",
    "producto",
    "pregunta",
    "respuesta",
    "moneda",
    "tasa",
  ]

  const columnasTodoTicket = []

  const ColumnasTech = [
    "formulario",
    "fecha_Formulario",
    "hora_Formulario",
    "fecha_Creado",
    "hora_Creado",
    "region",
    "usuario",
    "pregunta",
    "respuesta",
  ]

  const columnasSynch = [
    "formulario",
    "fecha_Formulario",
    // "hora_Formulario",
    "fecha_Sincronizado",
    // "hora_Sincronizado",
    "region",
    "usuario",
    "razon_social",
    "canal",
    "ciudad",
    "cod_est",
    "establecimiento",]

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));

    // if (user.superAdmin){

    // }

    setClientes(user.cliente);
    setRegiones(user.region);
  }, []);

  const searchFormulario = (e) => {
    if (e.value != "") {
      setFiltrosReporte({ ...FiltrosReporte, cliente: e.value });
      ReportsService.getForms(e.value).then((resp) => {
        setFormularios(resp.data.data);
      });
    }
  };

  // Generar reporte
  const OnSubmit = () => {
    const fechaInicialReport = Moment(FiltrosReporte.fechaInicio).format(
      "YYYY-MM-DD"
    );
    const fechaFinalReport = Moment(FiltrosReporte.fechaFinal).format(
      "YYYY-MM-DD"
    );

    const generarReporte = {
      region: FiltrosReporte.region,
      fechaInicio: fechaInicialReport,
      fechaFinal: fechaFinalReport,
      formulario: FiltrosReporte.formulario,
      nombre_Cliente: FiltrosReporte.cliente,
      // moneda: FiltrosReporte.moneda,
    };

    if (
      generarReporte.nombre_Cliente == "" ||
      generarReporte.nombre_Cliente == undefined
    ) {
      setToastConfig({
        ...toastConfig,
        type: "warning",
        message: "Debe seleccionar un cliente",
        isVisible: true,
      });
      return false;
    }

    if (
      generarReporte.formulario == "" ||
      generarReporte.formulario == undefined
    ) {
      setToastConfig({
        ...toastConfig,
        type: "warning",
        message: "Debe seleccionar un formulario",
        isVisible: true,
      });
      return false;
    }
    if (generarReporte.region == "" || generarReporte.region == undefined) {
      setToastConfig({
        ...toastConfig,
        type: "warning",
        message: "Debe seleccionar una región",
        isVisible: true,
      });
      return false;
    }

    if (generarReporte.region == "TODAS LAS REGIONES") {
      generarReporte.region = undefined
    }
    const generarReporteParams = {
      region_name: FiltrosReporte.region,
      fecha_ini: fechaInicialReport,
      fecha_fin: fechaFinalReport,
      form_name: FiltrosReporte.formulario,
      client_name: FiltrosReporte.cliente === 'JORDAN COSMETIC, S.A' ? 'CHOCOLATES KRON, C.A.' : FiltrosReporte.cliente,

      // moneda: FiltrosReporte.moneda,
    };
    const ReporteParams = { params: generarReporteParams }
    ReportsService.generateReports(ReporteParams).then((resp) => {
      if (resp.data.length > 0) {
        console.log(ReporteParams)
        console.log(resp.data)
        if (generarReporte.formulario == "Fundamentales" || generarReporte.formulario == "Fundamental" || generarReporte.formulario == "FUNDAMENTAL") {
          let arrayFormPrice = resp.data.filter(x => x.pregunta == "PRECIO")
          let arrayForm = resp.data.filter(x => x.pregunta != "PRECIO")
          console.log(arrayFormPrice)
          console.log(arrayForm)
          exportData(arrayFormPrice, "Precios")
          exportData(arrayForm, "Fundamental")
        } else {
          // Descargar archivo de Excel
          exportData(resp.data, generarReporte.formulario)
        }
      } else {
        setToastConfig({
          ...toastConfig,
          type: "warning",
          message: "No se encontraron registro en la fecha dada",
          isVisible: true,
        });
      }
    });
    /*if (generarReporte.formulario == "Levantamiento Kioto"){
      ReportsService.generateReports(generarReporte).then((resp) => {
        if (resp.data.length > 0) {
          console.log(generarReporte)
          console.log(resp.data)
          if (generarReporte.formulario == "Fundamentales" || generarReporte.formulario == "Fundamental" || generarReporte.formulario == "FUNDAMENTAL") {
            let arrayFormPrice = resp.data.filter(x => x.pregunta == "PRECIO")
            let arrayForm = resp.data.filter(x => x.pregunta != "PRECIO")
            console.log(arrayFormPrice)
            console.log(arrayForm)
            exportData(arrayFormPrice, "Precios")
            exportData(arrayForm, "Fundamental")
          } else {
            // Descargar archivo de Excel
            exportData(resp.data, generarReporte.formulario)
          }
        } else {
          setToastConfig({
            ...toastConfig,
            type: "warning",
            message: "No se encontraron registro en la fecha dada",
            isVisible: true,
          });
        }
        // setFiltrosReporte(initialState);
        // setFiltrosReporte({FiltrosReporte, region: "TODAS LAS REGIONES", cliente: "", formulario: "", })
  
  
      });
    } else {
      // ReportsService.generateReportsFormateado(generarReporte).then((resp) => {
        ReportsService.generateReports(generarReporte).then((resp) => {
        if (resp.data.length > 0) {
          console.log(generarReporte)
          console.log(resp.data)
          if (generarReporte.formulario == "Fundamentales" || generarReporte.formulario == "Fundamental" || generarReporte.formulario == "FUNDAMENTAL") {
            let arrayFormPrice = resp.data.filter(x => x.pregunta == "PRECIO")
            let arrayForm = resp.data.filter(x => x.pregunta != "PRECIO")
            console.log(arrayFormPrice)
            console.log(arrayForm)
            exportData(arrayFormPrice, "Precios")
            exportData(arrayForm, "Fundamental")
          } else {
            // Descargar archivo de Excel
            exportData(resp.data, generarReporte.formulario)
          }
        } else {
          setToastConfig({
            ...toastConfig,
            type: "warning",
            message: "No se encontraron registro en la fecha dada",
            isVisible: true,
          });
        }
        // setFiltrosReporte(initialState);
        // setFiltrosReporte({FiltrosReporte, region: "TODAS LAS REGIONES", cliente: "", formulario: "", })
  
  
      });
    }*/

  };

  const exportData = (data, nombre) => {
    let option = {}; // la opción representa el archivo de Excel
    let dataTable = []; // Contenido de datos en archivo Excel
    option.fileName = nombre; // nombre del archivo Excel
    if (nombre == "Sincronizacion") {
      option.datas = [
        {
          sheetData: data, // Fuente de datos en archivo Excel
          sheetName: nombre, // nombre de la página de hoja en el archivo de Excel
          sheetFilter: columnasSynch,
          sheetHeader: columnasSynch
        },
      ];
    } else if (nombre == "Levantamiento Kioto") {
      option.datas = [
        {
          sheetData: data, // Fuente de datos en archivo Excel
          sheetName: nombre, // nombre de la página de hoja en el archivo de Excel
          sheetFilter: ColumnasTech,
          sheetHeader: ColumnasTech
        },
      ];
    } else if (nombre == "FORMULARIO TODOTICKET") {
      let item = data[0]

      for (const prop in item) {
        columnasTodoTicket.push(prop)
      }

      option.datas = [
        {
          sheetData: data, // Fuente de datos en archivo Excel
          sheetName: nombre, // nombre de la página de hoja en el archivo de Excel
          sheetFilter: columnasTodoTicket,
          sheetHeader: columnasTodoTicket
        },
      ];
    } else {
      option.datas = [
        {
          sheetData: data, // Fuente de datos en archivo Excel
          sheetName: nombre, // nombre de la página de hoja en el archivo de Excel
          sheetFilter: columnas,
          sheetHeader: columnas
        },
      ];
    }
    let toExcel = new ExportJsonExcel(option); // Generar archivo de Excel
    toExcel.saveExcel();
  }

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const [styleMode, setStyleMode] = useState("underlined");
  return (
    <React.Fragment>

      <div className={"content-block dx-card responsive-paddings"}>
        <h5 className={"titleCliente"}>Descarga de Reportes</h5>


        < div style={{ margin: "auto" }}>
          <div className="dx-fieldset">
            <div className="dx">
              <div className="seles">
                <SelectBox
                  className="SelectBoxC mb-4"
                  placeholder="Seleccione un cliente"
                  label="Cliente"
                  searchEnabled={true}
                  dataSource={Clientes}
                  onValueChanged={(e) => searchFormulario(e)}
                  defaultValue={FiltrosReporte.cliente}
                  value={FiltrosReporte.cliente}
                />
              </div>
            </div>

            <div className="dx">
              <div className="">
                <SelectBox
                  className="SelectBoxF mb-4"
                  placeholder="Seleccione un formulario"
                  label="Formulario"
                  labelMode="floating"
                  stylingModes={styleMode}
                  dataSource={Formularios}
                  searchEnabled={true}
                  valueExpr="nombre"
                  displayExpr="nombre"
                  onValueChanged={(e) =>
                    setFiltrosReporte({
                      ...FiltrosReporte,
                      formulario: e.value,
                    })
                  }
                  defaultValue={FiltrosReporte.formulario}
                  value={FiltrosReporte.formulario}
                />
              </div>
            </div>

            <div className="dx">
              <div className="">
                <SelectBox
                  className="SelectBoxR mb-4"
                  placeholder="Seleccione una región"
                  label="Región"
                  dataSource={Regiones}
                  searchEnabled={true}
                  // valueExpr="nombre_region"
                  // displayExpr="nombre_region"
                  onValueChanged={(e) =>
                    setFiltrosReporte({ ...FiltrosReporte, region: e.value })
                  }
                  defaultValue={FiltrosReporte.region}
                  value={FiltrosReporte.region}
                  style={{}}
                />
              </div>
            </div>
            {/* <div className="dx">
            <div className="">
              <SelectBox
                className="SelectBoxR mb-4"
                placeholder="Seleccione una región"
                label="Moneda"
                dataSource={moneda}
                searchEnabled={true}
                // valueExpr="nombre_region"
                // displayExpr="nombre_region"
                onValueChanged={(e) =>
                  setFiltrosReporte({ ...FiltrosReporte, moneda: e.value })
                }
                defaultValue={FiltrosReporte.moneda}
                value={FiltrosReporte.moneda}
                style={{}}
              />
            </div>
          </div> */}

            <div className="dx">
              <div className="">
                <DateBox
                  className="SelectBoxDate mb-4"
                  placeholder="Fecha de reporte desde"
                  label="Desde"
                  onValueChanged={(e) =>
                    setFiltrosReporte({
                      ...FiltrosReporte,
                      fechaInicio: e.value,
                    })
                  }
                  defaultValue={fechaInicial}
                  value={fechaInicial}
                  type="date"
                />
              </div>
            </div>

            <div className="dx">
              <div className="">
                <DateBox
                  className="SelectBoxDate mb-4"
                  placeholder="Fecha de reporte hasta"
                  label="Hasta"
                  onValueChanged={(e) =>
                    setFiltrosReporte({
                      ...FiltrosReporte,
                      fechaFinal: e.value,
                    })
                  }
                  defaultValue={FechaFinal}
                  value={FechaFinal}
                  type="date"
                />
              </div>
            </div>
          </div>
          <div className="BTN">
            <Button
              className="btnGenerarReporte"
              variant="contained"
              onClick={() => OnSubmit()}
              size="large"
            >
              Generar reporte
            </Button>
          </div>
        </div>



        <Toast
          visible={toastConfig.isVisible}
          message={toastConfig.message}
          type={toastConfig.type}
          onHiding={onHiding}
          displayTime={toastConfig.displayTime}
        />
      </div>
    </React.Fragment>
  );
}

import SelectBox from "devextreme-react/select-box";
import * as ReportsService from "../../api/reports";
import React, { useState, useEffect } from "react";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import { Toast } from "devextreme-react/toast";
import ExportJsonExcel from "js-export-excel";
import { ExportToCsv } from 'export-to-csv';
import "./SpecialReports.scss";
import Moment from "moment";


export default function SpecialReports() {
  const [Clientes, setClientes] = useState([]);
  const [Formularios, setFormularios] = useState(['Verificaciones','Usuarios']);
  const [Regiones, setRegiones] = useState([]);
  const [fechaInicial, setfechaInicial] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [FechaFinal, setFechaFinal] = useState(new Date());
  const initialState = {
    cliente: "",
    formulario: "",
    region: "TODAS LAS REGIONES",
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaFinal: new Date(),
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

  const options = { 
    fieldSeparator: ';',
    quoteStrings: '',
    decimalSeparator: '.',
    showLabels: false, 
    showTitle: false,
    title: 'Verificaciones',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    headers:[]
  };

  const columnas = [
    "cedula",
    "nombre", 
    "apellido", 
    "email", 
    "perfil", 
    "clientes",
    "regiones",
    "formularios", 
    "version_app", 
    "formulariosNro1",
    "versionNro1",
    "formulariosNro2",
    "versionNro2",
    "formulariosNro3",
    "versionNro3",
    ]

  const columnasSynch = [
    "cedula",
    "nombre", 
    "apellido", 
    "email", 
    "perfil",
    "clientes",
    "regiones",
    "formularios", 
    "version_app",
    "formulariosNro1",
    "versionNro1",
    "formulariosNro2",
    "versionNro2",
    "formulariosNro3",
    "versionNro3",
  ]

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
  
    // if (user.superAdmin){

    // }
    

    user.cliente.unshift('TODOS LOS CLIENTES')
    setClientes(user.cliente);
    setRegiones(user.region);
  }, []);

  // Generar reporte
  const OnSubmit = () => {
    const fechaInicialReport = Moment(FiltrosReporte.fechaInicio).format(
      "YYYY-MM-DD"
    );
    const fechaFinalReport = Moment(FiltrosReporte.fechaFinal).format(
      "YYYY-MM-DD"
    );

    const generarReporte = {
      region:FiltrosReporte.region,
      fechaInicio: fechaInicialReport,
      fechaFinal: fechaFinalReport,
      formulario: FiltrosReporte.formulario,
      nombre_Cliente: FiltrosReporte.cliente,
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

    if (generarReporte.region == "TODAS LAS REGIONES"){
      generarReporte.region = undefined
    }

    console.log(generarReporte.formulario)
    if (generarReporte.formulario == 'Usuarios'){
      ReportsService.generateSpecialReportsUsuarios(generarReporte).then((resp) => {
        console.log(resp.data)
        if (resp.data.length > 0){
          exportData(resp.data, "Usuarios")
        } else {
          setToastConfig({
            ...toastConfig,
            type: "warning",
            message: "No se encontraron registro en la fecha dada",
            isVisible: true,
          });
        }
      });
    } else {
      ReportsService.generateSpecialReports(generarReporte).then((resp) => {
        if (resp.data.length > 0){
          console.log(resp.data)
          

          const csvExporter = new ExportToCsv(options);
          csvExporter.generateCsv(resp.data)
  
          // if (generarReporte.formulario == "Fundamentales" || generarReporte.formulario == "Fundamental" || generarReporte.formulario == "Verificaciones"){
          //   let arrayFormPrice = resp.data.filter(x=>x.pregunta == "PRECIO")
          //   let arrayForm = resp.data.filter(x=>x.pregunta != "PRECIO")
          //   exportData(arrayFormPrice, "Precios")
          //   exportData(arrayForm, "Fundamental")
          // } else {
          //   // Descargar archivo de Excel
          //   exportData(resp.data, generarReporte.formulario)
          // }
        } else {
          setToastConfig({
            ...toastConfig,
            type: "warning",
            message: "No se encontraron registro en la fecha dada",
            isVisible: true,
          });
        }
        // setFiltrosReporte({ ...FiltrosReporte, region: "TODAS LAS REGIONES", cliente: "", formulario: "", })
      });
    }
    
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

  const data = [
    { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
    { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
    { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
  ];

  return (
    <React.Fragment>

      <div className={"content-block dx-card responsive-paddings"}>
      <h5 className={"titleCliente"}>Reportes Especiales</h5>

    
      < div style={{ margin: "auto" }}>
        <div className="dx-fieldset">
          <div className="dx">
            <div className="seles">
              <SelectBox
                className="SelectBoxC mb-4"
                placeholder="Seleccione un cliente"
                label="Cliente"
                dataSource={Clientes}
                onValueChanged={(e) => setFiltrosReporte({ ...FiltrosReporte, cliente: e.value })}
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
                // valueExpr="nombre"
                // displayExpr="nombre"
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

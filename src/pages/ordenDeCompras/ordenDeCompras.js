import * as DinamicQueries from '../../api/DinamicsQuery'
import SelectBox from "devextreme-react/select-box";
import * as ReportsService from "../../api/reports";
import React, { useState, useEffect } from "react";
import { Button } from "devextreme-react/button";
import DateBox from "devextreme-react/date-box";
import { Toast } from "devextreme-react/toast";
import ExportJsonExcel from "js-export-excel";
import Moment from "moment";
import "./ordenDeCompras.scss";

export default function OrdenesCompra() {
  const [Clientes, setClientes] = useState([]);
  const [Formularios, setFormularios] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [fechaInicial, setfechaInicial] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [FechaFinal, setFechaFinal] = useState(new Date());
  const initialState = {
    cliente: "",
    region: "TODAS LAS REGIONES",
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaFinal: new Date(),
  };
  const [FiltrosordenesCompra, setFiltrosordenesCompra] = useState(initialState);

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const columnas = [
    "cliente",
    "fechaCreado",
    "fechaOrden",
    "num_Orden",
    "region",
    "usuario",
    "rif",
    "nombre_establecimiento",
    "descripcion_razon_social",
    "region",
    "ciudad",
    "direccion",
    "coordenadas",
    "nombre_gerente_compras",
    "telefono_gerente_compras",
    "correo_gerente_compras",
    "nombre_gerente_pagos",
    "telefono_gerente_pagos",
    "correo_gerente_pagos",
    "dias_credito",
    "canal",
    "descripcion_agrupador",
    "estatus",
    "id_establecimiento",
    "id_origen",
    "subcanal",
    "zona",
    "dias_pago",
    "horarios_atencion",
    "vendedor",
    "categoria",
    "subcategoria",
    "marcaProducto",
    "sku",
    "cod_barra",
    "precio",
    "precio_sugerido",
    // "cat",
    // "sub",
    // "pro",
    // "mar",
    "bultoUnidadTotal",
    "bultoUnidadCaja",
    "pedidoUnidadTotal",
    "pedidoCantidadCaja",
  ]

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  


  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));
  
    setClientes(user.cliente);
    setRegiones(user.region);
  }, []);

  // const searchFormulario = (e) => {
  //   if (e.value != "") {
  //     setFiltrosordenesCompra({ ...FiltrosordenesCompra, cliente: e.value });
  //     ReportsService.getForms(e.value).then((resp) => {
  //       setFormularios(resp.data.data);
  //     });
  //   }
  // };

  // Generar reporte
  const OnSubmit = () => {
    const fechaInicialReport = Moment(FiltrosordenesCompra.fechaInicio).format(
      "YYYY-MM-DD"
    );
    const fechaFinalReport = Moment(FiltrosordenesCompra.fechaFinal).format(
      "YYYY-MM-DD"
    );

    const generarordenesCompra = {
      region:FiltrosordenesCompra.region,
      fechaInicio: fechaInicialReport,
      fechaFinal: fechaFinalReport,
      nombre_Cliente: FiltrosordenesCompra.cliente,
    };

    if (
      generarordenesCompra.nombre_Cliente == "" ||
      generarordenesCompra.nombre_Cliente == undefined
    ) {
      setToastConfig({
        ...toastConfig,
        type: "warning",
        message: "Debe seleccionar un cliente",
        isVisible: true,
      });
      return false;
    }

    if (generarordenesCompra.region == "" || generarordenesCompra.region == undefined) {
      setToastConfig({
        ...toastConfig,
        type: "warning",
        message: "Debe seleccionar una región",
        isVisible: true,
      });
      return false;
    }

    if (generarordenesCompra.region == "TODAS LAS REGIONES"){
      generarordenesCompra.region = undefined
    }
    
    console.log(generarordenesCompra)
    // ReportsService.generateReports(generarordenesCompra).then((resp) => {
    DinamicQueries.getDataWithParameters('generateOrden', "ordenes/", generarordenesCompra).then((resp) => {
      if (resp.data.length > 0){
        console.log(generarordenesCompra)
        console.log(resp.data)
        if (generarordenesCompra.formulario == "Fundamentales" || generarordenesCompra.formulario == "Fundamental" || generarordenesCompra.formulario == "FUNDAMENTAL"){
          let arrayFormPrice = resp.data.filter(x=>x.pregunta == "PRECIO")
          let arrayForm = resp.data.filter(x=>x.pregunta != "PRECIO")
          console.log(arrayFormPrice)
          console.log(arrayForm)
          exportData(arrayFormPrice, "Precios")
          exportData(arrayForm, "Fundamental")
        } else {
          // Descargar archivo de Excel
          console.log(resp.data)
          const datafinal = resp.data.filter(x=>x.pedidoCantidadCaja !== undefined && x.pedidoCantidadCaja !== 0 && x.pedidoCantidadCaja !== "")
          datafinal.sort((a, b) => {
            if (a.fechaCreado > b.fechaCreado) {
              return -1;
            } else if (a.fechaCreado < b.fechaCreado) {
              return 1; 
            } else {
              return 0; 
            }
          });
          exportData(datafinal, "Ordenes de Compra")
        }
      } else {
        setToastConfig({
          ...toastConfig,
          type: "warning",
          message: "No se encontraron registro en la fecha dada",
          isVisible: true,
        });
      }
      // setFiltrosordenesCompra(initialState);
      setFiltrosordenesCompra({ ...FiltrosordenesCompra, region: "TODAS LAS REGIONES", cliente: "", formulario: "", })


    });
  };

  const exportData = (data, nombre) => {
    let option = {}; // la opción representa el archivo de Excel
    let dataTable = []; // Contenido de datos en archivo Excel
    option.fileName = nombre; // nombre del archivo Excel
      option.datas = [
        {
          sheetData: data, // Fuente de datos en archivo Excel
          sheetName: nombre, // nombre de la página de hoja en el archivo de Excel
          sheetFilter: columnas,
          sheetHeader: columnas
        },
      ];
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
      <h5 className={"titleCliente"}>Ordenes de Compra</h5>

    
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
                onValueChanged={(e) =>
                  setFiltrosordenesCompra({
                    ...FiltrosordenesCompra,
                    cliente: e.value,
                  })
                }
                defaultValue={FiltrosordenesCompra.cliente}
                value={FiltrosordenesCompra.cliente}
              />
            </div>
          </div>

          {/* <div className="dx">
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
                  setFiltrosordenesCompra({
                    ...FiltrosordenesCompra,
                    formulario: e.value,
                  })
                }
                defaultValue={FiltrosordenesCompra.formulario}
                value={FiltrosordenesCompra.formulario}
              />
            </div>
          </div> */}

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
                  setFiltrosordenesCompra({ ...FiltrosordenesCompra, region: e.value })
                }
                defaultValue={FiltrosordenesCompra.region}
                value={FiltrosordenesCompra.region}
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
                  setFiltrosordenesCompra({
                    ...FiltrosordenesCompra,
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
                  setFiltrosordenesCompra({
                    ...FiltrosordenesCompra,
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
          className="btnGenerarordenesCompra"
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

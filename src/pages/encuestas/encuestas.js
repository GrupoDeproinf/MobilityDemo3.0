import * as DinamicQueries from '../../api/DinamicsQuery'
import SelectBox from "devextreme-react/select-box";
import * as ReportsService from "../../api/reports";
import React, { useState, useEffect } from "react";
import { Button } from "devextreme-react/button";
import { CheckBox } from 'devextreme-react/check-box';
import DateBox from "devextreme-react/date-box";
import { Toast } from "devextreme-react/toast";
import ExportJsonExcel from "js-export-excel";
import Moment from "moment";
import { fire } from "../../api/firebaseEnv";
import "./encuestas.scss";

export default function Encuestas() {
  const [Clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState(["OPERACIONES", "SURVEY"]);
  const [Formularios, setFormularios] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [filterToSurvey, setFilterToSurvey] = useState(false);
  const [fechaInicial, setfechaInicial] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [FechaFinal, setFechaFinal] = useState(new Date());
  const initialState = {
    cliente: "",
    region: "TODAS LAS REGIONES",
    fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaFinal: new Date(),
    empresa: ""
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
    "formulario",
    "fecha_Formulario",
    "hora_Formulario",
    "fecha_Sincronizado",
    "hora_Sincronizado",
    "region",
    "usuario",
    "razon_social",
    "canal",
    "ciudad",
    "cod_est",
    "establecimiento",
  ]


  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("userData"));

    setClientes(user.cliente);
    setRegiones(user.region);
  }, []);

  // Generar reporte
  const OnSubmit = () => {
    const fechaInicialReport = Moment(FiltrosordenesCompra.fechaInicio).format(
      "YYYY-MM-DD"
    );
    const fechaFinalReport = Moment(FiltrosordenesCompra.fechaFinal).format(
      "YYYY-MM-DD"
    );

    const generarordenesCompra = {
      region: FiltrosordenesCompra.region,
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

    if (generarordenesCompra.region == "TODAS LAS REGIONES") {
      generarordenesCompra.region = undefined
    }

    // console.log(generarordenesCompra)
    // ReportsService.generateReports(generarordenesCompra).then((resp) => {
    DinamicQueries.getDataWithParameters('generateEncuesta', "ordenes/", generarordenesCompra).then((resp) => {
      if (resp.data.length > 0) {
        // console.log(generarordenesCompra)
        console.log(resp.data)
        if (generarordenesCompra.formulario == "Fundamentales" || generarordenesCompra.formulario == "Fundamental" || generarordenesCompra.formulario == "FUNDAMENTAL") {
          let arrayFormPrice = resp.data.filter(x => x.pregunta == "PRECIO")
          let arrayForm = resp.data.filter(x => x.pregunta != "PRECIO")
          console.log(arrayFormPrice)
          console.log(arrayForm)
          // exportData(arrayFormPrice, "Precios")
          // exportData(arrayForm, "Fundamental")
        } else {
          // Descargar archivo de Excel

          // console.log(resp.data)
          let dataFinal = []
          resp.data.forEach(async cadaRegistro => {
            // const consulta = await fire.collection('establecimientos').doc(cadaRegistro.key_est).get();

            // console.log("🚀 ~ fire.collection ~ EstFirebase:", consulta.data())
            let keyPregunta = {}
            keyPregunta.CLIENTE = generarordenesCompra.nombre_Cliente
            keyPregunta.FORMULARIO = "Encuesta"
            keyPregunta.FECHA_FORMULARIO = cadaRegistro.fecha_Formulario
            keyPregunta.HORA_FORMULARIO = cadaRegistro.fecha_Formulario
            keyPregunta.FECHA_SINCRONIZADO = cadaRegistro.fecha_Sincronizado
            keyPregunta.HORA_SINCRONIZADO = cadaRegistro.fecha_Sincronizado
            keyPregunta.REGION = cadaRegistro.region
            keyPregunta.USUARIO = cadaRegistro.promotor
            keyPregunta.RAZON_SOCIAL = cadaRegistro.razon_social
            keyPregunta.CANAL = cadaRegistro.canal
            keyPregunta.CIUDAD = cadaRegistro.ciudad
            keyPregunta.COD_EST = cadaRegistro.cod_est
            keyPregunta.ESTABLECIMIENTO = cadaRegistro.establecimiento

            if (FiltrosordenesCompra.empresa === 'OPERACIONES') {
              cadaRegistro?.preguntas?.forEach(cadaPregunta => {
                keyPregunta[cadaPregunta.pregunta] = buscarRespuestaOperaciones(cadaPregunta)
              })
              dataFinal.push(keyPregunta)
            } else if (FiltrosordenesCompra.empresa === 'SURVEY') {

              let resFisrtOption = 0

              cadaRegistro?.preguntas?.forEach((cadaPregunta, i) => {

                //Buscar respuesta de la pregunta 1 dentro de este bucle para encontrar la respuesta dentro de la segunda 
                //guardado la respuesta en una variable temporal afuera de este men llamado bucle de respuesta

                const TempOtros = typeof cadaPregunta.respuesta !== 'boolean' && cadaPregunta.respuesta !== undefined ? cadaPregunta.respuesta.search('OTRO:') : '';

                if (i === 0) {
                  keyPregunta['F.' + (i + 1) + '.-' + cadaPregunta.pregunta] = TempOtros !== 0 ? buscarRespuestaSurvey(cadaPregunta) : '';
                } else if (i === 1) {
                  //Respuesta 1
                  keyPregunta[i + '.-' + cadaPregunta.pregunta] = TempOtros !== 0 ? buscarRespuestaSurvey(cadaPregunta) : (cadaPregunta.opciones.length + 1);
                  resFisrtOption = TempOtros !== 0 ? buscarRespuestaSurvey(cadaPregunta) : (cadaPregunta.opciones.length + 1);
                } else if (i === 2) {
                  keyPregunta[(i - 1) + '.' + (i - 1) + '.-' + cadaPregunta.pregunta] = TempOtros !== 0 ? buscarRespuestaSurvey(cadaPregunta) : '';
                } else {
                  keyPregunta[(i - 1) + '.-' + cadaPregunta.pregunta] = TempOtros !== 0 ? buscarRespuestaSurvey(cadaPregunta) : (cadaPregunta.opciones.length + 1);
                }

                if (cadaPregunta.tipo === 'Selección') {
                  if (TempOtros != 0) {

                    const TempRespuestas = cadaPregunta.respuesta !== undefined ? cadaPregunta.respuesta.split(';') : [];

                    const test = TempRespuestas.filter((element) => element.trim() !== '')
                    // console.log("🚀 ~ cadaRegistro?.preguntas?.forEach ~ test:", test)

                    let myOptions = [];

                    cadaPregunta.opciones.forEach((cadaOpcion, i) => {
                      if (test.find((x) => x.trim() === cadaOpcion)) {
                        myOptions.push(i + 1);
                      }
                    })

                    myOptions = myOptions.filter(x=> x != resFisrtOption)
                    // console.log("🚀 ~ cadaRegistro?.preguntas?.forEach ~ resFisrtOption:", resFisrtOption)
                    // console.log("🚀 ~ myOptions ~ myOptions:", myOptions)

                    //Armado de las respuestas 1.1.1
                    cadaPregunta.opciones?.forEach((cadaOpcion, j) => {
                      keyPregunta[(i - 1) + '.' + (i - 1) + '.' + (j + 1)] = myOptions[j] != undefined ? myOptions[j] : '';

                    })

                    keyPregunta[(i - 1) + '.' + (i - 1) + '.-' + 'OTRO'] = '';
                  } else {
                    cadaPregunta.opciones?.forEach((cadaOpcion, j) => {
                      keyPregunta[(i - 1) + '.' + (i - 1) + '.' + (j + 1)] = '';
                    })

                    keyPregunta[(i - 1) + '.' + (i - 1) + '.-' + 'OTRO'] = cadaPregunta.respuesta;
                  }




                } else if (cadaPregunta.tipo === 'Múltiple / Otro') {
                  if (i === 1) {
                    keyPregunta[i + '.-' + 'OTRO'] = TempOtros === 0 ? buscarRespuestaSurvey(cadaPregunta) : '';
                  } else {
                    keyPregunta[(i - 1) + '.-' + 'OTRO'] = TempOtros === 0 ? buscarRespuestaSurvey(cadaPregunta) : '';
                  }

                }
              })
              dataFinal.push(keyPregunta)
            }
          })

          if (FiltrosordenesCompra.empresa === 'SURVEY') {
            dataFinal = dataFinal.map((objeto) => {
              for (let clave in objeto) {
                if (typeof objeto[clave] === 'string' && objeto[clave].startsWith('OTRO: ')) {
                  objeto[clave] = objeto[clave].replace('OTRO: ', '');
                }
              }
              return objeto;
            });

            if (filterToSurvey) {
              dataFinal = dataFinal.filter(objeto => {
                for (let clave in objeto) {

                  if (clave.startsWith('F.1.-') && objeto[clave] === 1) {
                    return true;
                  }
                }
                return false;
              });
            }
          }

          console.log(dataFinal)
          const header = Object.keys(dataFinal[0]);
          // console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ header:", header)

          exportData(dataFinal, "Encuestas", header)
        }
      } else {
        setToastConfig({
          ...toastConfig,
          type: "warning",
          message: "No se encontraron registro en la fecha dada",
          isVisible: true,
        });
      }
      setFiltrosordenesCompra(initialState);
      setFiltrosordenesCompra({ ...FiltrosordenesCompra, region: "TODAS LAS REGIONES", cliente: "", formulario: "", empresa: ""})
    });
  };

  const buscarRespuestaSurvey = (data) => {
    if (data.tipo == "Simple") {
      return data.respuesta == true ? 1 : 2;
    } else if (data.tipo == "Múltiple / Otro" || data.tipo == "Múltiple") {

      const posicion = data.respuesta == undefined ? '' : data.opciones.indexOf(data.respuesta.trim());

      return posicion === -1 ? data.respuesta === 'OTRO: ' ? '' : data.respuesta : posicion !== '' ? (posicion + 1) : '';

    } else if (data.tipo == "Selección") {
      return ""
    }
  }

  const buscarRespuestaOperaciones = (data) => {
    if (data.tipo == "Simple") {
      return data.respuesta == true ? "Si" : "No"
    } else {
      return data.respuesta == undefined ? "" : data.respuesta
    }
  }

  const AllMUppercase = (array) => {
    return array.map(item => item.toUpperCase());
  }


  const exportData = (data, nombre, columnasNew) => {
    let option = {}; // la opción representa el archivo de Excel
    let dataTable = []; // Contenido de datos en archivo Excel
    option.fileName = nombre; // nombre del archivo Excel
    option.datas = [
      {
        sheetData: data, // Fuente de datos en archivo Excel
        sheetName: nombre, // nombre de la página de hoja en el archivo de Excel
        sheetFilter: columnasNew,
        sheetHeader: columnasNew
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
    <div className={"content-block dx-card responsive-paddings"}>
      <h5 className={"titleCliente"}>Encuestas</h5>
      <div style={{ margin: "auto" }}>
        <div className="dx-fieldset">
          <div className="dx">
            <div className="seles">
              <SelectBox
                className="SelectBoxC mb-4"
                placeholder="Seleccione un Empresa"
                label="Empresa"
                searchEnabled={true}
                dataSource={empresas}
                onValueChanged={(e) =>
                  setFiltrosordenesCompra({
                    ...FiltrosordenesCompra,
                    empresa: e.value,
                  })
                }
                defaultValue={FiltrosordenesCompra.empresa}
                value={FiltrosordenesCompra.empresa}
              />
            </div>
          </div>

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

          {FiltrosordenesCompra.empresa === 'SURVEY' &&
            <div className="dx">
              <div className="" style={{ textAlign: 'center' }}>
                <CheckBox
                  className='mt-3'
                  value={filterToSurvey}
                  onValueChanged={(e) => { setFilterToSurvey(e.value) }}
                  text='solo encuestas con primera pregunta en  "Si"'
                />
              </div>
            </div>
          }
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
  );
}

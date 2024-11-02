import React, { useEffect, useState } from "react";

//Services 
import * as establecimientosService from "../../api/establishment";

//Iconos
import { ExclamationDiamond } from "react-bootstrap-icons";

//Componentes Externos
import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';
import CellRenderIconsGrids from '../../components/Grids/icons-grid/icons-grid';

//Elementos DevExpress
import { Popup, ToolbarItem } from "devextreme-react/popup";
import FileUploader from "devextreme-react/file-uploader";
import { SelectBox } from "devextreme-react/select-box";
import ScrollView from "devextreme-react/scroll-view";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import DataGrid, {
  Pager,
  Column,
  Paging,
  Export,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
} from "devextreme-react/data-grid";

import Form, {
  GroupItem,
  SimpleItem,
  RequiredRule,
} from "devextreme-react/form";

import './establishment.scss'
import moment from 'moment';

import * as XLSX from "xlsx";

export default function Establishment() {
  const [selectedIdEstablishment, setselectedIdEstablishment] = useState();
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [msgPopup, setMsgPopup] = useState("Agregar establecimientos");
  const [establishment, setEstablishment] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const initialState = {
    id:"",
    id_establecimiento: "",
    id_origen: "",
    nombre_establecimiento: "",
    direccion: "",
    descripcion_razon_social: "",
    canal: "",
    subcanal: "",
    ciudad: "",
    region: "",
    zona: "",
    descripcion_agrupador: "",
    estatus: true,
    nombre_cliente: "",
}

  const [establishmentForm, setestablishmentForm] = useState(initialState);
  const validationMsg = "Este campo es requerido";
  const allowedPageSizes = [8, 12, 20];
  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const [clientes, setclientes] = useState([]);
  const [regiones, setregiones] = useState([]);

  useEffect(() => {
    getAllEstablishment();
    const userData = JSON.parse(localStorage.getItem("userData"));
    setclientes(userData.cliente);
    setregiones(userData.region);
  }, []);

  const getAllEstablishment = () => {
    establecimientosService
      .getEstablecimientos()
      .then((establecimiento) => {
        // console.log(establecimiento.data);
        // setEstablishment(establecimiento.data);

        if (establecimiento.status === 200) {
          let NewData = [];
          Array.prototype.forEach.call(establecimiento.data, (items) => {
            if (items.estatus === "Activo" || items.estatus === 'ACTIVO') {
              NewData.push(items);
            }
            setEstablishment(NewData);
          });
        } else {
          // console.log("Error");
        }
      })
      .catch((error) => {
        // console.log(error);

        setToastConfig({
          ...toastConfig,
          type: "error",
          message: error.message,
          isVisible: true,
        });
      });
  };

  const ReadFile = (e) => {
    // Obtener el objeto del archivo cargado
    const files = e.value;
    // Leer el archivo a través del objeto FileReader
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const { result } = event.target;
        // Leer en secuencia binaria para obtener todo el objeto de tabla de Excel
        const workbook = XLSX.read(result, { type: "binary" });
        let data = []; // almacena los datos obtenidos
        // recorre cada hoja de trabajo para leer (aquí solo se lee la primera tabla por defecto)
        for (const sheet in workbook.Sheets) {
          // if (workbook.Sheets.hasOwnProperty(sheet)) {
          // usa el método sheet_to_json para convertir Excel a datos json
          data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          // break; // Si solo se toma la primera tabla, descomenta esta línea
          // }
        }
        // console.log(data);
        let contador = 0;
        data.forEach((element) => {
          establecimientosService
            .createUpdateEstablecimientos(element)
            .then((resp) => {
              contador++;
              // console.log(contador)
              if (contador == data.length) {
                setToastConfig({
                  ...toastConfig,
                  type: "success",
                  message: "Establecimientos cargados con exito!!!!",
                  isVisible: true,
                });
                console.log("ito");
              }
            });
        });
      } catch (e) {
        // console.log("Tipo de archivo incorrecto");
        return;
      }
    };
    // Abre el archivo en modo binario
    fileReader.readAsBinaryString(files[0]);
  };

  const openDeletePopup = (id) => {

    setShowPopupDelete(true);
    setselectedIdEstablishment(id);
  };

  const openPopup = () => {
    // console.log('Open Popup')
    setShowPopup(true);
    setestablishmentForm(initialState);
  };

  const openEditPopup = (data) => {
    const estatus = data.estatus == 'Activo' ? true : false;
    const form = {...data, estatus: estatus};
    setestablishmentForm(form);
    setShowPopup(true);
  }

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const hidePopup = () => {
    setShowPopup(false);
    setestablishmentForm(initialState);
    setMsgPopup("Agregar Establecimiento");
  };


  const saveEstablishment = () => {
    establishmentForm.estatus =
    establishmentForm.estatus === false ? "Inactivo" : "Activo";
    establishmentForm.id_establecimiento = establishmentForm.nombre_cliente + '-' + moment().format('DD/YYYY') + '-' + Math.floor(Math.random() * 9999999);

    // let valores = Object.values(establishmentForm); 
    // let keys = Object.keys(establishmentForm);
    // for(let i=0; i < valores.length; i++){
    //   if (valores[i] === undefined || valores[i] === "" || valores[i] === null) {
    //     // console.log(valores[i])
    //     // console.log(keys[i])
    //     if (keys[i] != "id_establecimiento" && keys[i] != "id_origen" && keys[i] != "nombre_establecimiento" && keys[i] != "region" && keys[i] != "nombre_cliente"){
    //       setToastConfig({
    //         ...toastConfig,
    //         type: "warning",
    //         message: "Debe indicar id del establecimiento, id origen, nombre establecimiento, region, nombre cliente",
    //         isVisible: true,
    //       });
    //       return false
    //     }
    //   }
    // }
    console.log("ESTABLECIMIENTOOO ", establishmentForm);
    establecimientosService.createUpdateEstablecimientos(establishmentForm)
    .then((data) => {
      if (data.data.msg) {
        hidePopup();
        getAllEstablishment();
        setestablishmentForm(initialState)
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Guardado Exitosamente!",
          isVisible: true,
        });
      } else {
        setToastConfig({
          ...toastConfig,
          type: "warning",
          message: "Existe un establecimiento con este id establecimiento",
          isVisible: true,
        });
      }
    })
    .catch((err) => {

      setToastConfig({
        ...toastConfig,
        type: "error",
        message: err.message,
        isVisible: true,
      });
    });
  };
  const saveButtonOptions = {
    icon: "check",
    text: "Guardar",
    onClick: saveEstablishment,
  }

  const deleteEstablishment = () => {

    establecimientosService
      .deleteEstablecimientos(selectedIdEstablishment)
      .then((response) => {
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Establecimiento Eliminado exitosamente!",
          isVisible: true,
        });

        hideDeletePopup();
        getAllEstablishment();
      })

      .catch((err) => {

        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
      });
  };

  const cellRender = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i className="dx-icon-edit" onClick={() => openEditPopup(data.data)}></i>
        <i className="dx-icon-trash" onClick={() => openDeletePopup(data.data.id)}></i>
      </div>
    );
  };

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
    setestablishmentForm(initialState)
  };

  const renderSelectCliente = (data) => {
    return (
      <SelectBox
        dataSource={clientes}
        value={establishmentForm.nombre_cliente}
        isRequired={true}
        onSelectionChanged={(e) => {
          setestablishmentForm({ ...establishmentForm, nombre_cliente: e.selectedItem })
        }}
      />
    );
  };

  const renderSelectRegiones = (data) => {
    return (
      <SelectBox
        dataSource={regiones}
        isRequired={true}
        value={establishmentForm.region}
        onSelectionChanged={(e) => {
          setestablishmentForm({ ...establishmentForm, region: e.selectedItem })
        }}
      />
    );
  };


  return (
    <React.Fragment>
      <h5 className={"titleEstablecimiento mt-5 mb-0 mx-2"}>Establecimientos</h5>

      <div className="containerButtons">
        <div>
          <FileUploader
            name="file"
            onValueChanged={ReadFile}
            accept=".csv, .xlsx"
          ></FileUploader>
        </div>
        <div>
          <Button onClick={openPopup} className="btn-agregar" style={{width: '190px'}}>
           + Crear Establecimiento
          </Button>
        </div>
      </div>

      <DataGrid
        className={"dx-card wide-card"}
        dataSource={establishment}
        showBorders={true}
        remoteOperations={true}
        focusedRowEnabled={true}
        keyExpr="id_establecimiento"
        style={{ height: "400px" }}
        rowAlternationEnabled={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
      > 
      <Export enabled={true} />
      <ColumnChooser
          enabled={true}
          mode="select" 
      />
        <FilterRow visible={true} />
          <Paging defaultPageSize={20} />
          <Pager
            showPageSizeSelector={true}
            showInfo={true}
            allowedPageSizes={allowedPageSizes}
          />
          <HeaderFilter visible={true} />

        <Column
          caption={"ID"}
          dataField={"id_establecimiento"}
          width={120}
          sortOrder={"asc"}
        />
        <Column
          dataField={"nombre_cliente"}
          caption={"Cliente"}
          dataType="string"
        />
        <Column
          dataField={"nombre_establecimiento"}
          caption={"Nombre"}
          dataType="string"
          width={250}
        />
        <Column
          dataField={"descripcion_razon_social"}
          caption={"Razon Social"}
          dataType="string"
        />
        <Column dataField={"ciudad"} caption={"Ciudad"} dataType="string" />
        <Column dataField={"region"} caption={"Región"} dataType="string" />
        <Column 
          dataField={"estatus"} 
          caption={"Estatus"} 
          dataType="string" 
          cellRender={CellRenderEstatus}
        />
        <Column
          width={80}
          caption=""
          allowSorting={false}
          cellRender={(data)=> CellRenderIconsGrids(data, openEditPopup, openDeletePopup)}
          name="renderEstab"
        />
        <Export enabled={true} className={'export_button'}/>
      </DataGrid>

      <Popup
        width={"50%"}
        height={"50%"}
        visible={showPopupDelete}
        onHiding={hideDeletePopup}
        showTitle={true}
        title="Eliminar Cliente"
        showCloseButton={true}
        
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>¿Seguro que desea eliminar este cliente?</h5>
            <p>Esta acción no puede revertirse</p>
            <div className="d-flex text-center col-md-12 button_popup">
              <Button
                onClick={deleteEstablishment}
                className="btn btn-outline-primary"
              >
                Sí, eliminar
              </Button>
              <Button
                onClick={hideDeletePopup}
                className="btn btn-outline-secondary"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </ScrollView>
      </Popup>
      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={onHiding}
        displayTime={toastConfig.displayTime}
      />

      <Popup
        width={"75%"}
        height={"85%"}
        visible={showPopup}
        onHiding={hidePopup}
        showTitle={true}
        title={msgPopup}
        showCloseButton={true}
        
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={saveButtonOptions}
        />
        <ScrollView width="100%" height="100%">
              <div className="form-container">
                <Form formData={establishmentForm} >
                  <GroupItem cssClass="second-group" colCount={2}>
                    <SimpleItem
                      dataField="nombre_cliente"
                      render={renderSelectCliente}
                      isRequired={true}
                    >
                      <RequiredRule message={validationMsg} />
                    </SimpleItem>
                    <SimpleItem isRequired={true} dataField="nombre_establecimiento">
                      <RequiredRule message={validationMsg} />
                    </SimpleItem>
                    <SimpleItem dataField="direccion" />
                    <SimpleItem dataField="descripcion_razon_social" />
                    <SimpleItem dataField="canal" />
                    <SimpleItem dataField="subcanal" />
                    <SimpleItem dataField="ciudad" />
                    <SimpleItem
                      dataField="region"
                      render={renderSelectRegiones}
                      isRequired={true}
                    >
                      <RequiredRule message={validationMsg} />
                    </SimpleItem>
                    <SimpleItem dataField="zona" />
                    <SimpleItem dataField="descripcion_agrupador" />
                    <SimpleItem editorType="dxCheckBox" dataField="estatus" />
                  </GroupItem>
                </Form>
              </div>
        </ScrollView>
      </Popup>
    </React.Fragment>
  );
}

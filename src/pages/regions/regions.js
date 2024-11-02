import React, { useState, useEffect } from "react";
import "./regions.scss";

import * as Regiones from "../../api/Regiones";

import { ExclamationDiamond } from "react-bootstrap-icons";

//Componentes Externos
import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';
import CellRenderIconsGrids from '../../components/Grids/icons-grid/icons-grid';

import { Toast } from "devextreme-react/toast";
import { Button } from "devextreme-react/button";
import ScrollView from "devextreme-react/scroll-view";
import { TextArea } from "devextreme-react/text-area"; // No eliminar, sin esto no funciona el input textarea aunque no se use la variable
import { Popup, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  Export
} from "devextreme-react/data-grid";

import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
} from "devextreme-react/form";

export default function Regions() {
  const [showPopup, setShowPopup] = useState(false);
  const [regiones, setregiones] = useState([]);
  const [RegionestForm, setRegionesForm] = useState([]);
  const [msgPopup, setMsgPopup] = useState("Agregar Cliente");
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [selectedIdRegiones, setselectedIdRegiones] = useState();
  // const [columnsGrid, setColumnsGrid] = useState([]);
  const allowedPageSizes = [8, 12, 20];
  const validationMsg = "Este campo es requerido";

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  useEffect(() => {
    setRegionesForm({
      nombre_region: "",
      cod_region: "",
      estatus: "",
      id: "",
    });
    getAllRegiones();
  }, []);

  const getAllRegiones = () => {
    Regiones.getRegion()
      .then((data) => {
        console.log(data);
        // setRegionesForm(data.data);

        if (data.status === 200) {
          let NewData = [];
          Array.prototype.forEach.call(data.data, (items) => {
            if (items.estatus === "activo") {
              NewData.push(items);
            }
            setregiones(NewData);
          });
          // setregiones(data.data);
          // getColumns(data.data);
        } else {
          console.log("Error");
        }
      })
      .catch((err) => {
        console.log(err);

        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
      });
  };

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const openPopup = () => {
    setShowPopup(true);
    console.log("Abrí popup");
  };

  const hidePopup = () => {
    console.log("Cerré popup");
    setShowPopup(false);
    setRegionesForm({
      nombre_region: "",
      cod_region: "",
    });
    setMsgPopup("Agregar Región");
  };

  const saveRegions = () => {
    console.log(RegionestForm);
    RegionestForm.estatus =
      RegionestForm.estatus === false ? "inactivo" : "activo";
    Regiones.createUpdateRegiones(RegionestForm)
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          setToastConfig({
            ...toastConfig,
            type: "success",
            message: "¡Guardado Exitosamente!",
            isVisible: true,
          });
          hidePopup();
          getAllRegiones();
        } else {
          console.log("Error");
        }
      })
      .catch((err) => {
        console.log(err);

        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
      });
  };
  const editRegion = (Regions) => {
    openPopup();
    console.log("Edit ", Regions);
    // Regions.estatus = Regions.estatus === "activo" ? true : false;
    setRegionesForm(Regions);
    setMsgPopup("Editar Rgiones");
  };

  const openDeletePopup = (id) => {
    setShowPopupDelete(true);
    setselectedIdRegiones(id);
  };

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const deleteRegions = () => {
    console.log("Delete ", selectedIdRegiones);

    Regiones.deleteRegions(selectedIdRegiones)
      .then((response) => {
        console.log(response);
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "Region Eliminada exitosamente",
          isVisible: true,
        });

        getAllRegiones();
      })
      .catch((err) => {
        console.log(err);

        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
      });

    console.log(toastConfig);
    setselectedIdRegiones(null);
    hideDeletePopup();
  };

  const saveButtonOptions = {
    icon: "check",
    text: "Guardar",
    onClick: saveRegions,
  };

  const cellRender = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i className="dx-icon-edit" onClick={() => editRegion(data.data)}></i>
        <i className="dx-icon-trash" onClick={() => openDeletePopup(data.data.id)}></i>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={"d-flex"}>
        <div style={{ width: "80%" }}>
          <h5 className={"content-block titleCliente"}>Regiones</h5>
        </div>
        <div style={{ width: "20%" }}>
          <Button onClick={openPopup} className="btn-agregar mt-3 mb-2">
            + Nuevas regiones
          </Button>
        </div>
      </div>
      {/* <div className={'content-block'}> */}
      <div 
      className="tabla-Cliente"
      // className={"dx-card responsive-paddings"}
      >
        <DataGrid
          // className={"dx-card wide-card"}
          className="tabla-Cliente"
          dataSource={regiones}
          showBorders={true}
          remoteOperations={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          keyExpr="id"
          style={{ height: "400px" }}
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
            allowedPageSizes={allowedPageSizes}
          />
          <HeaderFilter visible={true} />

          <Column
            caption="Cod Región"
            dataField="cod_region"
            dataType="string"
          />
          <Column
            caption="Nombre Región"
            dataField="nombre_region"
            dataType="string"
          />

          <Column    
            caption="Estatus" 
            dataField="estatus" 
            dataType="string" 
            cellRender={CellRenderEstatus}
          />
          <Column
            width={100}
            caption=""
            allowSorting={false}
            cellRender={(data)=> CellRenderIconsGrids(data, editRegion, openDeletePopup)}
          />
        </DataGrid>
      </div>
      {/* </div> */}
      <Popup
        width={"70%"}
        height={"60%"}
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
            <Form formData={RegionestForm}>
              <GroupItem cssClass="second-group" colCount={1}>
                <GroupItem>
                  <SimpleItem dataField="nombre_region">
                    <RequiredRule message={validationMsg} />
                  </SimpleItem>
                  <SimpleItem dataField="cod_region">
                    <RequiredRule message={validationMsg} />
                  </SimpleItem>
                  {/* <SimpleItem dataField="id" none>
                    <RequiredRule message={validationMsg} />
                  </SimpleItem> */}
                  <SimpleItem
                    editorType="dxCheckBox"
                    dataField="estatus"
                  ></SimpleItem>
                </GroupItem>
              </GroupItem>
            </Form>
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
        width={"40%"}
        height={"30%"}
        visible={showPopupDelete}
        onHiding={hideDeletePopup}
        showTitle={true}
        title="Eliminar Región"
        showCloseButton={true}
        
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>¿Seguro que desea eliminar está region?</h5>
            <p>Esta acción no puede revertirse</p>
            <div className="d-flex text-center col-md-12 button_popup">
              <Button
                onClick={deleteRegions}
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
    </React.Fragment>
  );
}

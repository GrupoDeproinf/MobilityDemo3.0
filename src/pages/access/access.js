import React, { useState, useEffect } from "react";
import "./access.scss";

import * as Access from "../../api/Access";

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

export default function Acces() {
  const [showPopup, setShowPopup] = useState(false);
  const [access, setaccess] = useState([]);
  const [AccessForm, setAccessForm] = useState([]);
  const [msgPopup, setMsgPopup] = useState("Agregar Aceso");
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [selectedIdAccess, setselectedIdAccess] = useState();
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
    setAccessForm({
      icon: "",
      text: "",
      path: "",
      sort: "",
      estatus: "",
      id: "",
    });
    getAllAcces();
  }, []);

  const getAllAcces = () => {
    Access.getAcces()
      .then((data) => {
        console.log(data);
        // setAccessForm(data.data);

        if (data.status === 200) {
          let NewData = [];
          Array.prototype.forEach.call(data.data, (items) => {
            if (items.estatus === "activo") {
              NewData.push(items);
            }
            setaccess(NewData);
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
    setAccessForm({
      icon: "",
      text: "",
      path: "",
      sort: "",
      
    });
    setMsgPopup("Agregar Acceso");
  };

  const saveAcces = () => {
    console.log(AccessForm);
    AccessForm.estatus =
      AccessForm.estatus === false ? "inactivo" : "activo";
      Access.createUpdateAcces(AccessForm)
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
          getAllAcces();
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
  const editAccess = (Acces) => {
    openPopup();
    console.log("Edit ", Acces);
    // Acces.estatus = Acces.estatus === "activo" ? true : false;
    setAccessForm(Acces);
    setMsgPopup("Editar Accesos");
  };

  const openDeletePopup = (id) => {
    setShowPopupDelete(true);
    setselectedIdAccess(id);
  };

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const deleteAcces = () => {
    console.log("Delete ", selectedIdAccess);

    Access.deleteAcces(selectedIdAccess)
      .then((response) => {
        console.log(response);
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "Acceso Eliminado exitosamente",
          isVisible: true,
        });

        getAllAcces();
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
    setselectedIdAccess(null);
    hideDeletePopup();
  };

  const saveButtonOptions = {
    icon: "check",
    text: "Guardar",
    onClick: saveAcces,
  };

  const cellRender = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i className="dx-icon-edit" onClick={() => editAccess(data.data)}></i>
        <i className="dx-icon-trash" onClick={() => openDeletePopup(data.data.id)}></i>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={"d-flex"}>
        <div style={{ width: "80%" }}>
          <h5 className={"content-block titleCliente"}>Accesos</h5>
        </div>
        <div style={{ width: "20%" }}>
          <Button onClick={openPopup} className="btn-agregar mt-3 mb-2">
            + Nuevo Acceso
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
          dataSource={access}
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
            caption="Nombre"
            dataField="text"
            dataType="string"
          />
          <Column
            caption="Path"
            dataField="path"
            dataType="string"
          />
          <Column
            caption="Icono"
            dataField="icon"
            dataType="string"
          />
          <Column
            caption="Posicion"
            dataField="sort"
            dataType="number"
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
            cellRender={(data)=> CellRenderIconsGrids(data, editAccess, openDeletePopup)}
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
            <Form formData={AccessForm}>
              <GroupItem cssClass="second-group" colCount={2}>
                <GroupItem>
                  <SimpleItem dataField="sort">
                    <RequiredRule message={validationMsg} />
                  </SimpleItem>
                  
                  <SimpleItem dataField="text">
                    <RequiredRule message={validationMsg} />
                  </SimpleItem>
                  <SimpleItem dataField="path">
                    <RequiredRule message={validationMsg} />
                  </SimpleItem>
                  <SimpleItem dataField="icon">
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
                onClick={deleteAcces}
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

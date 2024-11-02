import React, { useState, useEffect } from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import ScrollView from "devextreme-react/scroll-view";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  Export,
} from "devextreme-react/data-grid";

import * as ListUser from "../../api/ListUser";
import * as ReportsService from "../../api/reports";
import * as DinamicQueries from "../../api/DinamicsQuery";
import "./User.scss";

function Dotaciones() {
  const [showPopup, setShowPopup] = useState(false);
  const [User, setUser] = useState([]);
  const [msgPopup, setMsgPopup] = useState("Agregar Usuario");
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [selectedIdUser, setSelectedIdUser] = useState();
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    type: "success",
    message: "Guardado Exitosamente",
    displayTime: 2000,
  });

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = () => {
    ListUser.GetUser()
      .then((data) => {
        if (data.status === 200) {
          const dataUsers = data.data.map((e, index) => ({
            key: index + 1,
            cliente: Array.isArray(e.cliente) ? e.cliente[0] : e.cliente,
            cedula: e.cedula,
            nombre: e.nombre,
            apellido: e.apellido,
            region: e.region,
            talla_camisa: e.dotacion?.talla_camisa,
            talla_zapato: e.dotacion?.talla_zapato,
            ultima_dotacion: e.dotacion?.ultima_dotacion,
          }));
          setUser(dataUsers);
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

  const deleteUser = () => {
    ListUser.deleteUser(selectedIdUser)
      .then((response) => {
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "Usuario Eliminado exitosamente",
          isVisible: true,
        });
        hideDeletePopup();
        getAllUser();
      })
      .catch((err) => {
        getAllUser();
        hideDeletePopup();
      });
  };

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const openDeletePopup = (uid) => {
    setShowPopupDelete(true);
    setSelectedIdUser(uid);
  };

  return (
    <React.Fragment>
      <div className="d-flex mt-2">
        <div className="header-grid-title">
          <h5 className="content-block titleCliente">Dotaciones</h5>
        </div>
      </div>
      <div className="tabla-Cliente">
        <DataGrid
          className="tabla-Cliente"
          dataSource={User}
          showBorders={true}
          remoteOperations={true}
          focusedRowEnabled={false}
          style={{ height: "430px", width: "100%" }}
          keyExpr="key"
          wordWrapEnabled={true}
        >
          <Export enabled={true} />
          <ColumnChooser enabled={true} mode="select" />
          <FilterRow visible={true} />
          <Paging defaultPageSize={12} />
          <Pager showPageSizeSelector={true} allowedPageSizes={[8, 12, 20]} />
          <HeaderFilter visible={true} />

          <Column
            width={100}
            caption="Cédula"
            dataField="cedula"
            dataType="string"
            sortOrder="asc"
          />
          <Column
            width={120}
            caption="Nombre"
            dataField="nombre"
            dataType="string"
          />
          <Column
            width={120}
            caption="Apellido"
            dataField="apellido"
            dataType="string"
          />
          <Column
            width={200}
            caption="Cliente"
            dataField="cliente"
            dataType="string"
          />
          <Column
            width={140}
            caption="Region"
            dataField="region"
            dataType="string"
          />
          <Column
            width={90}
            caption="Talla de Zapatos"
            dataField="talla_zapato"
            dataType="string"
          />
          <Column
            width={140}
            caption="Talla de Camisa"
            dataField="talla_camisa"
            dataType="string"
          />
          <Column
            width={140}
            caption="Ultima dotacion"
            dataField="ultima_dotacion"
            dataType="string"
          />
        </DataGrid>
      </div>

      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={onHiding}
        displayTime={toastConfig.displayTime}
      />
      <Popup
        width={"50%"}
        height={"50%"}
        visible={showPopupDelete}
        onHiding={hideDeletePopup}
        showTitle={true}
        title="Eliminar Usuario"
        showCloseButton={true}
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <div>
              <h5>¿Seguro que desea eliminar este usuario?</h5>
              <p>Esta acción no puede revertirse</p>
            </div>
            <div className="d-flex text-center col-md-12 button_popup">
              <Button onClick={deleteUser} className="btn btn-outline-primary">
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

export default Dotaciones;

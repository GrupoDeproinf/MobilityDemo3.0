import React, { useEffect, useState } from 'react';

//Elementos DevExpress
import { Toast } from "devextreme-react/toast";
import { Button } from "devextreme-react/button";
import { ArrowRight } from "react-bootstrap-icons";
import ScrollView from "devextreme-react/scroll-view";
import { ExclamationDiamond } from "react-bootstrap-icons";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  HeaderFilter,
  Scrolling,
  LoadPanel,
  Selection,
  ColumnChooser,
} from "devextreme-react/data-grid";

//Componentes Externos
import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';

//Firebase
import { fire } from '../../api/firebaseEnv';

//CSS
import './AssigmentClients.scss';

export default function AssigmentClients() {
  const [Clientes, setClientes] = useState([]);
  const [ClientSelected, setClientSelected] = useState([]);
  const [Establecimientos, setEstablecimientos] = useState([]);
  const [SelectedIdEstablecimiento, setSelectedIdEstablecimiento] = useState('');
  const [Asignacion, setAsignacion] = useState({
    establecimientos: [],
    establecimientosFinal: [],
  });
  const [idsEstablecimientoToAssing, setidsEstablecimientoToAssing] = useState([]);
  const [msgPopup, setMsgPopup] = useState("Asignar Establecimiento");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const allowedPageSizes = [10, 20, 30];

  const getAllClients = () => {
    let Clientes = [];
    fire.collection('Clientes').get().then((dataClientes) => {
      dataClientes.forEach((cadaCliente) => {
        const TempCliente = cadaCliente.data();
        TempCliente.key = cadaCliente.id;
        Clientes = [...Clientes, TempCliente]
        setClientes(Clientes);
      })
    }).catch((error) => {
      setToastConfig({
        ...toastConfig,
        type: "error",
        message: error.message,
        isVisible: true,
      });
    })
  };

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const hidePopup = () => {
    setShowPopup(false);
    setAsignacion({
      establecimientos: [],
      establecimientosFinal: [],
    });
    setEstablecimientos([]);
    setMsgPopup("Asignar Establecimiento");
  };

  const openDeletePopup = (uid) => {
    setShowPopupDelete(true);
    setSelectedIdEstablecimiento(uid);
  };

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const cellRender = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i
          className="dx-icon-import"
          onClick={() => { AsignarData(data.data) }}
          title="Administrar establecimientos"
        ></i>
      </div>
    );
  };

  const cellRenderAsignar = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i
          className="dx-icon-trash"
          onClick={() => openDeletePopup(data.data.key)}
        ></i>
      </div>
    );
  };

  const AsignarData = (client) => {
    setClientSelected(client.key);

    let Establecimientos = [];
    fire.collection('establecimientos').get().then((dataEstablecimientos) => {
      fire.collection('Clientes').doc(client.key).get().then((ClienteData) => {
        const DataCliente = ClienteData.data();
        DataCliente.key = ClienteData.id;

        dataEstablecimientos.forEach((cadaEstablecimiento) => {
          const TempEstablecimiento = cadaEstablecimiento.data();
          TempEstablecimiento.key = cadaEstablecimiento.id;
          Establecimientos = [...Establecimientos, TempEstablecimiento]
          setEstablecimientos(Establecimientos);
        })

        let EstUsuario = [];
        DataCliente.establecimientos.forEach((EstablecimientosUsuario) => {
          EstUsuario.push(EstablecimientosUsuario);
        });
        setAsignacion({
          ...Asignacion,
          establecimientos: EstUsuario,
          establecimientosFinal: EstUsuario,
        });
      })
    }).catch((error) => {
      setToastConfig({
        ...toastConfig,
        type: "error",
        message: error.message,
        isVisible: true,
      });
    })

    setShowPopup(true);
  };

  const deleteEstablecimientos = () => {
    const dataUsuarioNuevo = [...Asignacion.establecimientosFinal];


    let establecimientosFinal = dataUsuarioNuevo.filter(
      (x) => x.key != SelectedIdEstablecimiento
    );

    fire.collection('Clientes').doc(ClientSelected).update({ establecimientos: establecimientosFinal }).then(() => {
      setAsignacion({
        establecimientos: [],
        establecimientosFinal: [],
      });
      AsignarData({ key: ClientSelected });
      hideDeletePopup();
      getAllClients();
      setToastConfig({
        ...toastConfig,
        type: "success",
        message: "¡Guardado Exitosamente!",
        isVisible: true,
      });
    }).catch((error) => {
      setToastConfig({
        ...toastConfig,
        type: "error",
        message: error.message,
        isVisible: true,
      });
      setAsignacion({
        establecimientos: [],
        establecimientosFinal: [],
      });
      hidePopup();
      hideDeletePopup();
    })
  };

  const handleOptionChange = (e) => {
    if (e.fullName === "selectedRowKeys") {
      setidsEstablecimientoToAssing(e.value);
    }
  };

  function saveEstablishment() {
    const dataEstablecimientos = [...Asignacion.establecimientosFinal];
    Establecimientos.forEach((usuarioData) => {
      idsEstablecimientoToAssing.forEach((eachID) => {
        if (usuarioData.key === eachID) {
          dataEstablecimientos.push(usuarioData);
        }
      });
    });

    let arrayEstablecimiento = [];
    dataEstablecimientos.forEach((eachEstab) => {
      if (arrayEstablecimiento.length > 0) {
        let existe = false;
        arrayEstablecimiento.forEach((x) => {
          if (x.key === eachEstab.key) {
            existe = true;
          }
        });
        if (!existe) {
          arrayEstablecimiento.push({
            ID: eachEstab.ID,
            codigo_region: eachEstab.codigo_region,
            key: eachEstab.key,
            nombre_establecimiento: eachEstab.nombre_establecimiento,
            nombre_region: eachEstab.nombre_region,
            uid_region: eachEstab.uid_region,
            coordenadas: eachEstab.coordenadas
          });
        }
      } else {
        arrayEstablecimiento.push({
          ID: eachEstab.ID,
          codigo_region: eachEstab.codigo_region,
          key: eachEstab.key,
          nombre_establecimiento: eachEstab.nombre_establecimiento,
          nombre_region: eachEstab.nombre_region,
          uid_region: eachEstab.uid_region,
          coordenadas: eachEstab.coordenadas
        });
      }
    });

    fire.collection('Clientes').doc(ClientSelected)
      .update({ establecimientos: arrayEstablecimiento }).then(() => {
        setAsignacion({
          establecimientos: [],
          establecimientosFinal: [],
        });
        AsignarData({ key: ClientSelected });
        getAllClients();
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Guardado Exitosamente!",
          isVisible: true,
        });
      }).catch((error) => {
        setToastConfig({
          ...toastConfig,
          type: "error",
          message: error.message,
          isVisible: true,
        });
        setAsignacion({
          establecimientos: [],
          establecimientosFinal: [],
        });
        hidePopup();
      });
  };

  useEffect(() => {
    getAllClients();
  }, [])

  return (
    <React.Fragment>
      <div className="d-flex mt-4 mb-4">
        <div className="header-grid-title">
          <h5 className="content-block titleCliente">
            Asignación de establecimientos clientes
          </h5>
        </div>
      </div>

      <div className="tabla-Cliente">
        <DataGrid
          className="tabla-Cliente"
          dataSource={Clientes}
          showBorders={true}
          remoteOperations={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          style={{ height: "550px" }}
          keyExpr="key"
        >
          <ColumnChooser enabled={true} mode="select" />
          <FilterRow visible={true} />
          <Paging defaultPageSize={10} />
          <Pager
            showPageSizeSelector={true}
            DallowedPageSizes={allowedPageSizes}
          />
          <HeaderFilter visible={true} />
          <Column
            caption="Nombre"
            dataField="nombre_cliente"
            dataType="string"
          />
          <Column
            caption="RIF"
            dataField="rif"
            dataType="string"
          />

          <Column
            caption="Descripción"
            dataField="descripcion"
            dataType="string"
          />

          <Column
            caption="Estatus"
            dataField="estatus"
            dataType="string"
            cellRender={CellRenderEstatus}
          />

          <Column
            caption=""
            allowSorting={false}
            cellRender={cellRender}
          />
        </DataGrid>
      </div>

      <Popup
        visible={showPopup}
        onHiding={hidePopup}
        showTitle={true}
        title={msgPopup}
        showCloseButton={true}
        
        fullScreen={true}
      >
        {/* <h6>Asigar establecimiento</h6> */}
        <ScrollView width={"100%"} height={"100%"}>
          <div className="row mx-5" style={{display: "flex", justifyContent: "space-between", alignItems:"center"}}>
            <div className="col-md-5 mt-2">
            <div className={'dx-card'} style={{padding:"20px",borderRadius:"15px"}}>
            <h6 className="title">Establecimientos</h6>
              <DataGrid
                className="tabla-user"
                dataSource={Establecimientos}
                showBorders={true}
                remoteOperations={true}
                defaultFocusedRowIndex={0}
                style={{ height: "75vh", width: "100%" }}
                keyExpr="key"
                onOptionChanged={(e) => handleOptionChange(e)}
                wordWrapEnabled={true}
                paginate={false}
                paging={false}
                columnAutoWidth={true}
              >

                <FilterRow visible={true} />
                <Selection mode="multiple" />
                <LoadPanel enabled />
                <Scrolling
                  useNative={false}
                  scrollByContent={true}
                  scrollByThumb={true}
                  showScrollbar="onHover"
                />

                <HeaderFilter visible={true} />

                <Column
                  caption={"ID"}
                  dataField={"ID"}
                  width={50}
                />
                <Column
                  dataField={"nombre_establecimiento"}
                  caption={"Nombre Establecimiento"}
                  dataType="string"
                  width={300}
                />

              </DataGrid>
              
            </div>
             
            </div>

            <div
              className="col-md-1 mt-6 mx-3"
              style={{ display: "grid", alignContent: "center", justifyContent: "center" }}
            >
              <Button
                className="btn btn-light mt-4"
                onClick={() => saveEstablishment()}
                style={{width: "10vw"}}
              >
                Asignar <ArrowRight style={{ marginLeft: "5px" }} />
              </Button>
            </div>

            <div className="col-md-5 mt-2">
            <div className={'dx-card'} style={{padding:"20px",borderRadius:"15px"}}>
              <h6 className="title">Establecimientos asignados</h6>
              <DataGrid
                className="tabla-user"
                dataSource={Asignacion.establecimientosFinal}
                showBorders={true}
                remoteOperations={true}
                defaultFocusedRowIndex={0}
                style={{ height: "75vh", width: "100%" }}
                keyExpr="key"
                wordWrapEnabled={true}
                paginate={false}
                paging={false}
                columnAutoWidth={true}
              >
                <FilterRow visible={true} />
                <LoadPanel enabled />
                <Scrolling
                  useNative={false}
                  scrollByContent={true}
                  scrollByThumb={true}
                  showScrollbar="onHover"
                />

                <HeaderFilter visible={true} />

                <Column
                  caption="ID"
                  dataField="ID"
                  dataType="string"
                  width={50}

                />
                <Column
                  caption="Nombre"
                  dataField="nombre_establecimiento"
                  dataType="string"
                  width={250}
                />

                <Column
                  caption=""
                  allowSorting={false}
                  cellRender={cellRenderAsignar}
                />
              </DataGrid>
              </div>
            </div>
          </div>
        </ScrollView>
      </Popup>

      <Popup
        width={"auto"}
        height={"auto"}
        visible={showPopupDelete}
        onHiding={hideDeletePopup}
        showTitle={true}
        title="Eliminar Asignacion"
        showCloseButton={true}
        
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>¿Seguro que desea eliminar esta asignación?</h5>
            <p>Esta acción no puede revertirse</p>
            <div className="d-flex text-center col-md-12 button_popup">
              <Button
                onClick={deleteEstablecimientos}
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
    </React.Fragment>
  )
}

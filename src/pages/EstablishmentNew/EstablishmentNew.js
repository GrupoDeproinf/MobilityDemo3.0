import React, { useEffect, useState } from "react";
import { fire } from "../../api/firebaseEnv";
import * as DinamicQueries from "../../api/DinamicsQuery";
import { ExclamationDiamond } from "react-bootstrap-icons";
import {
    GoogleMap,
    Marker,
    InfoWindow,
  } from "@react-google-maps/api";

//Elementos DevExpress
import DataGrid, {
  Pager,
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  Export,
  Toolbar,
  Item,
  Selection,
} from "devextreme-react/data-grid";
import { Toast } from "devextreme-react/toast";
import { Button } from "devextreme-react/button";
import { CheckBox } from "devextreme-react/check-box";
import ScrollView from "devextreme-react/scroll-view";
import { Popup } from "devextreme-react/popup";

//Componentes Externos
import CellRenderIconsGrids from "../../components/Grids/icons-grid/icons-grid";
import CellRenderEstatus from "../../components/Grids/estatus-grid-establecimientos/estatus-grid";
import CellRenderMapa from "../../components/Grids/mapa-grid/mapa-grid";
import NewEstablishment from "../../components/popup-create-establishment/newEstablishment";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

//CSS
// import './EstablishmentNew.scss';

const EstablishmentNew = () => {
  const [establishmentData, setEstablishmentData] = useState([]);
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [idToEdit, setIdToEdit] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [usersWithEstablishment, setUsersWithEstablishment] = useState("");
  const [dataCoordenadas, setdataCoordenadas] = useState("");
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [ShowPopupEstablecimientos, setShowPopupEstablecimientos] =
    useState(false);
  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "error",
      message:
        "Ya se encuentra un establecimiento registrado con esta dirección",
      displayTime: 4000,
    },
    []
  );

  const [idsEstablecimientos, setidsEstablecimientos] = useState([]);
  const [center, setCenter] = useState({ lat: 10.47915, lng: -66.90618 });
  const [map, setMap] = useState(null);
  const [PositionCentral, setPositionCentral] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(false);

  const allowedPageSizes = [30, 50, 100];
  const checkedLabel = { "aria-label": "Checked" };

  const getAllEstablishment = () => {
    setLoadingAPI(true);

    DinamicQueries.getData("getAllEstablishment", "EstablecimientosNuevos/")
      .then((resp) => {
        setEstablishmentData(resp.data);
        setLoadingAPI(false);
      })
      .catch((e) => {
        setLoadingAPI(false);
      });
  };

  const openPopup = () => {
    setIdToEdit("0");
    setShowPopup(true);
  };

  const openEditPopup = (data) => {
    setIdToEdit(data.key);
    setShowPopup(true);
  };

  const hidePopup = () => {
    setShowPopup(false);
  };

  const successSave = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: true,
      type: "success",
      message: "Establecimiento guardado exitosamente",
    });
    getAllEstablishment();
  };

  const ChangeRevision = (value, info) => {
    fire
      .collection("establecimientos")
      .doc(info.key)
      .update({ revisado: value })
      .then(() => {
        DinamicQueries.getDataWithParameters(
          "updateRevision",
          "EstablecimientosNuevos/",
          { uid: info.key }
        )
          .then(() => {
            setToastConfig({
              ...toastConfig,
              isVisible: true,
              type: "success",
              message: "Establecimiento actualizado exitosamente",
            });
            getAllEstablishment();
          })
          .catch((e) => {
            console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ e:", e);
          });
      })
      .catch((error) => {
        console.log("🚀 ~ fire.collection ~ error:", error);
      });
  };

  const CellRenderVerifica = (data) => {
    return (
      <CheckBox
        defaultValue={data?.data?.revisado}
        elementAttr={checkedLabel}
        onValueChanged={(e) => ChangeRevision(e.value, data.data)}
      />
    );
  };

  const deleteData = (id) => {
    DinamicQueries.getDataWithParameters(
      "getAssignedEstablishment",
      "EstablecimientosNuevos/",
      { id: id }
    )
      .then((resp) => {
        setUsersWithEstablishment(resp.data.data.length);
        setShowPopupDelete(true);
        setIdToDelete(id);
      })
      .catch((error) => {
        console.log(
          "🚀 ~ DinamicQueries.getDataWithParameters ~ error:",
          error
        );
      });
  };

  const deleteFunction = () => {
    DinamicQueries.getDataWithParameters(
      "deleteEstablishment",
      "EstablecimientosNuevos/",
      { id: idToDelete.key }
    )
      .then((resp) => {
        console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ resp:", resp);
        if (resp.data.msg === "establecimiento eliminado") {
          setShowPopupDelete(false);
          getAllEstablishment();
          setToastConfig({
            ...toastConfig,
            isVisible: true,
            type: "success",
            message: "Eliminado exitosamente!",
          });
        }
      })
      .catch((error) => {
        console.log(
          "🚀 ~ DinamicQueries.getDataWithParameters ~ error:",
          error
        );
      });
  };

  useEffect(() => {
    getAllEstablishment();
  }, []);

  const getSelected = () => {
    console.log("Aqui");
    console.log(idsEstablecimientos);
    console.log(establishmentData);
    const datafinal = buscarPorCampo(
      establishmentData,
      "key",
      idsEstablecimientos
    ).filter((x) => x?.coordenadas != undefined && x?.coordenadas != "");
    console.log(datafinal);
    if (datafinal != undefined && datafinal != "" && datafinal?.length != 0){
        const infoNew = datafinal.map(x=>{
            console.log(x)
            // const latlng = x.coordenadas.split(",");
            x.lat = Number(x.coordenadas.lat);
            x.lng = Number(x.coordenadas.lng);
            return x
        })
        console.log(infoNew)
        setdataCoordenadas(infoNew)
    } else {
        setdataCoordenadas([])
    }
    
    navigator.geolocation.getCurrentPosition(function (position) {
    console.log("Latitude is :", position.coords.latitude);
    console.log("Longitude is :", position.coords.longitude);

    setPositionCentral([position.coords.latitude, position.coords.longitude]);
    setShowPopupEstablecimientos(true)
    });

  };

  const handleOptionChange = (e) => {
    if (e.fullName === "selectedRowKeys") {
      setidsEstablecimientos(e.value);
    }
  };

  const buscarPorCampo = (array, key, searchArray) => {
    // Filtra el array buscando objetos que tengan el campo 'key' con un valor que esté en 'searchArray'
    return array.filter((obj) => searchArray.includes(obj[key]));
  };

  const handleLoadMap = (map) => {
    setMap(map);
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="my-4"
      >
        <h6 className={"titleEstablecimiento "}>Establecimientos (Nuevos)</h6>
        <div className="d-flex justify-content-end">
          <Button
            className="btn-agregar"
            onClick={openPopup}
            disabled={loadingAPI}
            style={{ width: "270px" }}
          >
            + Crear Establecimiento
          </Button>
        </div>
      </div>

      <DataGrid
        className={"dx-card wide-card"}
        dataSource={establishmentData}
        showBorders={true}
        remoteOperations={true}
        focusedRowEnabled={false}
        keyExpr="key"
        style={{ height: "70vh" }}
        rowAlternationEnabled={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        onOptionChanged={(e) => handleOptionChange(e)}
      >
        <ColumnChooser enabled={true} mode="select" />
        <Selection mode="multiple" />
        <FilterRow visible={true} />
        <Paging defaultPageSize={30} />
        <Export enabled={true} />
        <Pager
          showPageSizeSelector={true}
          showInfo={true}
          allowedPageSizes={allowedPageSizes}
        />
        <HeaderFilter visible={true} />
        <Toolbar>
          <Item location="after">
            <Button icon="refresh" onClick={getAllEstablishment} />
            <Button icon="fas fa-map-marker-alt" onClick={getSelected} style={{ color: 'green' }} />

            {/* <FontAwesomeIcon
                            icon={faCrosshairs}
                            className="icon"
                            style={{ color: "green" }}
                            onClick={() => {
                                console.log("Aqui")
                            }}
                        ></FontAwesomeIcon> */}
          </Item>
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
        </Toolbar>

        <Column caption={"ID"} dataField={"ID"} width={140} sortOrder={"asc"} />
        <Column
          dataField={"nombre_establecimiento"}
          caption={"Nombre"}
          dataType="string"
          width={250}
        />

        <Column
          dataField={"razon_social"}
          caption={"Razon Social"}
          dataType="string"
        />

        <Column
          dataField={"nombre_ciudad"}
          caption={"Ciudad"}
          dataType="string"
        />
        <Column
          dataField={"nombre_region"}
          caption={"Región"}
          dataType="string"
        />

        <Column
          dataField={"estatus"}
          caption={"Estatus"}
          dataType="string"
          cellRender={CellRenderEstatus}
        />

        <Column
          dataField={"revisado"}
          caption={"Verificado"}
          dataType="string"
          cellRender={(data) => CellRenderVerifica(data)}
        />

        <Column
          dataField={"coordenadas"}
          caption={"Ver Mapa"}
          dataType="string"
          cellRender={(data) => CellRenderMapa(data)}
        />

        <Column
          width={80}
          caption=""
          allowSorting={false}
          cellRender={(data) =>
            CellRenderIconsGrids(data, openEditPopup, deleteData, loadingAPI)
          }
          name="renderEstab"
        />
      </DataGrid>

      <NewEstablishment
        showpopup={showPopup}
        hidepopup={hidePopup}
        idtoedit={idToEdit}
        successsave={successSave}
      />

      <Popup
        width={"50%"}
        height={"50%"}
        visible={showPopupDelete}
        onHiding={() => setShowPopupDelete(false)}
        showTitle={true}
        title="Eliminar Establecimiento"
        showCloseButton={true}
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>¿Seguro que desea eliminar este registro?</h5>
            <p>
              hay <b>{usersWithEstablishment} Usuarios</b> con este
              establecimiento asignado
            </p>
            <p>Esta acción no puede revertirse</p>
            <div className="d-flex text-center col-md-12 button_popup">
              <Button
                onClick={() => deleteFunction()}
                className="btn btn-outline-primary"
              >
                Sí, eliminar
              </Button>
              <Button
                onClick={() => setShowPopupDelete(false)}
                className="btn btn-outline-secondary"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </ScrollView>
      </Popup>

      <Popup
        width={"50%"}
        height={"50%"}
        visible={ShowPopupEstablecimientos}
        onHiding={() => setShowPopupEstablecimientos(false)}
        showTitle={true}
        title="Establecimientos"
        showCloseButton={true}
        fullScreen={true}
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            {PositionCentral.length > 0 ? (
              <GoogleMap
                center={center}
                zoom={7}
                onLoad={handleLoadMap}
                mapContainerStyle={{ height: "90vh", width: "100%" }}
                // onClick={handleMapClick}
              >
                {dataCoordenadas.length > 0
                  ? dataCoordenadas.map((element, index) => {
                      return (
                        <Marker
                          position={{ lat: element.lat, lng: element.lng }}
                          key={index}
                          onClick={() => setSelectedIndex(index)}
                        >
                          {selectedIndex === index && (
                            <InfoWindow
                              onCloseClick={() => setSelectedIndex(null)}
                            >
                              {/* Contenido del infoWindow */}
                              <div>
                                <p>
                                  <strong>Establecimiento: {element.nombre_establecimiento}</strong>
                                </p>
                                {/* <p>
                                  Formularios cargados:{" "}
                                  {element.nombreFormulario}
                                </p>
                                <p>
                                  Establecimiento: {element.establecimiento}
                                </p>
                                <p> Fecha: {element.fecha_Formulario}</p> */}
                              </div>
                            </InfoWindow>
                          )}
                          {/* <Popup> 
            
            </Popup> */}
                        </Marker>
                      );
                    })
                  : null}
              </GoogleMap>
            ) : null}
          </div>
        </ScrollView>
      </Popup>

      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={() => setToastConfig({ ...toastConfig, isVisible: false })}
        displayTime={toastConfig.displayTime}
      />
    </React.Fragment>
  );
};

export default EstablishmentNew;

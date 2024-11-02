import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
// import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
// import { createControlComponent } from "@react-leaflet/core";
import * as DinamicQueries from "../../api/DinamicsQuery";
import { SelectBox } from "devextreme-react/select-box";
import { DateBox } from "devextreme-react/date-box";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import Moment from "moment";
// import RoutingMachine from "./RoutingMachine"
// import L from "leaflet";
import mapStyles from "./mapStyles";

export default function Gallery() {
  const [Clientes, setClientes] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  // const [resgistros, setRegistros] = useState([]);
  const now = new Date();
  const [Usuarios, setUsuarios] = useState([]);
  const [Coordenadas, setCoordenadas] = useState([]);
  const [CoordenadasData, setCoordenadasData] = useState([]);
  const [PositionCentral, setPositionCentral] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [center, setCenter] = useState({ lat: 10.47915, lng: -66.90618 });
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(false);
  
  

  const searchBoxRef = useRef(null);

  const initialState = {
    cliente: "",
    region: "",
    usuario: "Todos los usuarios",
    fecha: new Date(new Date().setDate(new Date().getDate())),
  };
  const [dataFields, setdataFields] = useState(initialState);

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Busqueda Exitosa",
      displayTime: 2000,
    },
    []
  );

  // create a ref
  const rMachine = useRef();
  // create some state variable, any state variable, to track changes
  const [points, setPoints] = useState(true);
  const pointsToUse = points;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setClientes(user.cliente);
    setRegiones(user.region);
    console.log("aqui");
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);

      setPositionCentral([position.coords.latitude, position.coords.longitude]);
    });

    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []); //pointsToUse, rMachine

  // ++++++++++++++++++++++++++++++++

  const searchCoordenadas = () => {
    let fecha = Moment(dataFields.fecha).format("YYYY-MM-DD");

    const searchCoo = {
      cliente: dataFields.cliente,
      region: dataFields.region,
      usuario: dataFields.usuario,
      fecha: fecha,
    };

    console.log(searchCoo);

    // console.log(filters)
    DinamicQueries.getDataWithParameters(
      "getCoordenadasWithDay",
      "coordenadas/",
      searchCoo
    ).then((resp) => {
      console.log(resp.data);
      if (resp.data.msg) {
        //aqui va la data

        let dataCoordenadas = [];
        let CoordenadasTemporal = [];
        resp.data.data.forEach(function (elemento, indice, array) {
          console.log(elemento, indice);

          if (elemento.coordenadas != undefined && elemento.coordenadas != "") {
            const latlng = elemento.coordenadas.split(",");
            elemento.lat = Number(latlng[0]);
            elemento.lng = Number(latlng[1]);
            dataCoordenadas.push(elemento);
            CoordenadasTemporal.push({
              lat: Number(latlng[0]),
              lng: Number(latlng[1]),
            });
          }
        });
        setCoordenadasData(dataCoordenadas);
        console.log(
          "🚀 ~ file: gps.js ~ line 96 ~ .then ~ dataCoordenadas",
          dataCoordenadas
        );
        setCoordenadas(CoordenadasTemporal);
        // console.log("🚀 ~ file: gps.js ~ line 98 ~ .then ~ Coordenadas", CoordenadasTemporal)
        setPositionCentral([
          CoordenadasTemporal[0].lat,
          CoordenadasTemporal[0].lng,
        ]);
        setPoints(!points);
      } else {
        setToastConfig({
          ...toastConfig,
          type: "warning",
          message:
            "El usuario seleccionado no cuenta con coordenadas en el dia dado",
          isVisible: true,
        });
      }
    });
  };

  const clearFilters = () => {
    setdataFields(initialState);
  };

  const searchCliente = (e) => {
    if (e.value != "") {
      setdataFields({ ...dataFields, cliente: e.value });

      // const user = JSON.parse(localStorage.getItem("userData"));

      DinamicQueries.getDataWithParameters(
        "getUserClientAndRegion",
        "usuarios/",
        { cliente: e.value, region: dataFields.region }
      ).then((dataUserConnected) => {
        console.log(dataUserConnected);
        let dataUsuarioFinal = [];

        dataUsuarioFinal = dataUserConnected?.data
          .map((x) => {
            x.establecimientos = [];
            x.cliente = [];
            dataUsuarioFinal.push(x);
            return x;
          })
          .filter(
            (x) =>
              x.activado == "Activo" ||
              x.activado == true ||
              x.activado == "activo"
          );

        console.log(dataUsuarioFinal);
        const allUser = {
          nombre: "Todos los usuarios",
          uid: "Todos los usuarios",
        };
        dataUsuarioFinal.unshift(allUser);
        setUsuarios(dataUsuarioFinal);
      });

      // DinamicQueries.getDataWithParameters('getaUser', "usuarios/", { uid: user.uid })
      //     .then(dataUserConnected => {
      //         let dataUsuarioFinal = []
      //         dataUserConnected.data[0].asignados.forEach(cadaUsuarioAsignado => {
      //             if (cadaUsuarioAsignado.cliente.includes(e.value) == true && cadaUsuarioAsignado.region.includes(dataFields.region) == true) {
      //                 dataUsuarioFinal.push(cadaUsuarioAsignado)
      //             }
      //         })
      //         console.log(dataUsuarioFinal)
      //         const allUser = { nombre: "Todos los usuarios", uid: "Todos los usuarios" }
      //         dataUsuarioFinal.unshift(allUser)
      //         setUsuarios(dataUsuarioFinal)

      //     })
    }
  };

  const searchUsuarios = (e) => {
    if (e.value != "") {
      setdataFields({ ...dataFields, region: e.value });
      // const user = JSON.parse(localStorage.getItem("userData"));
      DinamicQueries.getDataWithParameters(
        "getUserClientAndRegion",
        "usuarios/",
        { cliente: dataFields.cliente, region: e.value }
      ).then((dataUserConnected) => {
        console.log(dataUserConnected);
        let dataUsuarioFinal = [];

        dataUsuarioFinal = dataUserConnected?.data
          .map((x) => {
            x.establecimientos = [];
            x.cliente = [];
            dataUsuarioFinal.push(x);
            return x;
          })
          .filter(
            (x) =>
              x.activado == "Activo" ||
              x.activado == true ||
              x.activado == "activo"
          );
        // console.log(dataUserConnected.data[0].asignados)
        // console.log(dataFields)
        // dataUserConnected.data[0].asignados.forEach(cadaUsuarioAsignado => {
        //     if (cadaUsuarioAsignado.cliente.includes(dataFields.cliente) == true && cadaUsuarioAsignado.region.includes(e.value) == true) {
        //         dataUsuarioFinal.push(cadaUsuarioAsignado)
        //     }
        // })
        console.log(dataUsuarioFinal);
        const allUser = {
          nombre: "Todos los usuarios",
          uid: "Todos los usuarios",
        };
        dataUsuarioFinal.unshift(allUser);
        setUsuarios(dataUsuarioFinal);
      });
    }
  };

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const handleLoadMap = (map) => {
    setMap(map);
  };

  const handleSearchBoxLoad = (ref) => {
    searchBoxRef.current = ref;
  };

  const handlePlacesChanged = () => {
    const place = searchBoxRef.current.getPlaces()[0];
    if (place) {
      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setMarkerPosition(latLng);
      setSelectedAddress({ label: place.formatted_address });
      setCenter(latLng);
      map.setZoom(16);
    }
  };

  return (
    <React.Fragment>
      <div height="100%">
        <div className="d-md-flex justify-content-between">
          <h5 className={"content-block titleCliente"}>Seguimiento</h5>
          <div>
            <Button className="btn btn-light mt-4 mr-2" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <Button
              disabled={
                dataFields.region !== "" &&
                dataFields.cliente !== "" &&
                dataFields.usuario !== ""
                  ? false
                  : true
              }
              className="btn btn-primary mt-4 mr-2"
              onClick={searchCoordenadas}
            >
              Buscar
            </Button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-3 mt-4">
            <SelectBox
              className=""
              placeholder="Seleccione un cliente"
              label="Cliente"
              dataSource={Clientes}
              onValueChanged={(e) => searchCliente(e)}
              defaultValue={dataFields.cliente}
              value={dataFields.cliente}
              searchEnabled={true}
            />
          </div>
          <div className="col-md-3 mt-4">
            <SelectBox
              placeholder="Seleccione una región"
              label="Región"
              dataSource={Regiones}
              onValueChanged={(e) => searchUsuarios(e)}
              defaultValue={dataFields.region}
              value={dataFields.region}
              searchEnabled={true}
            />
          </div>
          <div className="col-md-3 mt-4">
            <SelectBox
              placeholder="Seleccione un usuario"
              label="Usuarios"
              dataSource={Usuarios}
              // onValueChanged={(e) => searchAUsuarios(e)}
              onValueChanged={(e) =>
                setdataFields({ ...dataFields, usuario: e.value })
              }
              defaultValue={dataFields.usuario}
              value={dataFields.usuario}
              valueExpr="uid"
              displayExpr="nombre"
              searchEnabled={true}
              disabled={
                dataFields.region !== "" && dataFields.cliente !== ""
                  ? false
                  : true
              }
            />
          </div>

          <div className="col-md-3 mt-4">
            <DateBox
              label="Fecha"
              onValueChanged={(e) =>
                setdataFields({
                  ...dataFields,
                  fecha: e.value,
                })
              }
              defaultValue={dataFields.fecha}
              value={dataFields.fecha}
              max={now}
              type="date"
            />
          </div>
        </div>

        <div className="row root">
          <div className="mt-4">
            {/* {PositionCentral.length > 0 ? (
                        <MapContainer center={PositionCentral} zoom={13} scrollWheelZoom={true} key={points}> 
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />             
                        {CoordenadasData.length > 0 ? (
                            CoordenadasData.map((element, index) => {
                                return (<Marker position={[element.lat, element.lng]}>
                                    <Popup> 
                                    <strong>Usuario: {element.promotor}</strong> 
                                    <p>Formularios cargados: {element.nombreFormulario}</p> 
                                    <p>Establecimiento: {element.establecimiento}</p>
                                    <p>{element.fecha_Formulario}</p>
                                    </Popup>
                                </Marker>)
                            })
                        ) : null}
                        </MapContainer>
                    ) : null} */}

            {PositionCentral.length > 0 ? (
              <GoogleMap
                center={center}
                zoom={10}
                onLoad={handleLoadMap}
                mapContainerStyle={{ height: "400px", width: "100%" }}
                // onClick={handleMapClick}
              >
                {CoordenadasData.length > 0
                  ? CoordenadasData.map((element, index) => {
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
                                <strong>Usuario: {element.promotor}</strong>
                                </p>
                                <p>
                                  Formularios cargados:{" "}
                                  {element.nombreFormulario}
                                </p>
                                <p>
                                  Establecimiento: {element.establecimiento}
                                </p>
                                <p> Fecha: {element.fecha_Formulario}</p>
                              </div>
                            </InfoWindow>
                          )}
                          {/* <Popup> 
            
            </Popup> */}
                        </Marker>
                      );
                    })
                  : null}

                {/* {markerPosition && <Marker position={markerPosition} />} */}
                {/* <StandaloneSearchBox
                             onLoad={handleSearchBoxLoad}
                             onPlacesChanged={handlePlacesChanged}
                         >
                             <input type="text" placeholder="Buscar dirección..." />
                         </StandaloneSearchBox> */}
              </GoogleMap>
            ) : null}
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

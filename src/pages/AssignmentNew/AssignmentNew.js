import { ExclamationDiamond, X } from "react-bootstrap-icons";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import * as DinamicQueries from "../../api/DinamicsQuery";
import { SelectBox } from "devextreme-react/select-box";
import { TextArea } from "devextreme-react/text-area"; // No eliminar, sin esto no funciona el input textarea aunque no se use la variable
import ScrollView from "devextreme-react/scroll-view";
import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft } from "react-bootstrap-icons";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import { CheckBox } from 'devextreme-react/check-box';
import "./AssignmentNew.scss";

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
  Export,
} from "devextreme-react/data-grid";

function AssignmentNew() {
  const [msgPopup, setMsgPopup] = useState("Asignar Establecimiento");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupRuta, setShowPopupRuta] = useState(false);
  const [User, setUser] = useState([]);
  const [Establecimientos, setEstablecimientos] = useState([]);
  const [Clientes, setClientes] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [UserSelected, setUserSelected] = useState([]);
  const [isPromotor, setisPromotor] = useState(true);
  const [UserSelectedData, setUserSelectedData] = useState("");
  const [weekButtons, setWeekButtons] = useState(false);
  const [selectedStablisments, setSelectedStablisments] = useState([]);
  const [DataUsuarioSelected, setDataUsuarioSelected] = useState();
  // const [datagrid, setDataGrid] = useState(null);
  const [disabledRuta, setdisabledRuta] = useState(false);
  const initialState = {
    cliente: "",
    region: "",
    formulario: "",
    establecimientos: [],
    establecimientosFinal: [],
  };
  const [Asignacion, setAsignacion] = useState(initialState);
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

  const [idsEstablecimientoToAssing, setidsEstablecimientoToAssing] = useState(
    []
  );
  const [SelectedIdEstablecimiento, setSelectedIdEstablecimiento] = useState();
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [idsEstablecimientoAsiganed, setidsEstablecimientoAsiganed] = useState(
    []
  );

  useEffect(() => {
    getAllUser();
    // get clients
    const userData = JSON.parse(localStorage.getItem("userData"));
    // setClientes(userData.cliente);
    // setRegiones(userData.region);
  }, []);

  const hidePopup = () => {
    setShowPopup(false);
    setAsignacion(initialState);
    setEstablecimientos([]);
    setMsgPopup("Asignar Establecimiento");
  };

  const hidePopupRuta = () => {
    setShowPopupRuta(false);
    setAsignacion(initialState);
    setEstablecimientos([]);
    setMsgPopup("Asignar Establecimiento");
  };

  const cellRender = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i
          className="dx-icon-import"
          onClick={() => AsignarData(data.data)}
          title="Administrar establecimientos"
        ></i>
        <i
          className="dx-icon-chevronnext"
          onClick={() => MostrarRuta(data.data)}
          title="Mostrar ruta"
        ></i>
        {/* <i className="dx-icon-trash" onClick={()=>openDeletePopup(data.data)}></i> */}
      </div>
    );
  };

  function saveEstablishment(e) {


    console.log(idsEstablecimientoToAssing)
    console.log(Establecimientos)


    const dataEstablecimientos = [...Asignacion.establecimientosFinal];
    idsEstablecimientoToAssing.forEach((eachID) => {
    Establecimientos.forEach((usuarioData) => {
        if (usuarioData.ID_FB === eachID) {
          usuarioData.ID = usuarioData.ID == undefined || usuarioData.ID == "" ? usuarioData.ID_STORE : usuarioData.ID
          dataEstablecimientos.push(usuarioData);
        }
      });
    });
    console.log(dataEstablecimientos)

    let arrayEstablecimiento = [];
    dataEstablecimientos.forEach((eachEstab) => {
      if (arrayEstablecimiento.length > 0) {
        let existe = false;
        arrayEstablecimiento.forEach((x) => {
          if (x.ID === eachEstab.ID) {
            existe = true;
          }
        });
        if (!existe) {
          arrayEstablecimiento.push(eachEstab);
        }
      } else {
        arrayEstablecimiento.push(eachEstab);
      }
    });

    console.log(arrayEstablecimiento)

    let dataFinal = []
    console.log(arrayEstablecimiento)
    arrayEstablecimiento.forEach(x => {
      let info
      console.log(isPromotor)
      if (isPromotor) {
        info = {
          ID: x.ID,
          codigo_region: x.codigo_region == undefined ? x.ID_REGION_FB : x.codigo_region,
          key: x.key == undefined ? x.ID_FB : x.key,
          nombre_establecimiento: x.nombre_establecimiento == undefined ? x.NAME : x.nombre_establecimiento,
          nombre_region: x.nombre_region == undefined ? x.NAME_REGION : x.nombre_region,
          uid_region: x.uid_region == undefined ? x.ID_REGION_FB : x.uid_region,
          dias: x.dias == undefined ? [] : x.dias,
          revisado: x.REVIEWED == undefined ? false : x.REVIEWED,
        }
      } else {
        info = {
          ID: x.ID,
          key: x.key == undefined ? x.ID_FB : x.key,
          nombre_establecimiento: x.nombre_establecimiento == undefined ? x.NAME : x.nombre_establecimiento,
          nombre_region: x.nombre_region == undefined ? x.NAME_REGION : x.nombre_region,
          uid_region: x.uid_region == undefined ? x.ID_REGION_FB : x.uid_region,
          dias: x.dias == undefined ? [] : x.dias,
          revisado: x.REVIEWED == undefined ? false : x.REVIEWED,
        }
      }
      dataFinal.push(info)
    })

    console.log(dataFinal)
    console.log(arrayEstablecimiento)

    DinamicQueries.getDataWithParameters(
      "AsignarNewCollectionEstablecimientos",
      "usuarios/",
      { uid: UserSelected, establecimientos: dataFinal }
    )
      .then((data) => {
        console.log(data)
        if (data.status == 200) {
          setAsignacion(initialState);
          setidsEstablecimientoToAssing([])
          // hidePopup();
          AsignarData(DataUsuarioSelected);
          getAllUser();

          setToastConfig({
            ...toastConfig,
            type: "success",
            message: "¡Guardado Exitosamente!",
            isVisible: true,
          });
        } else {
        }
      })
      // .catch((err) => {
      //   setToastConfig({
      //     ...toastConfig,
      //     type: "error",
      //     message: err.message,
      //     isVisible: true,
      //   });
      //   setAsignacion(initialState);
      //   hidePopup();
      // });
  }

  const getAllUser = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    DinamicQueries.getDataWithParameters("getaUserNewFormat", "usuarios/", {
      uid: userData.uid,
    })
      .then((usuarios) => {
        console.log(usuarios)
        setUser(usuarios.data);
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

  const AsignarData = (user) => {
    console.log(user)
    console.log(Regiones)
    console.log(user.region[0])
    setDataUsuarioSelected(user)
    setUserSelectedData(user.nombre == undefined ? UserSelectedData : user.nombre)
    setUserSelected(user.uid);
    DinamicQueries.getDataWithParameters("getStoreNewFormat", "usuarios/", {
      uid: user.uid,
    }).then((usuario) => {
      console.log(usuario)
      DinamicQueries.getDataWithParameters("callProcedure", "analytics/", {
        method: "sp_get_storeWithRegion",
        params:{
          nameRegion:user.region[0]
        }
      }).then((establecimientos) => {
        DinamicQueries.getDataWithParameters("getEstablecimientoNewCollection", "usuarios/", {
          uid: user.uid,
        }).then((EstablecimientosAsigandosColeccionNueva) => {
          // console.log(user)
          // console.log(establecimientos)
          console.log(EstablecimientosAsigandosColeccionNueva)
          if (user.perfil == "Promotor") {
            setisPromotor(true)
          } else {
            setisPromotor(false)
          }
  
          setEstablecimientos(establecimientos.data)
  
  
  
          setAsignacion({
            ...Asignacion,
            establecimientos: usuario.data,
            establecimientosFinal: usuario.data,
            region:user.region[0]
          });
  
  
          setClientes(user.cliente[0]);
          console.log(user.region[0])
          setRegiones(user.region);


        })

      });
    });
    setShowPopup(true);
  };

  const MostrarRuta = (user) => {
    setUserSelected(user.uid);
    DinamicQueries.getDataWithParameters("getaUser", "usuarios/", {
      uid: user.uid,
    }).then((usuario) => {
      DinamicQueries.getDataWithParameters("getEstablecimientoNewCollection", "usuarios/", {
        uid: user.uid,
      }).then((EstablecimientosAsigandosColeccionNueva) => {
        DinamicQueries.getDataWithParameters(
          "getEstablecimientosNewFilter",
          "galeria/",
          {
            cliente: usuario.data[0].cliente[0],
            region: usuario.data[0].region[0],
          }
        ).then((establecimientos) => {
          // setEstablecimientos(establecimientos.data)
          let EstablecimientosUsuario = [];
          console.log(EstablecimientosAsigandosColeccionNueva.data.data)
          EstablecimientosAsigandosColeccionNueva.data.data.forEach((establecimientosRuta) => {
            if (establecimientosRuta != undefined) {
              // establecimientosRuta.forEach((element) => {
                // element.key = Math.random()
                EstablecimientosUsuario.push(establecimientosRuta);
              // });
            }
          });
          let dataFinal = []
          EstablecimientosUsuario.forEach(x => {
            x.lunes = false
            x.martes = false
            x.miercoles = false
            x.jueves = false
            x.viernes = false
            x.sabado = false
            x.domingo = false
            if (x.dias != undefined) {
              x.dias.forEach(dia => {
                switch (dia) {
                  case 1: x.lunes = true; break;
                  case 2: x.martes = true; break;
                  case 3: x.miercoles = true; break;
                  case 4: x.jueves = true; break;
                  case 5: x.viernes = true; break;
                  case 6: x.sabado = true; break;
                  case 7: x.domingo = true; break;
                  default:
                    break;
                }
              })
            }
            dataFinal.push(x)
          })
          setAsignacion({
            ...Asignacion,
            establecimientos: dataFinal,
            establecimientosFinal: dataFinal,
          });
          setTimeout(() => {
            setdisabledRuta(false)
          }, 1000);
        });
      });
      setShowPopupRuta(true);
      })

  };


  const searchEstablecimientos = (e) => {
    if (e.value != "") {
      setAsignacion({ ...Asignacion, region: e.value });
      console.log(e.value)
      DinamicQueries.getDataWithParameters("callProcedure", "analytics/", {
        method: "sp_get_storeWithRegion",
        params:{
          nameRegion:e.value
        }
      }).then((establecimientos) => {
        console.log(establecimientos)
        setEstablecimientos(establecimientos.data)
      })
    }
  };

  const handleOptionChange = (e) => {
    if (e.fullName === "selectedRowKeys") {
      setidsEstablecimientoToAssing(e.value);
    }
  };

  const openDeletePopup = (uid) => {
    setShowPopupDelete(true);
    setSelectedIdEstablecimiento(uid);
  };

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const cellRenderAsignar = (data) => {
    return (
      <div className="d-flex icons_grid">
        {/* <i className="dx-icon-edit" onClick={()=>editClient(data.data)}></i> */}
        <i
          className="dx-icon-trash"
          onClick={() => openDeletePopup(data.data.ID)}
        ></i>
      </div>
    );
  };

  const checkedLabel = { 'aria-label': 'Checked' };
  const cellRendeRuta = (data) => {
    return (
      <div className="d-flex icons_grid" style={{ justifyContent: "center", display: "flex" }}>
        {/* <i className="dx-icon-edit" onClick={()=>editClient(data.data)}></i> */}
        {/* <i
          className="dx-icon-trash"
          onClick={() => openDeletePopup(data.data.id_establecimiento)}
        ></i> */}
        <CheckBox defaultValue={data.value} elementAttr={checkedLabel} onValueChanged={(e) => changeDays(e, data)} />
      </div>
    );
  };

  const changeDays = (e, data) => {
    let dataFinal = [...Asignacion.establecimientosFinal]

    let infoFinal = []
    // console.log(dataFinal)
    // console.log(data.data.key)
    dataFinal.forEach(x => {
      if (x.key == data.data.key) {
        switch (data.columnIndex) {
          case 3: x.lunes = e.value; break;
          case 4: x.martes = e.value; break;
          case 5: x.miercoles = e.value; break;
          case 6: x.jueves = e.value; break;
          case 7: x.viernes = e.value; break;
          case 8: x.sabado = e.value; break;
          case 9: x.domingo = e.value; break;
          default:
            break;
        }
      }
      infoFinal.push(x)
    })

    setAsignacion({
      ...Asignacion,
      establecimientos: infoFinal,
      establecimientosFinal: infoFinal,
    });

  }

  const deleteEstablecimientos = () => {
    DinamicQueries.getDataWithParameters(
      "DeleteAsignacionEstablecimientos",
      "usuarios/",
      { uid: UserSelected, idEstablecimiento: SelectedIdEstablecimiento }
    )
      .then((data) => {
        if (data.status === 200) {
          setAsignacion(initialState);
          hideDeletePopup();
          AsignarData(DataUsuarioSelected);
          getAllUser();

          setToastConfig({
            ...toastConfig,
            type: "success",
            message: "¡Guardado Exitosamente!",
            isVisible: true,
          });
        } else {
        }
      })
      .catch((err) => {
        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
        setAsignacion(initialState);
        hidePopup();
        hideDeletePopup();
      });
  };

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const asignarRuta = () => {
    setdisabledRuta(true)

    let dataFinal = [...Asignacion.establecimientosFinal].slice();

    let infoFinal = []

    dataFinal.forEach(x => {
      x.dias = []

      if (x.lunes) { x.dias.push(1) }
      if (x.martes) { x.dias.push(2) }
      if (x.miercoles) { x.dias.push(3) }
      if (x.jueves) { x.dias.push(4) }
      if (x.viernes) { x.dias.push(5) }
      if (x.sabado) { x.dias.push(6) }
      if (x.domingo) { x.dias.push(7) }
      delete x.lunes
      delete x.martes
      delete x.miercoles
      delete x.jueves
      delete x.viernes
      delete x.sabado
      delete x.domingo
      infoFinal.push(x)
    })

    console.log(infoFinal)
    DinamicQueries.getDataWithParameters(
      "AsignarNewCollectionEstablecimientos",
      "usuarios/",
      { uid: UserSelected, establecimientos: infoFinal}
    )
      .then((data) => {
        if (data.status === 200) {

          setToastConfig({
            ...toastConfig,
            type: "success",
            message: "¡Ruta cargada exitosamente!",
            isVisible: true,
          });
          let newData = []
          infoFinal.forEach(x => {
            x.lunes = false
            x.martes = false
            x.miercoles = false
            x.jueves = false
            x.viernes = false
            x.sabado = false
            x.domingo = false
            if (x.dias != undefined) {
              x.dias.forEach(dia => {
                switch (dia) {
                  case 1: x.lunes = true; break;
                  case 2: x.martes = true; break;
                  case 3: x.miercoles = true; break;
                  case 4: x.jueves = true; break;
                  case 5: x.viernes = true; break;
                  case 6: x.sabado = true; break;
                  case 7: x.domingo = true; break;
                  default:
                    break;
                }
              })
            }
            newData.push(x)
          })
          setAsignacion({
            ...Asignacion,
            establecimientos: newData,
            establecimientosFinal: newData,
          });

          setTimeout(() => {
            setdisabledRuta(false)
          }, 1000);

        }
      })
      .catch((err) => {
      });

  }

  const saveButtonOptions = {
    icon: "check",
    text: "Guardar Ruta",
    onClick: asignarRuta,
    disabled:disabledRuta,
  };

  const handleOptionChangeAsigando = (e) => {
    if (e.fullName === "selectedRowKeys") {
      setidsEstablecimientoAsiganed(e.value);
    }
  };

  const eliminarRegistros = (arrayObjetos, arrayStrings) => {
    return arrayObjetos.filter(objeto => !arrayStrings.includes(objeto.ID));
  }

  const deleteEstablecimientosMultiples = () => {
    

    // console.log(idsEstablecimientoAsiganed)

    DinamicQueries.getDataWithParameters(
      "DeleteMultipleAsignacionEstablecimientos",
      "usuarios/",
      { uid: UserSelected, idEstablecimientos: idsEstablecimientoAsiganed }
    )
      .then((data) => {
        if (data.status === 200) {
          setAsignacion(initialState);
          hideDeletePopup();
          AsignarData(DataUsuarioSelected);
          getAllUser();

          setToastConfig({
            ...toastConfig,
            type: "success",
            message: "¡Guardado Exitosamente!",
            isVisible: true,
          });
        } else {
        }
      })
      .catch((err) => {
        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
        setAsignacion(initialState);
        hidePopup();
        hideDeletePopup();
      });
  };

  const getSelected = ({ selectedRowsData }) => {
    if(selectedRowsData.length > 0){
      setWeekButtons(true)
      setSelectedStablisments(selectedRowsData);
    } else {
      setWeekButtons(false)
      setSelectedStablisments([]);
    }
  };

  const setToDay = (day) => {
    selectedStablisments.forEach((cadaEstablecimiento) => {
      const e = {
        value: true
      };

      const data = {
        data: {
          key: cadaEstablecimiento.key
        },
        columnIndex: day
      }

      changeDays(e, data);
    })
  };

  return (
    <React.Fragment>
      <div className="d-flex mt-4 mb-4">
        <div className="header-grid-title">
          <h5 className="content-block titleCliente">
            Rutas
          </h5>
        </div>
      </div>
      <div className="tabla-Cliente">
        <DataGrid
          className="tabla-Cliente"
          dataSource={User}
          showBorders={true}
          remoteOperations={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          style={{ height: "400px", width: "100%" }}
          keyExpr="uid"
        >
          <Export enabled={true} />
          <ColumnChooser enabled={true} mode="select" />
          <FilterRow visible={true} />
          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
          <HeaderFilter visible={true} />
          {/* 
            <Column
              width={180}
              caption="Cod Cliente"
              dataField="cod_cliente"
              dataType="string"
            /> */}
          <Column
            // width={150}
            caption="Nombre"
            dataField="nombre"
            dataType="string"
          />
          <Column
            // width={180}
            caption="Cédula"
            dataField="cedula"
            dataType="string"
          />

          <Column
            // width={180}
            caption="Region"
            dataField="region"
            dataType="string"
          />

          <Column
            // width={180}
            caption="Clientes"
            dataField="cliente"
            dataType="string"
          />

          <Column
            // width={80}
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
        <ScrollView width={"100%"} height={"100%"}>
          {/* <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={saveButtonOptions}
        /> */}

          <div className="row">
            {/* <div className="col-md-6">
              <SelectBox
                className="SelectBoxC mb-2 mt-3"
                placeholder="Seleccione un cliente"
                label="Cliente"
                dataSource={Clientes}
                onValueChanged={(e) => searchCliente(e)}
                defaultValue={Asignacion.cliente}
                value={Asignacion.cliente}
                searchEnabled={true}
              />
            </div> */}
            <div className="col-md-12">
              <SelectBox
                className="SelectBoxR mb-2"
                placeholder="Seleccione una región"
                label="Región"
                dataSource={Regiones}
                onValueChanged={(e) => searchEstablecimientos(e)}
                defaultValue={Asignacion.region}
                value={Asignacion.region}
                searchEnabled={true}
              />
            </div>
          </div>

          <div className="row mx-5" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="col-md-5 mt-2">
              <div className={'dx-card'} style={{ padding: "20px", borderRadius: "15px" }}>

                <h6 className="title">Establecimientos</h6>
                <DataGrid
                  className="tabla-user"
                  dataSource={Establecimientos}
                  showBorders={true}
                  remoteOperations={true}
                  // focusedRowEnabled={true}
                  defaultFocusedRowIndex={0}
                  style={{ height: "60vh", width: "100%" }}
                  keyExpr="ID_FB"
                  // selectedRowKeys={this.state.selectedRowKeys}
                  onOptionChanged={(e) => handleOptionChange(e)}
                  wordWrapEnabled={true}
                >
                  <FilterRow visible={true} />
                  <Selection mode="multiple" />
                  <LoadPanel enabled />
                  <Paging defaultPageSize={12} />
                  <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={allowedPageSizes}
                  />
                  <HeaderFilter visible={true} />


                  <Column
                    caption={"ID"}
                    dataField={"ID_STORE"}
                    width={100}
                  />
                  {/* <Column caption={"Id Origen"} dataField={"id_origen"} width={120} /> */}
                  <Column
                    dataField={"NAME"}
                    caption={"Nombre Establecimiento"}
                    dataType="string"
                  />
                  {/* <Column
                dataField={"direccion"}
                caption={"Direccion"}
                dataType="string"
                width={120}
              /> */}
                  {/* <Column
                dataField={"descripcion_razon_social"}
                caption={"Razon Social"}
                dataType="string"
              /> */}
                  {/* <Column dataField={"canal"} caption={"Canal"} dataType="string" />
              <Column dataField={"subcanal"} caption={"Subcanal"} dataType="string" />
              <Column dataField={"ciudad"} caption={"ciudad"} dataType="string" />
              <Column dataField={"region"} caption={"Region"} dataType="string" />
              <Column dataField={"zona"} caption={"Zona"} dataType="string" /> */}
                  {/* <Column
                dataField={"descripcion_agrupador"}
                caption={"Agrupador"}
                dataType="string"
              /> */}
                  {/* <Column dataField={"estatus"} caption={"Estatus"} dataType="string" /> */}
                  {/* <Column
                dataField={"nombre_cliente"}
                caption={"Cliente"}
                dataType="string"
              /> */}
                </DataGrid>
              </div>
            </div>
            <div
              className="col-md-1 mt-6"
              style={{ display: "grid", alignContent: "center", justifyContent: "center" }}
            >
              <Button
                className="btn btn-light mt-4"
                onClick={() => saveEstablishment()}
                style={{ width: "10vw" }}
              >
                Asignar <ArrowRight style={{ marginLeft: "5px" }} />
              </Button>
              <Button
                className="btn btn-light mt-4"
                onClick={(e) => deleteEstablecimientosMultiples()}
              >
                Eliminar <ArrowLeft style={{ marginLeft: "5px" }} />
              </Button>
              {/* onClick={() => saveUser()} */}
            </div>
            <div className="col-md-5 mt-2">
              <div className={'dx-card'} style={{ padding: "20px", borderRadius: "15px" }}>

                <h6 className="title">Establecimientos asignados a {UserSelectedData}</h6>
                {/* {AssingTo} */}
                <DataGrid
                  className="tabla-user"
                  dataSource={Asignacion.establecimientosFinal}
                  showBorders={true}
                  remoteOperations={true}
                  // focusedRowEnabled={true}
                  defaultFocusedRowIndex={0}
                  style={{ height: "60vh", width: "100%" }}
                  keyExpr="ID"
                  wordWrapEnabled={true}
                  onOptionChanged={(e) => handleOptionChangeAsigando(e)}
                >
                  <FilterRow visible={true} />
                  <Selection mode="multiple" />
                  <LoadPanel enabled />
                  <Paging defaultPageSize={12} />
                  <Pager
                    showPageSizeSelector={true}
                    allowedPageSizes={allowedPageSizes}
                  />
                  <HeaderFilter visible={true} />


                  <Column
                    caption="ID"
                    dataField="ID"
                    dataType="string"
                    width={100}

                  />
                  <Column
                    caption="Nombre"
                    dataField="nombre_establecimiento"
                    dataType="string"
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

          {/* <ScrollView width="100%" height="100%">
          <div className="">
            <div className="">
              
            </div>

            <div className="">
              
            </div>

            <div className="">
              
              <TagBox
              className="inputEstablecimiento" 
                showSelectionControls={true}
                items={Establecimientos}
                placeholder="Establecimientos"
                valueExpr="nombre_establecimiento"
                displayExpr="nombre_establecimiento"
                onValueChanged={(e) => setAsignacion({...Asignacion, establecimientos:e.value, establecimientosFinal:e.value})}
                value={Asignacion.establecimientos}
                defaultValue ={Asignacion.establecimientos}
                searchEnabled={true}
              />
            </div>

          <div className="mt-4">
            <div className="nombreListaEstablecimiento">Establecimientos asignados</div>
            <div className="">
                <List
                  className="ListaEstablecimiento"
                  dataSource={Asignacion.establecimientosFinal}
                  height={300}
                  itemRender={SelectInitialPage}
                
                  />
              </div>
            </div>           
          </div>
        </ScrollView> */}
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

      {/* Show grid de ruta */}

      <Popup
        visible={showPopupRuta}
        onHiding={hidePopupRuta}
        showTitle={true}
        title="Asignar Ruta"
        showCloseButton={true}

        fullScreen={true}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={saveButtonOptions}
        />
        {/* <ScrollView width={"100%"} height={"100%"}> */}
        <div className="row" style={{ height: "100%" }}>
          <div className="col-md-12 mt-2" style={{ height: "100%" }}>
            {weekButtons &&
              <>
                <div className="mb-3">Asignar todos los establecimientos seleccionados para el dia:</div>
                <div className="mb-4">
                  <Button onClick={()=>{setToDay(3)}} className="btn-agregar" style={{ width: '150px', marginRight: '10px' }}>
                    Lunes
                  </Button>
                  <Button onClick={()=>{setToDay(4)}} className="btn-agregar" style={{ width: '150px', marginRight: '10px' }}>
                    Martes
                  </Button>
                  <Button onClick={()=>{setToDay(5)}} className="btn-agregar" style={{ width: '150px', marginRight: '10px' }}>
                    Miércoles
                  </Button>
                  <Button onClick={()=>{setToDay(6)}} className="btn-agregar" style={{ width: '150px', marginRight: '10px' }}>
                    Jueves
                  </Button>
                  <Button onClick={()=>{setToDay(7)}} className="btn-agregar" style={{ width: '150px', marginRight: '10px' }}>
                    Viernes
                  </Button>
                  <Button onClick={()=>{setToDay(8)}} className="btn-agregar" style={{ width: '150px', marginRight: '10px' }}>
                    Sábado
                  </Button>
                  <Button onClick={()=>{setToDay(9)}} className="btn-agregar" style={{ width: '150px' }}>
                    Domingo
                  </Button>
                </div>
              </>
            }
            {/* {AssingTo} */}
            <DataGrid
              className="tabla-user"
              dataSource={Asignacion.establecimientosFinal}
              showBorders={true}
              remoteOperations={true}
              // focusedRowEnabled={true}
              defaultFocusedRowIndex={0}
              style={{ height: "85vh", width: "100%" }}
              // ref={(ref) => { setDataGrid(ref.instance.clear) }}
              onSelectionChanged={getSelected}
              keyExpr="ID"
              wordWrapEnabled={true}
              paginate={false}
              paging={false}
              columnAutoWidth={true}
            >
              {/* <Export enabled={true} />
            <ColumnChooser
                enabled={true}
                mode="select" 
            /> */}
              <Selection showCheckBoxesMode={'always'} selectAllMode={'allPages'} mode={'multiple'} />
              <FilterRow visible={true} />
              <LoadPanel enabled />
              <Scrolling
                useNative={false}
                scrollByContent={true}
                scrollByThumb={true}
                showScrollbar="onHover"
              />

              {/* <Paging defaultPageSize={12} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={allowedPageSizes}
            /> */}
              <HeaderFilter visible={true} />

              <Column
                caption="ID establecimiento"
                dataField="ID"
                dataType="string"
                width={220}
              />
              <Column
                caption="Nombre"
                dataField="nombre_establecimiento"
                dataType="string"
                width={290}
              />

              <Column
                caption="Lunes"
                dataField="lunes"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />

              <Column
                caption="Martes"
                dataField="martes"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />

              <Column
                caption="Miercoles"
                dataField="miercoles"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />

              <Column
                caption="Jueves"
                dataField="jueves"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />

              <Column
                caption="Viernes"
                dataField="viernes"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />

              <Column
                caption="Sabado"
                dataField="sabado"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />

              <Column
                caption="Domingo"
                dataField="domingo"
                allowSorting={false}
                alignment='center'
                cellRender={cellRendeRuta}
                allowFiltering={false}
              />
            </DataGrid>
          </div>
        </div>
        {/* </ScrollView> */}
      </Popup>
    </React.Fragment>
  );
}

export default AssignmentNew;

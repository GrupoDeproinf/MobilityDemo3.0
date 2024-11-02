import { faChevronCircleRight, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { Display, ExclamationDiamond, FileX } from "react-bootstrap-icons";
import { ArrowRight, PlusCircle, XCircle } from 'react-bootstrap-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popup, ToolbarItem } from "devextreme-react/popup";
import * as DinamicQueries from '../../api/DinamicsQuery'
import { SelectBox } from "devextreme-react/select-box";
import { NumberBox } from 'devextreme-react/number-box';
import { TextArea } from "devextreme-react/text-area"; // No eliminar, sin esto no funciona el input textarea aunque no se use la variable
import ScrollView from "devextreme-react/scroll-view";
import { CheckBox } from 'devextreme-react/check-box';
import * as ReportsService from '../../api/reports';
import React, { useState, useEffect } from "react";
import { HouseDoor } from 'react-bootstrap-icons';
import { Button } from "devextreme-react/button";
import TextBox from 'devextreme-react/text-box';
import * as ListUser from "../../api/ListUser";
import { Toast } from "devextreme-react/toast";
import TagBox from 'devextreme-react/tag-box';
import List from 'devextreme-react/list';
import './AssignmentUser.scss'



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
  Export
} from "devextreme-react/data-grid";

import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
} from "devextreme-react/form";

function AssignmentUser2() {
  const [Usuarios, setUsuarios] = useState([]);
  const [Clientes, setClientes] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [UserSelected, setUserSelected] = useState([]);
  const initialState = {
    cliente:"",
    region: "",
    usuario:"",
    usuariosAsignados:"",
    usuarioName:"",
  };
  const [Asignacion, setAsignacion] = useState(initialState);
  const [UsuariosAsignadosFinal, setUsuariosAsignadosFinal] = useState([]);
  const [UsuariosAsignadosFinalDB, setUsuariosAsignadosFinalDB] = useState([]);
  const [AssingTo, setAssingTo] = useState("");
  const [setAssingToAllData, setsetAssingToAllData] = useState("");
  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const [UsuariosAsignadosTag, setUsuariosAsignadosTag] = useState([]);
  const [idsUsersToAssing, setidsUsersToAssing] = useState([]);
  const [idsremoveUsers, setidsremoveUsers] = useState([]);
  const [SelectedIdUser, setSelectedIdUser] = useState();
  const [showPopupDelete, setShowPopupDelete] = useState(false);

  useEffect(() => {
    // get clients
    const userData = JSON.parse(localStorage.getItem("userData"))
    setClientes(userData.cliente);
    setRegiones(userData.region);
  }, []);


  const searchCliente = (e) => {
    if (e.value != "") {
      setAsignacion({ ...Asignacion, cliente: e.value });
      DinamicQueries.getDataWithParameters('getUserClientAndRegion', "usuarios/", {cliente:e.value, region:Asignacion.region})
      .then(usuarios=>{
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:localStorage.getItem("user")})
        .then(usuarios=>{
            console.log(usuarios)
            localStorage.setItem('userData', JSON.stringify(usuarios.data[0]))
        })
        setUsuarios(usuarios.data)
        filtrarData(e.value, Asignacion.region, UsuariosAsignadosFinalDB)
      })
    }
  };

  const searchUsuarios = (e) => {
    if (e.value != "") {
      setAsignacion({ ...Asignacion, region: e.value })
      DinamicQueries.getDataWithParameters('getUserClientAndRegion', "usuarios/", {cliente:Asignacion.cliente, region:e.value})
      .then(usuarios=>{
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:localStorage.getItem("user")})
        .then(usuarios=>{
            console.log(usuarios)
            localStorage.setItem('userData', JSON.stringify(usuarios.data[0]))
        })
        setUsuarios(usuarios.data)
        filtrarData(Asignacion.cliente, e.value, UsuariosAsignadosFinalDB)
      })
    }
  };

  const searchAUsuarios = (e) => {
    if (e.value != "") {
      if (e.event != undefined){
        setAsignacion({...Asignacion, usuario:e.value})
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:e.value})
        .then(usuario=>{
          DinamicQueries.getDataWithParameters('getaUserNewFormat', "usuarios/", {uid:e.value})
          .then(UsuariosAsignados=>{
            
            let dataUsuariosAsignados = UsuariosAsignados?.data
            console.log(dataUsuariosAsignados)

            let usuariosAsignados =[]
            if (usuario.data.length > 0) {
              if (dataUsuariosAsignados != undefined){
                dataUsuariosAsignados.forEach(DatosUsusario => {
                  usuariosAsignados.push(DatosUsusario.uid)
                });
              }
            }

            // console.log(usuario.data[0])
            setAssingTo(usuario.data[0].nombre + " " + usuario.data[0].apellido)
            setsetAssingToAllData(usuario.data[0])
            if (dataUsuariosAsignados != undefined) {
              setUsuariosAsignadosFinalDB(dataUsuariosAsignados)
            } else {
              setUsuariosAsignadosFinalDB([])
            }
            filtrarData(Asignacion.cliente, Asignacion.region, dataUsuariosAsignados)
          })
        })
      }
    }
  };

  const filtrarData = (cliente, region, data) => {
    let infoTag = []
    // let infoTagName = []
    if (data != undefined){
      data.forEach(x=>{
        if (x.cliente != undefined){
          x.clientes = x.cliente
        }
        if (x.clientes.includes(cliente) && x.region.includes(region)){
          infoTag.push(x)
        }
      })
      setUsuariosAsignadosFinal(infoTag)
      setUsuariosAsignadosTag(infoTag)
    } else {
      setUsuariosAsignadosFinal([])
      setUsuariosAsignadosTag([])
    }
  }

  const OnSubmit = () => {
    let arrayusuario = []

    const dataUsuarioNuevo = [...UsuariosAsignadosFinalDB]
    console.log(Usuarios)
    console.log(UsuariosAsignadosFinalDB)
    console.log(idsUsersToAssing)
    Usuarios.forEach(usuarioData=>{
      idsUsersToAssing.forEach(eachID=>{
        if (usuarioData.uid == eachID){
          dataUsuarioNuevo.push(usuarioData)
        }
      })
    })
    
    dataUsuarioNuevo.forEach(cadaUsuario=>{
      // dataUsuarioNuevo.forEach(cadaUsuarioUID=>{

        // if (cadaUsuario.uid == cadaUsuarioUID) {
          if (arrayusuario.length > 0) {
            let existe = false
            arrayusuario.forEach(x=>{
              if (x.uid == cadaUsuario.uid) {
                existe = true
              }
            })
            if (!existe) {
              cadaUsuario.establecimientos = []
              cadaUsuario.establecimientosNuevos = []
              cadaUsuario.est_censo = []
              cadaUsuario.establecimientosNuevosAsignados = []
              arrayusuario.push(cadaUsuario)
            }
          } else {
            cadaUsuario.establecimientos = []
            cadaUsuario.establecimientosNuevos = []
            cadaUsuario.est_censo = []
            cadaUsuario.establecimientosNuevosAsignados = []
            arrayusuario.push(cadaUsuario)
          }
    })
    // console.log(setAssingToAllData) //USUARIO AL QUE LE VAN A ASIGANR
    // console.log(Asignacion) // USUARIO ASIGANDO
    // console.log(arrayusuario) // ARRAY FINAL
    // console.log(dataUsuarioNuevo)
    // console.log(setAssingToAllData)


    console.log(Asignacion.usuario)
    console.log(arrayusuario)
    console.log(idsUsersToAssing)

    DinamicQueries.getDataWithParameters('UpdateAssignmentUserNewFormat', "usuarios/", {uid:Asignacion.usuario, Asignados:arrayusuario, asignado_ids:idsUsersToAssing})
    .then((data) => {
      if (data.status === 200) {
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:localStorage.getItem("user")})
        .then(usuarios=>{
            console.log(usuarios)
            localStorage.setItem('userData', JSON.stringify(usuarios.data[0]))
        })
        searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Guardado Exitosamente!",
          isVisible: true,
        });
        hideDeletePopup()
      } else {
      }
    })
    .catch((err) => {
      searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
      setToastConfig({
        ...toastConfig,
        type: "error",
        message: err.message,
        isVisible: true,
      });
      hideDeletePopup()
    });
  }

  const handleOptionChange = (e) => {
    if(e.fullName === 'selectedRowKeys') {
      setidsUsersToAssing(e.value)
    }
  }

  const handleOptionChangeAsignados = (e) => {
    if(e.fullName === 'selectedRowKeys') {
      setidsremoveUsers(e.value)
    }
  }

  const openDeletePopup = (uid) =>{
    setShowPopupDelete(true);
    setSelectedIdUser(uid);
  }

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const cellRender = (data) => {
    return <div className='d-flex icons_grid'>
      {/* <i className="dx-icon-edit" onClick={()=>editClient(data.data)}></i> */}
      {/* <i className="dx-icon-trash" onClick={()=>openDeletePopup(data.data.uid)}></i> */}
      <XCircle onClick={()=>openDeletePopup(data.data.uid)} style={{color:"red"}}/>
    </div>;
  }

  const cellRenderAsignar = (data) => {
    return <div className='d-flex icons_grid'>
      {/* <i className="dx-icon-edit" onClick={()=>editClient(data.data)}></i> */}
      {/* <i className="dx-icon-trash" onClick={()=>openDeletePopup(data.data.uid)}></i> */}
      {/* <p>Hola</p> */}
      <PlusCircle onClick={()=>AsignarNuevoUser(data.data.uid)} style={{color:"#f49f3c"}}/>
    </div>;
  }

  const cellRenderImage = (data) => {
    return <div >
      {
        data.data.foto_personal != undefined ? 
        <img src={`${data.data.foto_personal}`} style={{width:"25px"}} /> :
        <img src="icone-utilisateur-orange.png" style={{width:"25px"}} />
      }

      {/* <i className="dx-icon-edit" onClick={()=>editClient(data.data)}></i> */}
      {/* <i className="dx-icon-trash" onClick={()=>openDeletePopup(data.data.uid)}></i> */}
    </div>;
  }


  const deleteUser = () =>{

    
    let dataUsuarioNuevo = [...UsuariosAsignadosFinalDB]

    console.log(dataUsuarioNuevo)
    console.log(SelectedIdUser)
    dataUsuarioNuevo = dataUsuarioNuevo.filter(x=> x.uid != SelectedIdUser)
    // let dataIds = dataUsuarioNuevo.map(x=>{
    //   return x.uid
    // })

    // console.log(Asignacion)
    // console.log(dataUsuarioNuevo)
    // console.log(dataIds)

    DinamicQueries.getDataWithParameters('deleteUserAsignacionNew', "usuarios/", {uid:Asignacion.usuario, Asignados:dataUsuarioNuevo, asignado_ids:[SelectedIdUser]})
    .then((data) => {
      if (data.status === 200) {
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:localStorage.getItem("user")})
        .then(usuarios=>{
            console.log(usuarios)
            localStorage.setItem('userData', JSON.stringify(usuarios.data[0]))
        })
        searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
        setToastConfig({
          ...toastConfig,
          type: 'success',
          message: 'Asignación eliminada exitosamente',
          isVisible: true,
        });
        hideDeletePopup()
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
      searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
      hideDeletePopup()
    });
  }

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const AsignarNuevoUser = (uid) => {
    let arrayusuario = []
    const dataUsuarioNuevo = [...UsuariosAsignadosFinalDB]
    
    Usuarios.forEach(usuarioData=>{
      // idsUsersToAssing.forEach(eachID=>{
        if (usuarioData.uid == uid){
          dataUsuarioNuevo.push(usuarioData)
        }
      // })
    })

    // Usuarios.forEach(usuarioData=>{
    //   idsUsersToAssing.forEach(eachID=>{
    //     if (usuarioData.uid == eachID){
    //       dataUsuarioNuevo.push(usuarioData)
    //     }
    //   })
    // })

    console.log(dataUsuarioNuevo)

    dataUsuarioNuevo.forEach(cadaUsuario=>{
      if (arrayusuario.length > 0) {
        let existe = false
        arrayusuario.forEach(x=>{
          if (x.uid == cadaUsuario.uid) {
            existe = true
          }
        })
        if (!existe) {
          cadaUsuario.establecimientos = []
          arrayusuario.push(cadaUsuario)
        }
      } else {
        cadaUsuario.establecimientos = []
        arrayusuario.push(cadaUsuario)
      }
    })

    console.log(Asignacion)
    console.log(arrayusuario)


     dataUsuarioNuevo.forEach(cadaUsuario=>{
      // dataUsuarioNuevo.forEach(cadaUsuarioUID=>{

        // if (cadaUsuario.uid == cadaUsuarioUID) {
          if (arrayusuario.length > 0) {
            let existe = false
            arrayusuario.forEach(x=>{
              if (x.uid == cadaUsuario.uid) {
                existe = true
              }
            })
            if (!existe) {
              cadaUsuario.establecimientos = []
              cadaUsuario.establecimientosNuevos = []
              cadaUsuario.est_censo = []
              cadaUsuario.establecimientosNuevosAsignados = []
              arrayusuario.push(cadaUsuario)
            }
          } else {
            cadaUsuario.establecimientos = []
            cadaUsuario.establecimientosNuevos = []
            cadaUsuario.est_censo = []
            cadaUsuario.establecimientosNuevosAsignados = []
            arrayusuario.push(cadaUsuario)
          }
    })
    // console.log(setAssingToAllData) //USUARIO AL QUE LE VAN A ASIGANR
    // console.log(Asignacion) // USUARIO ASIGANDO
    console.log(arrayusuario) // ARRAY FINAL
    // console.log(dataUsuarioNuevo)
    // console.log(setAssingToAllData)
    // console.log(idsUsersToAssing)

    let idsFinales = arrayusuario.map(x=>{
      return x.key
    })

    DinamicQueries.getDataWithParameters('UpdateAssignmentUserNewFormat', "usuarios/", {uid:Asignacion.usuario, Asignados:arrayusuario, asignado_ids:idsFinales})
    .then((data) => {
      if (data.status === 200) {
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:localStorage.getItem("user")})
        .then(usuarios=>{
            console.log(usuarios)
            localStorage.setItem('userData', JSON.stringify(usuarios.data[0]))
        })
        searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Guardado Exitosamente!",
          isVisible: true,
        });
        hideDeletePopup()
      } else {
      }
    })
    .catch((err) => {
      searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
      setToastConfig({
        ...toastConfig,
        type: "error",
        message: err.message,
        isVisible: true,
      });
      hideDeletePopup()
    });
  }

  const OnRemove = () => {
    
    let dataUsuarioNuevo = [...UsuariosAsignadosFinalDB]
    idsremoveUsers.forEach(ids=>{
      dataUsuarioNuevo = dataUsuarioNuevo.filter(x=> x.uid != ids)
    })


    console.log(Asignacion)
    console.log(dataUsuarioNuevo)

    console.log(idsremoveUsers)


    DinamicQueries.getDataWithParameters('deleteUserAsignacionNew', "usuarios/", {uid:Asignacion.usuario, Asignados:dataUsuarioNuevo, asignado_ids:idsremoveUsers})
    .then((data) => {
      if (data.status === 200) {
        DinamicQueries.getDataWithParameters('getaUser', "usuarios/", {uid:localStorage.getItem("user")})
        .then(usuarios=>{
            console.log(usuarios)
            localStorage.setItem('userData', JSON.stringify(usuarios.data[0]))
        })
        searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
        setToastConfig({
          ...toastConfig,
          type: 'success',
          message: 'Asignación eliminada exitosamente',
          isVisible: true,
        });
        hideDeletePopup()
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
      searchAUsuarios({event:Asignacion.usuario, value:Asignacion.usuario})
      hideDeletePopup()
    });
  }

  return (
    <React.Fragment>

      <div height="100%">
        <div className="d-md-flex justify-content-between">
            <h6 className={"titleCliente mt-4 mb-0 mx-2"}>Asignación de Usuarios</h6>
        </div>

        <div className="row">
            <div className="col-md-4 mt-1">
            <SelectBox
                className="SelectBoxC mb-3"
                placeholder="Seleccione un cliente"
                label="Cliente"
                dataSource={Clientes}
                onValueChanged={(e) => searchCliente(e)}
                defaultValue={Asignacion.cliente}
                value={Asignacion.cliente}
                searchEnabled={true}
              />
            </div>
            <div className="col-md-4 mt-1">
            <SelectBox
                className="SelectBoxR mb-3"
                placeholder="Seleccione una región"
                label="Región"
                dataSource={Regiones}
                onValueChanged={(e) => searchUsuarios(e)}
                defaultValue={Asignacion.region}
                value={Asignacion.region}
                searchEnabled={true}
              />
            </div>
            <div className="col-md-4 mt-1">
            <SelectBox
                className="SelectBoxR mb-3"
                placeholder=""
                label="Asignar usuarios a: "
                dataSource={Usuarios}
                onValueChanged={(e) => searchAUsuarios(e)}
                // onValueChanged={(e) => setAsignacion({...Asignacion,  usuario:e.value})}
                defaultValue={Asignacion.usuario}
                value={Asignacion.usuario}
                valueExpr="uid"
                displayExpr="nombre"
                searchEnabled={true}
                disabled={Asignacion.region !== '' && Asignacion.cliente !== '' ? false : true}
              />
            </div>
        </div>
      </div>

      <div className="row">
          <div className="col-md-5 mt-2">
          <div className={'dx-card'} style={{padding:"20px",borderRadius:"15px"}}>
            <h6 className='title'>Usuarios</h6>
            <DataGrid
              className="tabla-user"
              dataSource={Usuarios}
              onOptionChanged={(e) => handleOptionChange(e)}
              showBorders={true}
              remoteOperations={true}
              // focusedRowEnabled={true}
              defaultFocusedRowIndex={0}
              style={{ height: "350px", width: "100%" }}
              keyExpr="uid"
              wordWrapEnabled={true}
              paginate={false}
              paging={false}
              // columnAutoWidth={true}
            >
              <FilterRow visible={true} />
              <LoadPanel enabled />
              <Scrolling
                useNative={false}
                scrollByContent={true}
                scrollByThumb={true}
                showScrollbar="onHover" />
      

              <Selection mode="multiple"/>
              <HeaderFilter visible={true} />


              <Column
                caption="Cédula"
                dataField="cedula"
                dataType="string"
              />
              <Column
              width={200}
                caption="Nombre"
                dataField="nombre"
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
          <div className="col-md-2 mt-5" style={{display:"grid", alignContent:"center"}}>
            <div style={{textAlign:"center"}}>
              {
                idsUsersToAssing.length > 0 ? (
                  <FontAwesomeIcon icon={faChevronCircleRight} style={{fontSize:"40px", color:"#f49f3c",cursor:"pointer"}} onClick={() => OnSubmit()}/>
                ):(
                  <FontAwesomeIcon icon={faChevronCircleRight} style={{fontSize:"40px"}}/>
                )
              }
              <br></br>
              {
                idsremoveUsers.length > 0 ? (
                  // <FontAwesomeIcon icon={faChevronCircleRight} style={{fontSize:"50px", color:"#f49f3c",cursor:"pointer"}} onClick={() => OnSubmit()}/>
                  <FontAwesomeIcon icon={faChevronCircleLeft} style={{fontSize:"40px", color:"#f49f3c",cursor:"pointer", marginTop:"10%"}} onClick={() => OnRemove()}/>
                ):(
                  <FontAwesomeIcon icon={faChevronCircleLeft} style={{fontSize:"40px", marginTop:"10%"}} />
                )
              }
            </div>


          </div>
          <div className="col-md-5 mt-2">
          <div className={'dx-card'} style={{padding:"20px", borderRadius:"15px"}}>
          <h6 className='title'>Usuarios asignados a: {
              AssingTo != "" ? (
                <span>{AssingTo}</span>
              ) : ""
            }</h6>

           
            <DataGrid
              className="tabla-user"
              dataSource={UsuariosAsignadosFinalDB}
              showBorders={true}
              remoteOperations={true}
              onOptionChanged={(e) => handleOptionChangeAsignados(e)}
              // focusedRowEnabled={true}
              defaultFocusedRowIndex={0}
              style={{ height: "350px", width: "100%" }}
              keyExpr="uid"
              wordWrapEnabled={true}
              paginate={false}
              paging={false}
              // columnAutoWidth={true}
            >
              <FilterRow visible={true} />
              <LoadPanel enabled />
              <Scrolling
                useNative={false}
                scrollByContent={true}
                scrollByThumb={true}
                showScrollbar="onHover" />
      

              <Selection mode="multiple"/>
              <HeaderFilter visible={true} />

              <Column
                caption="Cédula"
                dataField="cedula"
                dataType="string"
              />
              <Column
              width={200}
                caption="Nombre"
                dataField="nombre"
                dataType="string"
              />

              <Column 
                caption=""
                allowSorting={false}
                cellRender={cellRender}
              />
            </DataGrid>
          </div>
          </div>
      </div>

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
            <h6 className='title'>¿Seguro que desea eliminar esta asignación?</h6>
            <p className='texto'>Esta acción no puede revertirse</p>
            <div className="d-flex text-center col-md-12 button_popup">
              <Button onClick={deleteUser} className="btn btn-outline-primary p-3 texto">Sí, eliminar</Button>
              <Button onClick={hideDeletePopup} className="btn btn-outline-secondary p-3 texto">Cancelar</Button>
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
  );
}

export default AssignmentUser2;

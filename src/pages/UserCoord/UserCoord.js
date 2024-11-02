import React, { useState, useEffect } from "react";

import { Popup, ToolbarItem } from "devextreme-react/popup";
import { Item, SelectBox } from "devextreme-react/select-box";
import { NumberBox } from 'devextreme-react/number-box';
import ScrollView from "devextreme-react/scroll-view";
import { CheckBox } from 'devextreme-react/check-box';
import { TextArea } from "devextreme-react/text-area"; // No eliminar, sin esto no funciona el input textarea aunque no se use la variable
import { Button } from "devextreme-react/button";
import TextBox from 'devextreme-react/text-box';
import { Toast } from "devextreme-react/toast";
import TagBox from 'devextreme-react/tag-box';
import List from 'devextreme-react/list';

import './UserCoord.scss';
// import home from '../../assets/logosMenu/casa.svg';

//Iconos
import { Display, ExclamationDiamond, FileX } from "react-bootstrap-icons";

//Service
//import * as ListUser from "../../api/ListUsercoord";
import * as ListUser from "../../api/ListUser";
import * as ReportsService from '../../api/reports';
import * as DinamicQueries from '../../api/DinamicsQuery';

import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';
import CellRenderIconsGrids from '../../components/Grids/icons-grid/icons-grid';

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
  Label,
} from "devextreme-react/form";

function User() {
  const [showPopup, setShowPopup] = useState(false);
  const [User, setUser] = useState([]);
  const [msgPopup, setMsgPopup] = useState("Agregar Usuario");
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [selectedIdUser, setSelectedIdUser] = useState();
  const [nombre, setnombre] = useState();
  const [nacionalidad, setnacionalidad] = useState();
  const [cliente, setcliente] = useState();
  const [apellido, setapellido] = useState();
  const [region, setregion] = useState();
  const [cedula, setcedula] = useState();

  // Nuevas variables 
  const [modulos, setAccesos] = useState([]);
  const [Roles, setRoles] = useState([]);
  const [Clientes, setClientes] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [selectedItemKeys, setselectedItemKeys] = useState([]);
  const [usuariosAsignadosDelete, setusuariosAsignadosDelete] = useState([]);
  const [isSuperAdmin, setisSuperAdmin] = useState(false);
  const initialState = {
    cliente:"",
    rol:"",
    nacionalidadData: [
      {
        Value: "V",
        Name: "V",
      },
      {
        Value: "E",
        Name: "E",
      },
    ],
    nacionalidad:"",
    cedula: "",
    nombre: "",
    apellido: "",
    cliente: "",
    region: "",
    email: "",
    password: "",
    paginaInicio: "/formularios",
    estatus: false,
    superAdmin: false,
    uid:null,
    formularios:""
  };
  const [DataRoles, setDataRoles] = useState(initialState);
  const [EnablePassword, setEnablePassword] = useState(true);
  const [Formularios, setFormularios] = useState([]);
  const [Menuroles, setMenuroles] = useState([]);
  //******************** */

  // const [columnsGrid, setColumnsGrid] = useState([]);
  const allowedPageSizes = [8, 12, 20];
  const validationMsg = "Este campo es requerido";
  const NewUser = {
    nacionalidad: [
      {
        Value: "V",
        Name: "V",
      },
      {
        Value: "E",
        Name: "E",
      },
    ],
    cedula: "",
    nombre: "",
    apellido: "",
    cliente: "",
    region: "",
    email: "",
    password: "",
    estatus: false,
    menu:[]
  };

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem("userData"))
    setregion(userData.region);
    setisSuperAdmin(userData.superAdmin)

    getAllUser()
    // get clients
    ReportsService.getClients()
    .then(resp=>{
      DinamicQueries.getData('getRoles', "roles/")
      .then(respRoles=>{
        DinamicQueries.getData('getRegion', "regiones/")
        .then(respRegion=>{
          DinamicQueries.getData('getAcceso', "acceso/")
              .then(respAcceso => {
              setRoles(respRoles.data)
              setClientes(resp.data)
              setRegiones(respRegion.data)
              var datamodulos;
              console.log(userData.superAdmin)
              if(!userData.superAdmin){
                datamodulos = respAcceso.data.filter((item) => item.sort !== 25);
                datamodulos = datamodulos.filter((item) => item.sort !== 26);
              }
              else datamodulos = respAcceso.data
              setAccesos(datamodulos)
              
            })
        })
      })
    })
  }, []);

  const openPopup = () => {
    setEnablePassword(true)
    setShowPopup(true);
  };

  const hidePopup = () => {
    setShowPopup(false);
    // setDataRoles(initialState)
    setMsgPopup("Agregar Usuario");
    // clearModal()
  };


  
  const openDeletePopup = (uid) =>{

    console.log(uid)
    console.log(User)
    let allUser = [...User]
    let usuariosDelete = []
    for (let i = 0; i < allUser.length; i++) {
      if (allUser[i].asignados != undefined){
        for (let j = 0; j < allUser[i].asignados.length; j++) {
          if (allUser[i].asignados[j].uid == uid){
            allUser[i].asignados[j].estatus = false
            usuariosDelete.push(allUser[i])
          }
        }
      }
    }

    console.log(usuariosDelete)
    setusuariosAsignadosDelete(usuariosDelete)
    setShowPopupDelete(true);
    setSelectedIdUser(uid);
  }

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const cellRender = (data) => {
    return <div className='d-flex icons_grid'>
      <i className="dx-icon-edit" onClick={()=>editClient(data.data)}></i>
      <i className="dx-icon-trash" onClick={()=>openDeletePopup(data.data)}></i>
    </div>;
  }


  function saveUser(e) {
    let menu = []
    DataRoles.roles.forEach(items => {
      modulos.forEach(cadaModule => {
        if (items == cadaModule.text) {
          menu.push(cadaModule)
        }
      })
    })

    setDataRoles({ ...DataRoles, menu: menu })

    let dataUser = DataRoles
    dataUser.menu = menu

    console.log(dataUser)
    console.log(DataRoles)
    console.log(menu)

    let valores = Object.values(dataUser);
    let keys = Object.keys(dataUser);
    for (let i = 0; i < valores.length; i++) {
      if (valores[i] === undefined || valores[i] === "" || valores[i] === null) {
        if (keys[i] != "rol" && keys[i] != "uid") {
          setToastConfig({
            ...toastConfig,
            type: "warning",
            message: "No puede dejar campos vacios",
            isVisible: true,
          });
          return
        }
      }
    }
    let PathInicio = false
    dataUser.menu.forEach(cadaItem => {
      if (cadaItem.path == dataUser.paginaInicio) {
        PathInicio = true
      }
    })

    if (!PathInicio) {
      setToastConfig({
        ...toastConfig,
        type: "warning",
        message: "Pagina inicio no es igual a ningun modulo",
        isVisible: true,
      });
      return
    }


    dataUser.menu.sort(function (a, b) {
      if (a.sort > b.sort) {
        return 1;
      }
      if (a.sort < b.sort) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    console.log(dataUser)
    let allUser = [...User]
    // let usuariosDelete = []

    if (dataUser.activado == true || dataUser.activado == "Activo" || dataUser.activado == "activo") {
      // for (let i = 0; i < allUser.length; i++) {
      //   if (allUser[i].asignados != undefined) {
      //     for (let j = 0; j < allUser[i].asignados.length; j++) {
      //       if (allUser[i].asignados[j].uid == dataUser.uid) {
      //         allUser[i].asignados[j].activado = true
      //         usuariosDelete.push(allUser[i])
      //       }
      //     }
      //   }
      // }
    } else {
      for (let i = 0; i < allUser.length; i++) {
        // if (allUser[i].asignados != undefined) {
        //   for (let j = 0; j < allUser[i].asignados.length; j++) {
        //     if (allUser[i].asignados[j].uid == dataUser.uid) {
        //       allUser[i].asignados[j].activado = false
        //       usuariosDelete.push(allUser[i])
        //     }
        //   }
        // }
      }
    }
    console.log(dataUser)
    
    
    ListUser.createUpdateUser(dataUser)
    .then((data) => {
      if (data.status === 200) {
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Guardado Exitosamente!",
          isVisible: true,
        });
        
        hidePopup();
        setTimeout(() => {
          getAllUser()
        }, 2000);

        const userData = JSON.parse(localStorage.getItem("userData"))
        if (dataUser.cedula == userData.cedula) {
          ListUser.getaByCedula(dataUser.cedula)
          .then(respuser => {
            console.log(respuser)
            if (respuser.data.length === 0) {
              localStorage.setItem('userData', JSON.stringify(respuser))
            }
          })
        }
      }
    })
    // .catch((err) => {
    //   console.log('estoy aqui??')
    //   setToastConfig({
    //     ...toastConfig,
    //     type: "error",
    //     message: err.message,
    //     isVisible: true,
    //   });
    //   setDataRoles(initialState)
    //   hidePopup();
    // });
  }

  const saveButtonOptions = {
    icon: "check",
    text: "Guardar",
    onClick: saveUser,
  };

  const deleteUser = () =>{
    console.log("Aqui")
    console.log(usuariosAsignadosDelete)
    console.log(selectedIdUser)

    if (usuariosAsignadosDelete.length > 0){
      let contador = 0
      usuariosAsignadosDelete.forEach(x => {
        ListUser.updateUserDeleted(x)
        .then((data) => {
          contador++
          if (contador == usuariosAsignadosDelete.length) {
            ListUser.deleteUser(selectedIdUser).then((response)=>{
              setToastConfig({
                ...toastConfig,
                type: 'success',
                message: 'Usuario Eliminado exitosamente',
                isVisible: true,
              });
              hideDeletePopup();
              getAllUser();
            }).catch((err)=>{
              getAllUser()
              hideDeletePopup();
            })
          }
        })
        .catch((err) => {
          // setToastConfig({
          //   ...toastConfig,
          //   type: "error",
          //   message: err.message,
          //   isVisible: true,
          // });
          // setDataRoles(initialState)
          // setselectedItemKeys([])
          // hidePopup();
        });
      })
    } else {
      ListUser.deleteUser(selectedIdUser).then((response)=>{
        setToastConfig({
          ...toastConfig,
          type: 'success',
          message: 'Usuario Eliminado exitosamente',
          isVisible: true,
        });
        hideDeletePopup();
        getAllUser();
      }).catch((err)=>{
        getAllUser();
        hideDeletePopup();
      })
    }
  }


  
  const getAllUser = () => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    //ListUser.GetUsercoord(userData.region).then((data)=>{
    ListUser.getDataUser().then((data) => {
      if(data.status === 200){
        setUser(data.data);
        // getColumns(data.data);
      }else{
      }
    }).catch((err)=>{ 
      setToastConfig({
        ...toastConfig,
        type: 'error',
        message: err.message,
        isVisible: true,
      });
    })
  }

  /*const editClient = (user) =>{
    setEnablePassword(false)
    user.estatus = user.estatus === 'activo' || user.estatus === true || user.estatus === 'Activo' ? true : false;
    user.superAdmin = user.superAdmin == true ? true : false;
    setFormularios(user.formularios);
    const initialState = {
      cliente:user.cliente,
      rol:user.perfil,
      nacionalidadData: [
        {
          Value: "V",
          Name: "V",
        },
        {
          Value: "E",
          Name: "E",
        },
      ],
      nacionalidad:user.nacionalidad,
      cedula: user.cedula,
      nombre: user.nombre,
      apellido: user.apellido,
      region: user.region,
      email: user.email,
      paginaInicio: user.paginaInicio,
      estatus: user.estatus,
      superAdmin:user.superAdmin,
      uid:user.uid,
      formularios: user.formularios
    };
    setDataRoles(initialState)

    if (user.menu != undefined) {
      const dataMenu = user.menu.map( x=> {
        return x.text
      })
      setTimeout(() => {
        setselectedItemKeys(dataMenu)
      }, 1000);
    }
    setMsgPopup('Editar Status usuario')
    setShowPopup(true);
  }*/
  const editClient = (userid) => {
    console.log(userid)
    ListUser.getaByKey(userid.key)
    .then(resp=>{
      console.log(resp?.data)
      if (resp?.data){
        const dataUser = resp?.data
        setEnablePassword(false)
        dataUser.activado = dataUser.activado === 'activo' || dataUser.activado === true || dataUser.activado === 'Activo' ? true : false;
        dataUser.superAdmin = dataUser.superAdmin == true ? true : false;
        // const initialState = ;
        setDataRoles({
          cliente: dataUser.cliente,
          rol: dataUser.perfil,
          nacionalidadData: [
            {
              Value: "V",
              Name: "V",
            },
            {
              Value: "E",
              Name: "E",
            },
          ],
          nacionalidad: dataUser.nacionalidad,
          cedula: dataUser.cedula,
          nombre: dataUser.nombre,
          apellido: dataUser.apellido,
          region: dataUser.region,
          email: dataUser.email,
          paginaInicio: dataUser.paginaInicio,
          activado: dataUser.activado,
          superAdmin: dataUser.superAdmin,
          uid: dataUser.uid,
          roles:dataUser.menu != undefined ? dataUser.menu.map((x)=>{return x.text}) : [],
        })
        setMenuroles(dataUser.menu != undefined ? dataUser.menu.map((x)=>{return x.text}) : [])
        if (dataUser.menu != undefined) {
          const dataMenu = dataUser.menu.map(x => {
            return x.text
          })
        }
        setMsgPopup('Editar usuario')
        setShowPopup(true);
      } else {
        setToastConfig({
          ...toastConfig,
          type: 'error',
          message: "Se encontro un error",
          isVisible: true,
        });
      }
    })



  }

  const setRolesFunction = (e) => {
    if (e !== undefined && e !== null) {
      let menu_asig=[];
      Roles.forEach(cadaRol=>{
        if (e.value == cadaRol.nombre){
          const data = cadaRol.menu.map(x=>{
            menu_asig.push(x.text)
            return x.text
          })
          
        }
      })
      //setDataRoles({ ...DataRoles, paginaInicio: "/home" })
      setDataRoles({ ...DataRoles, roles: menu_asig })
      setDataRoles({ ...DataRoles, rol: e.value })
      setMenuroles(menu_asig)
    }
  }
  const setRolesdef = (e) => {
    setDataRoles({ ...DataRoles, roles: e })
    setMenuroles(e)
  }
  
  const modulos_old = [
    {
      sort:1,
      text: 'Inicio',
      path: '/home',
      icon: "home"
    },
    {
      sort:2,
      text: 'Perfil',
      path: '/profile',
      icon: 'user'
    },
    {
      sort:3,
      text: 'Clientes',
      path: '/clientes',
      icon: 'user'
    },
    {
      sort:4,
      text: 'Establecimientos',
      path: '/establecimientos',
      icon: 'home'
    },
    {
      sort:5,
      text: 'Formularios',
      path: '/formularios',
      icon: 'textdocument'
    },
    {
      sort:6,
      text: 'Regiones',
      path: '/regiones',
      icon: 'globe'
    },
    // {
    //   sort:7,
    //   text: 'Cuenta Bancaria',
    //   path: '/cuentaBancaria',
    //   icon: 'money'
    // },
    {
      sort:7,
      text: 'Pre-registro',
      path: '/PreRegister',
      icon: 'card'
    },
    {
      sort:8,
      text: 'Usuarios',
      path: '/User',
      icon: 'group'
    },
    {
      sort:9,
      text: 'Asignar Usuarios',
      path: '/AsignacionUsuarios',
      icon: 'file'
    },
    {
      sort:10,
      text: 'Asignar establecimientos',
      path: '/AsignacionEstablecimiento',
      icon: 'file'
    },
    {
      sort:11,
      text: 'Reportes',
      path: '/reportes',
      icon: 'textdocument'
    },
    {
      sort:12,
      text: 'Reportes Especiales',
      path: '/specialreport',
      icon: 'file'
    },
    {
      sort:13,
      text: 'Ordenes de Compra',
      path: '/ordenesCompra',
      icon: 'textdocument'
    },
    {
      sort:14,
      text: 'Registro Fotografico',
      path: '/registroFotografico',
      icon: 'image'
    },
    {
      sort:15,
      text: 'Seguimiento',
      path: '/Seguimiento',
      icon: 'map'
    },
    {
      sort:16,
      text: 'Consultas',
      path: '/gridSync',
      icon: 'file'
    },
    {
      sort:17,
      text: 'Consultas Ventas',
      path: '/gridSyncVentas',
      icon: 'file'
    },
    {
      sort:18,
      text: 'Lista Usuarios',
      path: '/UserCoord',
      icon: 'group'
    },
    {
      sort:19,
      text: 'Establecimientos Nuevo',
      path: '/establecimientosNuevos',
      icon: 'home'
    },
    {
      sort:20,
      text: 'Asigancion Nuevos Establecimientos',
      path: '/AsignNewestablishments',
      icon: 'group'
    },
    {
      sort: 21,
      text: 'Activación',
      path: '/activacion',
      icon: 'file'
    }
  ];
  
  const onSelectedItemKeysChange = (event) => {
    const data = event.map(x=>{
      return x.text
    })
    setselectedItemKeys(data)
  }

  const SelectInitialPage = (item) => {
    return (
      <div style={{display: "flex" }}>
        {/* <p>hola</p> */}
        {/* <img src={item.ImageSrc} /> */}
        <div style={{marginTop: "8px"}}>{item.text}</div>
        {/* <div className="price">{currencyFormatter.format(item.Price)}</div> */}
        {/* <div style={{marginLeft : "2%"}}>
          <Button icon="home" stylingMode="text" onClick={() => setDataRoles({...DataRoles,  paginaInicio:item.path})} hint="Marcar como pagina de inicio"/>
        </div> */}
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="d-flex mt-2">
        <div className="header-grid-title">
          <h5 className="content-block titleCliente">Lista Usuarios</h5>
        </div>
        {
          isSuperAdmin && (
            <div className="header-grid-right" hidden>
              <Button onClick={openPopup} className="btn-agregar mt-3">
              + Crear Usuario
              </Button>
            </div>
          )
        }
      </div>

      {/* <div className={'content-block'}> */}
      <div className="tabla-Cliente">
        {/* <DynamicGrid dataSource={clients} columns={columnsGrid}></DynamicGrid> */}
        <DataGrid
          className="tabla-Cliente"
          dataSource={User}
          showBorders={true}
          remoteOperations={true}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          style={{ height: "430px", width: "100%" }}
          keyExpr="key"
          wordWrapEnabled={true}
        >
          <Export enabled={true} />
          <ColumnChooser
              enabled={true}
              mode="select" 
          />
          <FilterRow visible={true} />
          <Paging defaultPageSize={12} />
          <Pager
            showPageSizeSelector={true}
            allowedPageSizes={allowedPageSizes}
          />
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
            width={340}
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
            caption="Estatus"
            dataField="estatus"
            dataType="string"
            cellRender={CellRenderEstatus}
          />

          <Column
            width={140}
            caption="Version app"
            dataField="version_app"
            dataType="string"
          />

            
          <Column
            width={80}
            caption=""
            allowSorting={false}
            cellRender={(data)=> CellRenderIconsGrids(data, editClient, openDeletePopup)}
          />
            
        </DataGrid>
      </div>
      {/* </div> */}
      <Popup
        width={"100%"}
        height={"100%"}
        visible={showPopup}
        onHiding={hidePopup}
        showTitle={true}
        title={msgPopup}
        showCloseButton={true}
        fullScreen={true}
        
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={saveButtonOptions}
        />
        <ScrollView width="100%" height="100%">
        {/* <div style={{height:"100%", width:"100%"}}> */}
          <Form className="form-container" style={{height:"100%"}}>
            <GroupItem colCount={2} style={{height:"100%"}}>
              <Item>
                <Label>Nombre</Label>
                <TextBox
                  showClearButton={true}
                  placeholder="Ingrese el nombre"
                  valueChangeEvent="keyup"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, nombre: e.value })}
                  value={DataRoles.nombre} 
                  readOnly={true}/>
              </Item>
              <Item>
                <Label>Apellido</Label>
                <TextBox
                  showClearButton={true}
                  placeholder="Ingrese el apellido"
                  valueChangeEvent="keyup"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, apellido: e.value })}
                  value={DataRoles.apellido}
                  readOnly={true}
                />
              </Item>
              <Item>
                <Label>Nacionalidad</Label>
                <SelectBox
                  dataSource={DataRoles.nacionalidadData}
                  valueExpr="Value"
                  displayExpr="Name"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, nacionalidad: e.value })}
                  value={DataRoles.nacionalidad}
                  readOnly={true}
                />
              </Item>
              <Item>
                <Label>Cedula</Label>
                <NumberBox
                  showClearButton={true}
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, cedula: e.value })}
                  value={DataRoles.cedula}
                  readOnly={true}
                />
              </Item>
              <Item>
                <Label>Email</Label>
                <TextBox
                  showClearButton={true}
                  mode="email"
                  placeholder="Ingrese el email"
                  valueChangeEvent="keyup"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, email: e.value })}
                  value={DataRoles.email}
                  readOnly={true} 
                />
              </Item>

              <Item>
                <Label>Roles</Label>
                <SelectBox
                  dataSource={Roles}
                  valueExpr="nombre"
                  displayExpr="nombre"
                  onValueChanged={(e) => setRolesFunction(e)}
                  value={DataRoles.rol}
                />
              </Item>

              </GroupItem>


              <GroupItem colCount={2}>
              
                { EnablePassword == true &&
                <Item>
                  <Label>Clave</Label>
                  <TextBox mode="password"
                    placeholder="Ingrese la clave"
                    showClearButton={true}
                    onValueChanged={(e) => setDataRoles({ ...DataRoles, password: e.value })}
                    value={DataRoles.password}
                  />
                </Item>
               }

              <Item >
                  <Label>Activo</Label>
                  <CheckBox className="check" value={DataRoles.activado} onValueChanged={(e) => setDataRoles({ ...DataRoles, activado: e.value })} />
              </Item>

              <Item >
                
                  <Label>.</Label>
                <div hidden>
                  <CheckBox value={DataRoles.superAdmin} onValueChanged={(e) => setDataRoles({ ...DataRoles, superAdmin: e.value })} />
                </div>
              </Item>

              {/* <Item >
                  <Label>Activo</Label>
                  <CheckBox className="check" value={DataRoles.estatus} onValueChanged={(e) => setDataRoles({ ...DataRoles, estatus: e.value })} />

                  <Label>Super Admin</Label>
                  <CheckBox value={DataRoles.superAdmin} onValueChanged={(e) => setDataRoles({ ...DataRoles, superAdmin: e.value })} />
              </Item> */}

              


              <Item>
                <Label>Regiones</Label>
                <TagBox
                  showSelectionControls={true}
                  items={Regiones}
                  valueExpr="nombre_region"
                  displayExpr="nombre_region"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, region: e.value })}
                  value={DataRoles.region}
                />
              </Item>

              <Item>
                <Label>Pagina Inicio</Label>
                <SelectBox
                  dataSource={modulos}
                  valueExpr="path"
                  displayExpr="text"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, paginaInicio: e.value })}
                  value={DataRoles.paginaInicio}
                />
              </Item>
                
              </GroupItem>

              
              
              
            
            <GroupItem colCount={2}>
              <Item>
                <Label>Clientes</Label>
                <TagBox items={Clientes}
                  showSelectionControls={true}
                  valueExpr="nombre_cliente"
                  displayExpr="nombre_cliente"
                  onValueChanged={(e) => setDataRoles({ ...DataRoles, cliente: e.value })}
                  value={DataRoles.cliente}
                />
              </Item>
              <Item>
                <Label>Modulos</Label>
                {/* <List
                  className="list-modules"
                  dataSource={modulos}
                  width={"100%"}
                  height={300}
                  showSelectionControls={true}
                  selectionMode="all"
                  selectAllMode="page"
                  keyExpr="text"
                  selectedItemKeys={selectedItemKeys}
                  onSelectedItemsChange={onSelectedItemKeysChange}
                  value={selectedItemKeys}
                  itemRender={SelectInitialPage}
                  nextButtonText="Siguiente"
                  pageLoadMode = "scrollBottom"
                /> */}

                <TagBox
                  showSelectionControls={true}
                  items={modulos}
                  valueExpr="text"
                  displayExpr="text"
                  onValueChanged={(e) => setRolesdef(e.value)}
                  value={Menuroles}
                />
              </Item>



            </GroupItem>
          </Form>
        {/* </div> */}

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
            <ExclamationDiamond className="warning_icon" />
            <div>
              <h5>¿Seguro que desea eliminar este usuario?</h5>
              <p>Esta acción no puede revertirse</p>
            </div>
            {/* {
                usuariosAsignadosDelete.length > 0 ? (
                  
                  <div>
                      <h6>El usuario se encuentra actualmente asignado a los siguientes usuarios:</h6>
                      <p>Debe eliminar la asignacion o desactivar al usuario</p>
                    </div>
                  ):(
                    <div>
                      <h5>¿Seguro que desea eliminar este usuario?</h5>
                      <p>Esta acción no puede revertirse</p>
                    </div>
                  )
              }

              <br></br>
              {
                usuariosAsignadosDelete.length > 0 ? (
                  
                  usuariosAsignadosDelete.map(x=>{
                    return <p>{x}</p>
                  })
                  ):null
              } */}
            <div className="d-flex text-center col-md-12 button_popup">
              <Button onClick={deleteUser} className="btn btn-outline-primary">Sí, eliminar</Button>
              <Button onClick={hideDeletePopup} className="btn btn-outline-secondary">Cancelar</Button>
            </div>
          </div>
        </ScrollView>
      </Popup>
    </React.Fragment>
  );
}

export default User;

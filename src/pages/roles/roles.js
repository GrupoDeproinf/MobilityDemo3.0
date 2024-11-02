import React, { useState, useEffect } from "react";
import "./roles.scss";

import * as Roles from "../../api/Roles";
import * as DinamicQueries from '../../api/DinamicsQuery';
import { ExclamationDiamond } from "react-bootstrap-icons";

//Componentes Externos
import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';
import CellRenderIconsGrids from '../../components/Grids/icons-grid/icons-grid';

import { Toast } from "devextreme-react/toast";
import { Button } from "devextreme-react/button";
import ScrollView from "devextreme-react/scroll-view";
import { TextArea } from "devextreme-react/text-area"; // No eliminar, sin esto no funciona el input textarea aunque no se use la variable
import { Popup, ToolbarItem } from "devextreme-react/popup";
import List from 'devextreme-react/list';
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

export default function Role() {
  const [showPopup, setShowPopup] = useState(false);
  const [roles_data, setroles] = useState([]);
  const [RoleForm, setRoleForm] = useState([]);
  const [msgPopup, setMsgPopup] = useState("Agregar Roles");
  const [showPopupDelete, setShowPopupDelete] = useState(false);
  const [selectedIdRol, setselectedIdRol] = useState();
  const [selectedItemKeys, setselectedItemKeys] = useState([]);
  const [modulos, setAccesos] = useState([]);
  // const [columnsGrid, setColumnsGrid] = useState([]);
  const allowedPageSizes = [8, 12, 20];
  const validationMsg = "Este campo es requerido";
  const NewRol = {
    nombre: "",
    estatus: false,
    menu: []
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
  const modulos1 = [
    {
      sort: 1,
      text: 'Inicio',
      path: '/home',
      icon: "home"
    },
    {
      sort: 2,
      text: 'Perfil',
      path: '/profile',
      icon: 'user'
    },
    {
      sort: 3,
      text: 'Clientes',
      path: '/clientes',
      icon: 'user'
    },
    {
      sort: 4,
      text: 'Establecimientos',
      path: '/establecimientos',
      icon: 'home'
    },
    {
      sort: 5,
      text: 'Formularios',
      path: '/formularios',
      icon: 'textdocument'
    },
    {
      sort: 6,
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
      sort: 7,
      text: 'Pre-registro',
      path: '/PreRegister',
      icon: 'card'
    },
    {
      sort: 8,
      text: 'Usuarios',
      path: '/User',
      icon: 'group'
    },
    {
      sort: 9,
      text: 'Asignar Usuarios',
      path: '/AsignacionUsuarios',
      icon: 'file'
    },
    {
      sort: 10,
      text: 'Asignar establecimientos',
      path: '/AsignacionEstablecimiento',
      icon: 'file'
    },
    {
      sort: 11,
      text: 'Reportes',
      path: '/reportes',
      icon: 'textdocument'
    },
    {
      sort: 12,
      text: 'Reportes Especiales',
      path: '/specialreport',
      icon: 'file'
    },
    {
      sort: 13,
      text: 'Ordenes de Compra',
      path: '/ordenesCompra',
      icon: 'textdocument'
    },
    {
      sort: 14,
      text: 'Registro Fotografico',
      path: '/registroFotografico',
      icon: 'image'
    },
    {
      sort: 15,
      text: 'Seguimiento',
      path: '/Seguimiento',
      icon: 'map'
    },
    {
      sort: 16,
      text: 'Consultas',
      path: '/gridSync',
      icon: 'file'
    },
    {
      sort: 17,
      text: 'Consultas Ventas',
      path: '/gridSyncVentas',
      icon: 'file'
    },
    {
      sort: 18,
      text: 'Lista Usuarios',
      path: '/UserCoord',
      icon: 'group'
    },
    {
      sort: 19,
      text: 'Establecimientos Nuevo',
      path: '/establecimientosNuevos',
      icon: 'home'
    },
    {
      sort: 20,
      text: 'Asignar Establecimientos Clientes',
      path: '/AsignacionEstablecimientoClientes',
      icon: 'home'
    },
    {
      sort: 21,
      text: 'Rutas',
      path: '/AsignNewestablishments',
      icon: 'group'
    },
    {
      sort: 22,
      text: 'Preguntas Frecuentes',
      path: '/frequencyQuestions',
      icon: 'file'
    },
    {
      sort: 23,
      text: 'Descarga Reportes',
      path: '/reportspost',
      icon: 'textdocument'
    },
    {
      sort: 24,
      text: 'Activación',
      path: '/activacion',
      icon: 'file'
    }
  ];
  const onSelectedItemKeysChange = (event) => {
    const data = event.map(x => {
      return x.text
    })
    setselectedItemKeys(data)
    
  }
  const SelectInitialPage = (item) => {
    return (
      <div style={{ display: "flex" }}>
        {/* <p>hola</p> */}
        {/* <img src={item.ImageSrc} /> */}
        <div style={{ marginTop: "2px", height: "1px"}}>{item.text}</div>
        {/* <div className="price">{currencyFormatter.format(item.Price)}</div> */}
        {/* <div style={{marginLeft : "2%"}}>
          <Button icon="home" stylingMode="text" onClick={() => setDataRoles({...DataRoles,  paginaInicio:item.path})} hint="Marcar como pagina de inicio"/>
        </div> */}
      </div>
    );
  }
  useEffect(() => {
    setRoleForm({
      nombre: "",
      menu: "",
      estatus: "",
      id: "",
    });
    getAllRoles();
    DinamicQueries.getData('getAcceso', "acceso/")
      .then(respAcceso => {

        setAccesos(respAcceso.data)
        
      })
  }, []);

  const getAllRoles = () => {
    Roles.getRoles()
      .then((data) => {
        console.log(data);
        // setRoleForm(data.data);

        if (data.status === 200) {
          let NewData = [];
          
          Array.prototype.forEach.call(data.data, (items) => {
            if (items.estatus === "activo") {
              
              const data = items.menu.map(x => {
                return x.text
              })
              setselectedItemKeys(data)
              items={ ...items, roles_c: data }
              NewData.push(items);
            }
            //NewData.push(items);
            setroles(NewData);
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
    setselectedItemKeys([]);
  };

  const hidePopup = () => {
    console.log("Cerré popup");
    setShowPopup(false);
    setRoleForm({
      nombre: "",
      menu: "",
            
    });
    setselectedItemKeys([])
    setMsgPopup("Agregar Rol");
  };

  const saveRoles = () => {
    console.log(RoleForm);
    RoleForm.estatus =
      RoleForm.estatus === false ? "inactivo" : "activo";
      let menu = []
    selectedItemKeys.forEach(items => {
      modulos.forEach(cadaModule => {
        if (items == cadaModule.text) {
          menu.push(cadaModule)
        }
      })
    })
    console.log(RoleForm)
      let NewRol = RoleForm
      NewRol.menu = menu
      
      Roles.createUpdateRoles(NewRol)
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
          getAllRoles();
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
  const editRoles = (Role) => {
    openPopup();
    console.log("Edit ", Role);
    // Role.estatus = Role.estatus === "activo" ? true : false;
    setRoleForm(Role);
    const data = Role.menu.map(x => {
      return x.text
    })
    setselectedItemKeys(data)
    setMsgPopup("Editar Rol");
  };

  const openDeletePopup = (id) => {
    setShowPopupDelete(true);
    setselectedIdRol(id);
  };

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  };

  const deleteAcces = () => {
    console.log("Delete ", selectedIdRol);

    Roles.deleteAcces(selectedIdRol)
      .then((response) => {
        console.log(response);
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "Acceso Eliminado exitosamente",
          isVisible: true,
        });

        getAllRoles();
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
    setselectedIdRol(null);
    hideDeletePopup();
  };

  const saveButtonOptions = {
    icon: "check",
    text: "Guardar",
    onClick: saveRoles,
  };

  const cellRender = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i className="dx-icon-edit" onClick={() => editRoles(data.data)}></i>
        <i className="dx-icon-trash" onClick={() => openDeletePopup(data.data.id)}></i>
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={"d-flex"}>
        <div style={{ width: "80%" }}>
          <h5 className={"content-block titleCliente"}>Roles</h5>
        </div>
        <div style={{ width: "20%" }}>
          <Button onClick={openPopup} className="btn-agregar mt-3 mb-2">
            + Nuevo Rol
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
          dataSource={roles_data}
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
            dataField="nombre"
            dataType="string"
          />
          <Column
            caption="Modulos"
            dataField="roles_c"
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
            cellRender={(data)=> CellRenderIconsGrids(data, editRoles, openDeletePopup)}
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
            <Form formData={RoleForm}>
              <GroupItem cssClass="second-group" colCount={2}>
                <GroupItem>
                  <SimpleItem dataField="nombre">
                    <RequiredRule message={validationMsg} />
                  </SimpleItem>
                  <SimpleItem
                    editorType="dxCheckBox"
                    dataField="estatus"
                  ></SimpleItem>
                </GroupItem>
                <GroupItem>
                  <List
                  className="list-modules"
                  dataSource={modulos}
                  width={"100%"}
                  height={200}
                  showSelectionControls={true}
                  selectionMode="all"
                  selectAllMode="page"
                  keyExpr="text"
                  selectedItemKeys={selectedItemKeys}
                  onSelectedItemsChange={onSelectedItemKeysChange}
                  value={selectedItemKeys}
                  itemRender={SelectInitialPage}
                />
              
                  {/* <SimpleItem dataField="id" none>
                    <RequiredRule message={validationMsg} />
                  </SimpleItem> */}
                  
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
        title="Eliminar rol"
        showCloseButton={true}
        
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>¿Seguro que desea eliminar este rol?</h5>
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

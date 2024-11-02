import React, { useState, useEffect } from 'react';
import './clients.scss';

//Services
import * as ClientService from '../../api/clients';

//Iconos
import { ExclamationDiamond } from 'react-bootstrap-icons';

//Components
import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';
import CellRenderIconsGrids from '../../components/Grids/icons-grid/icons-grid';

//Items DevExpress
import { Toast } from 'devextreme-react/toast';
import { Button } from "devextreme-react/button";
import { TextArea } from 'devextreme-react/text-area'; // No eliminar, sin esto no funciona el input textarea aunque no se use la variable
import ScrollView from 'devextreme-react/scroll-view';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

import DataGrid, {
  Pager,
  Paging,
  Column,
  FilterRow,
  HeaderFilter, 
  StateStoring,
  ColumnChooser,
  Export
} from 'devextreme-react/data-grid';

import Form, {
  SimpleItem,
  GroupItem,
  RequiredRule,
} from 'devextreme-react/form';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [clientForm, setClientForm] = useState({})
  const [showPopup, setShowPopup] = useState(false);
  const [selectedIdClient, setSelectedIdClient] = useState();
  const [msgPopup, setMsgPopup] = useState('Agregar Cliente');
  const [showPopupDelete, setShowPopupDelete] = useState(false);

  const allowedPageSizes = [8, 12, 20];
  const validationMsg = 'Este campo es requerido';

  const [toastConfig, setToastConfig] = React.useState({
    isVisible: false,
    type: 'success',
    message: 'Guardado Exitosamente',
    displayTime: 2000,
  }, []);

  useEffect(()=>{
    console.log('AQUIII ')
    setClientForm({
      id: 0,
      nombre_cliente: '',
      rif: '',
      estatus: false,
      descripcion: '',
      cod_cliente: ''
    })
    getAllClients();
  }, [])

  const getAllClients = () => {
    ClientService.getClients().then((data)=>{
      console.log(data);
      if(data.status === 200){
        console.log(data.data)
        setClients(data.data);
      }else{
        console.log('Error')
      }
    }).catch((err)=>{ 
      console.log(err) 
      setToastConfig({
        ...toastConfig,
        type: 'error',
        message: err.message,
        isVisible: true,
      });
    })
  }

  // const getColumns = (data) => {
  //   let newColumns = [];

  //   const columns = Object.keys(data);
  //   columns.forEach(column => {
  //     let newCaption = column.split('_');
  //     let caption = '';
  //     newCaption.map(x=>{
  //       caption = caption + x.charAt(0).toUpperCase() + x.slice(1) + ' ';
  //     })
      
  //     const item = {
  //       field: column,
  //       caption: caption,
  //     }
  //     newColumns.push(item);
  //   })
  //   console.log(columns);
  //   console.log(newColumns);
  //   setColumnsGrid(newColumns);
  // }

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }

  const openPopup = () =>{ 
    setShowPopup(true); 
  }

  const hidePopup = () => {
    console.log('Cerré popup');
    setShowPopup(false);
    setClientForm({
      id: 0,
      nombre_cliente: '',
      rif: '',
      estatus: false,
      descripcion: '',
      cod_cliente: ''
    })
    setMsgPopup('Agregar Cliente');
  }

  const saveClient = () => {
    let form = clientForm;
    form.cod_cliente = Math.random() * 2;
    form.estatus = form.estatus === false ? 'inactivo' : 'activo';
    console.log(form);
    ClientService.createUpdateClient(form).then((data)=>{
      console.log(data);
      if(data.status === 200){
        setToastConfig({
          ...toastConfig,
          type: 'success',
          message: '¡Guardado Exitosamente!',
          isVisible: true,
        });
        hidePopup();
        getAllClients();
      }else{
        console.log('Error')
      }
    }).catch((err)=>{ 
      console.log(err) 
      
      setToastConfig({
        ...toastConfig,
        type: 'error',
        message: err.message,
        isVisible: true,
        displayTime: 9000,
      });
    })
  }

  const editClient = (client) =>{
    console.log('Edit ', client)
    client.estatus = client.estatus === 'activo' ? true : false;
    setClientForm(client);
    setMsgPopup('Editar Cliente')
    openPopup();
  }

  const openDeletePopup = (id) =>{
    setShowPopupDelete(true);
    console.log(id)
    setSelectedIdClient(id);
  }

  const hideDeletePopup = () => {
    setShowPopupDelete(false);
  }

  const deleteClient = () =>{
    console.log('Delete ', selectedIdClient);

    ClientService.deleteClient(selectedIdClient).then((response)=>{
      console.log(response)
      setToastConfig({
        ...toastConfig,
        type: 'success',
        message: 'Cliente Eliminado exitosamente',
        isVisible: true,
      });
      
      getAllClients();

    }).catch((err)=>{
      console.log(err);

      setToastConfig({
        ...toastConfig,
        type: 'error',
        message: err.message,
        isVisible: true,
      });
    })

    console.log(toastConfig);
    setSelectedIdClient(null);
    hideDeletePopup();
  }

  const saveButtonOptions = {
    icon: 'check',
    text: 'Guardar',
    onClick: saveClient,
  };

  // const cellRender = (data) => {
  //   return <div className='d-flex icons_grid'>
  //     <FontAwesomeIcon icon={faPencil} className="icon" onClick={()=>editClient(data.data)}></FontAwesomeIcon>
  //     <FontAwesomeIcon icon={faTrashCan} className="icon" onClick={()=>openDeletePopup(data.data.id)}></FontAwesomeIcon>
  //   </div>;
  // }

  const cellRenderDescription = (data) =>{
    return <p style={{whiteSpace: 'normal'}}>{data.data.descripcion}</p>
  }

  // const cellRenderEstatus = (data) =>{
  //   let value = data.data.estatus == 'activo' ? true : false;
  //   // return <CheckBox defaultValue={value} disabled={true}  onValueChanged={(e) => { onValueStatusChanged(e, data.data) }} />
  //   return <FontAwesomeIcon icon={faCircleCheck} className="icon-status"></FontAwesomeIcon>
  // }

  // const onValueStatusChanged = (e, data) => {
  //   data.estatus = e.value;
  //   saveClient(data);
  // }

  return (
    <React.Fragment>
      <div className="d-flex mt-4 mb-4">
        <div className="header-grid-title">
          <h5 className='content-block titleCliente'>Clientes</h5>
        </div>
        <div className="header-grid-right">
          <Button onClick={openPopup} className="btn-agregar mt-4"> + Crear Cliente</Button>
        </div>
      </div> 
        <div className='tabla-Cliente'>
          <DataGrid
            className='tabla-Cliente'
            dataSource={clients}
            showBorders={true}
            remoteOperations={true}
            focusedRowEnabled={true}
            keyExpr="nombre_cliente"
            style={{height: '400px'}}
          >
            <Export enabled={true} />
            <ColumnChooser
                enabled={true}
                mode="select" 
            />
            <FilterRow visible={true} />
            <Paging defaultPageSize={10} />
            <Pager
              showPageSizeSelector={true}
              showInfo={true}
              allowedPageSizes={allowedPageSizes}
            />
            <HeaderFilter visible={true} />
            <Column
              width={150}
              caption="Rif "
              dataField="rif"
              dataType="string"
              sortOrder="asc"
            />
            <Column
              caption="Nombre"
              dataField="nombre_cliente"
              dataType="string"
            />
            <Column
              width={140}
              caption="Estatus "
              dataField="estatus"
              dataType="string"
              alignment='center'
              cellRender={CellRenderEstatus}
            />
            <Column
              width={250}
              caption="Descripción"
              dataField="descripcion"
              dataType="string"
              cellRender={cellRenderDescription}
            />
            <Column
              width={80}
              caption=""
              allowSorting={false}
              cellRender={(data)=> CellRenderIconsGrids(data, editClient, openDeletePopup)}
            />
          </DataGrid>
        </div>
      <Popup
          width={'50%'}
          height={'55%'}
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
          <ScrollView width='100%' height='100%'>
            <div className="form-container">
              <Form formData={clientForm}>
                <GroupItem cssClass="second-group" colCount={2}>
                    <SimpleItem dataField="nombre_cliente"> 
                      <RequiredRule message={validationMsg} />
                    </SimpleItem>
                    <SimpleItem dataField="rif" >
                      <RequiredRule message={validationMsg} />
                    </SimpleItem>
                </GroupItem>
                <GroupItem>
                    <SimpleItem editorType="dxTextArea" dataField="descripcion">
                    </SimpleItem>
                    <SimpleItem
                      editorType="dxCheckBox" 
                      dataField="estatus">
                    </SimpleItem>
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
          width={'50%'}
          height={'50%'}
          visible={showPopupDelete}
          onHiding={hideDeletePopup}
          showTitle={true}
          title='Eliminar Cliente'
          showCloseButton={true}
          >
          <ScrollView width='100%' height='100%'>
            <div className="form-container text-center">
              <ExclamationDiamond className='warning_icon'/>
              <h5>¿Seguro que desea eliminar este cliente?</h5>
              <p>Esta acción no puede revertirse</p>
              <div className='d-flex text-center col-md-12 button_popup'>
                <Button onClick={deleteClient} className="btn btn-outline-primary">Sí, eliminar</Button>
                <Button onClick={hideDeletePopup} className="btn btn-outline-secondary">Cancelar</Button>
              </div>
            </div>
          </ScrollView>
      </Popup>
    </React.Fragment>
)}

import React, { useState, useEffect } from 'react';

//Elementos DevExpress
import { Toast } from 'devextreme-react/toast';
import { Popup } from "devextreme-react/popup";
import { Button, DateBox } from 'devextreme-react';
import ScrollView from "devextreme-react/scroll-view";
import { SelectBox } from 'devextreme-react/select-box';
import DataGrid, {
  Pager,
  Column,
  Paging,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
} from "devextreme-react/data-grid";

//componente de mapa
import ActivationsMap from './widgets/activationsMap';

//Llamados a la api
import * as DinamicQueries from '../../api/DinamicsQuery';

//CSS
import './Activation.scss';
import moment from 'moment';

export default function Activation() {
  const [ActivationData, setActivationData] = useState([]);
  const [Clientes, setClientes] = useState([]);
  const [Cliente, setCliente] = useState('');
  const [Regiones, setRegiones] = useState([]);
  const [Region, setRegion] = useState('');
  const [Fecha, setFecha] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [coordenadas, setCoordenadas] = useState([]);
  const [toastConfig, setToastConfig] = React.useState({
    isVisible: false,
    type: 'error',
    message: 'No se han encontrado registros con los parámetros seleccionados',
    displayTime: 3000,
  }, []);

  const allowedPageSizes = [30, 50, 100];

  const GetDataFilters = () => {
    DinamicQueries.getDataWithParameters('getActivationsWhitFilters', 'activacion/', { cliente: Cliente, region: Region, fecha: moment(Fecha).format('YYYY-MM-DD') })
      .then((resApi) => {
        if (resApi.data.msg) {
          setActivationData(resApi.data.data);
        } else if (!resApi.data.msg) {
          setToastConfig({
            ...toastConfig,
            isVisible: true,
          });
        }
      });
  };

  const hidePopup = () => {
    setShowPopup(false);
    setCoordenadas([]);
  };

  const openPopup = (data) => {
    const splitCoorInicio = data.coordenadasInicio.split(',');
    const splitCoorCierre = data.coordenadasCierre !== '' ? data.coordenadasCierre.split(',') : '';
    let coorFinal = [];

    const temcoordenadasInicio = {
      lat: Number(splitCoorInicio[0]),
      lng: Number(splitCoorInicio[1])
    }

    coorFinal = [...coorFinal, {coords: temcoordenadasInicio, mensaje: 'Coordenadas de inicio', hora: data.fechaInicio}]

    if(splitCoorCierre !== ''){
      const temcoordenadasCierre = {
        lat: Number(splitCoorCierre[0]),
        lng: Number(splitCoorCierre[1])
      }
      coorFinal = [...coorFinal, {coords: temcoordenadasCierre, mensaje: 'Coordenadas de cierre', hora: data.fechaCierre}]
    }

    setCoordenadas(coorFinal)
    setShowPopup(true);
  };

  const cellRenderAsignar = (data) => {
    return (
      <div className="d-flex icons_grid">
        <i
          className="dx-icon-globe"
          onClick={() => openPopup(data.data)}
        ></i>
      </div>
    );
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    setRegiones(userData.region)
    setClientes(userData.cliente)
  }, [])

  return (
    <React.Fragment>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className='my-4'>
        <h6 className={"titleEstablecimiento "}>Activación</h6>
      </div>

      <div className="row align-items-center">
        <div className="col-3">
          <SelectBox
            className='mb-2'
            dataSource={Clientes}
            searchEnabled
            onValueChanged={(e) => { setCliente(e.value) }}
            label="Seleccione un cliente"
            required
          />
        </div>

        <div className="col-3">
          <SelectBox
            className='mb-2'
            dataSource={Regiones}
            searchEnabled
            onValueChanged={(e) => { setRegion(e.value) }}
            label="Seleccione un region"
            required
          />
        </div>

        <div className="col-3">
          <DateBox
            className='mb-2'
            defaultValue={Fecha}
            type='date'
            onValueChanged={(e) => { setFecha(e.value) }}
            label="Seleccione una fecha"
          />
        </div>

        <div className="col-3">
          <Button onClick={GetDataFilters} disabled={Cliente === '' || Region === ''} className="btn-agregar" style={{ width: '100%' }}>
            Buscar
          </Button>
        </div>
      </div>

      <DataGrid
        className={"dx-card wide-card"}
        dataSource={ActivationData}
        showBorders={true}
        remoteOperations={true}
        focusedRowEnabled={true}
        keyExpr="id"
        style={{ height: "70vh" }}
        rowAlternationEnabled={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
      >
        <ColumnChooser
          enabled={true}
          mode="select"
        />
        <FilterRow visible={true} />
        <Paging defaultPageSize={30} />
        <Pager
          showPageSizeSelector={true}
          showInfo={true}
          allowedPageSizes={allowedPageSizes}
        />
        <HeaderFilter visible={true} />

        <Column
          caption={"Usuario"}
          dataField={"nombre"}
          dataType="string"
          width={250}
        />

        <Column
          caption={"Cliente"}
          dataField={"cliente"}
          width={250}
          sortOrder={"asc"}
        />

        <Column
          caption={"Región"}
          dataField={"region"}
          dataType="string"
        />

        <Column dataField={"fechaActivacion"} caption={"Fecha"} dataType="string" />

        <Column dataField={"fechaInicio"} caption={"Fecha Inicio"} dataType="string" />

        <Column dataField={"fechaCierre"} caption={"Fecha Cierre"} dataType="string" />

        <Column
          caption=""
          allowSorting={false}
          cellRender={cellRenderAsignar}
        />
      </DataGrid>

      <Popup
        width={"75%"}
        height={"85%"}
        visible={showPopup}
        onHiding={hidePopup}
        showTitle={true}
        title="Mapa Coordenadas"
        showCloseButton={true}
        
        fullScreen
      >
        <ScrollView width="100%" height="100%">
          <ActivationsMap coordenadas={coordenadas}/>
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
  )
}

import React, { useEffect, useState } from 'react';
import * as DinamicQueries from '../../api/DinamicsQuery';

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
  Search
} from "devextreme-react/data-grid";
import { Toast } from 'devextreme-react/toast';
import { Button } from "devextreme-react/button";
import { CheckBox } from 'devextreme-react/check-box';
import ScrollView from "devextreme-react/scroll-view";
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

//css
import './supervisiones.scss';
import { faImages, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Moment from "moment";

const Supervisiones = () => {
  const [usuario, setUsuario] = useState([]);
  const [Clientes, setClientes] = useState([]);
  const [Regiones, setRegiones] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showpictures, setShowpictures] = useState([]);
  const [Establecimiento, setEstablecimiento] = useState([]);
  const [respuestasForm, setRespuestasForm] = useState([]);
  const [FechaFinal, setFechaFinal] = useState(new Date());
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const [dataSupervisiones, setDataSupervisiones] = useState([]);
  const [fechaInicial, setfechaInicial] = useState(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );

  const now = new Date();
  const allowedPageSizes = [30, 50, 100];
  const InitialStateFilters = {
    cliente: '',
    region: '',
    fechaInicial: new Date(new Date().setDate(new Date().getDate() - 7)),
    fechaFinal: new Date(),
    usuarios: '',
    Establecimientos: '',
  };

  const [filters, setFilters] = useState(InitialStateFilters);

  const searchUsersAndStablishment = (e) => {
    let Establecimientos = [];
    let Usuarios = [];
    if (e.element.innerText === 'Region') {
      if (e.value != "") {
        setFilters({ ...filters, region: e.value })
        DinamicQueries.getDataWithParameters('getEstablecimientosFilter', "galeria/", { cliente: filters.cliente, region: e.value })
          .then(establecimientos => {
            Establecimientos = [{
              nombre_establecimiento: 'TODOS LOS ESTABLECIMIENTOS',
            }, ...establecimientos.data]
            setEstablecimiento(Establecimientos)
          })

        DinamicQueries.getDataWithParameters('getUserClientAndRegionAnalitycs', "usuarios/", { cliente: filters.cliente, region: e.value })
          .then(usuarios => {
            Usuarios = [{ nombre: "TODOS LOS USUARIOS", uid: "TODOS LOS USUARIOS", perfil: 'Supervisor' }, ...usuarios.data]
            const usuariosFinal = Usuarios.filter((element) => element.perfil === "Supervisor")
            setUsuario(usuariosFinal)
          })
      }
    } else if (e.element.innerText === 'Cliente') {
      if (e.value != "") {
        setFilters({ ...filters, cliente: e.value });
        DinamicQueries.getDataWithParameters('getEstablecimientosFilter', "galeria/", { cliente: e.value, region: filters.region })
          .then(establecimientos => {
            Establecimientos = [{
              nombre_establecimiento: 'TODOS LOS ESTABLECIMIENTOS',
            }, ...establecimientos.data]
            setEstablecimiento(Establecimientos)
          })

        DinamicQueries.getDataWithParameters('getUserClientAndRegionAnalitycs', "usuarios/", { cliente: e.value, region: filters.region })
          .then(usuarios => {
            Usuarios = [{ nombre: "TODOS LOS USUARIOS", uid: "TODOS LOS USUARIOS", perfil: 'Supervisor' }, ...usuarios.data]
            const usuariosFinal = Usuarios.filter((element) => element.perfil === "Supervisor")
            setUsuario(usuariosFinal)
          })
      }
    }
  };

  const clearFilters = () => {
    setFilters(InitialStateFilters);
  };

  const searchSupervisions = () => {
    const { cliente, region, fechaInicial, fechaFinal, usuarios, Establecimientos } = filters

    const fechaInicialFormat = Moment(fechaInicial).format(
      "YYYY-MM-DD"
    );

    const fechaFinalFormat = Moment(fechaFinal).format(
      "YYYY-MM-DD"
    );

    DinamicQueries.getDataWithParameters('getSupervisionData', 'supervision/', { cliente: cliente, region: region, fechaInicio: fechaInicialFormat, fechaFin: fechaFinalFormat, promotor: usuarios, establecimiento: Establecimientos })
      .then((data) => {
        console.log("🚀 ~ .then ~ data:", data.data)
        setDataSupervisiones(data.data)
      })
  };

  function cellRenderViewPhotos(data) {
    let icon
    if (data.value !== null && data.value !== undefined) {
      icon = <FontAwesomeIcon icon={faImages} style={{ textAlign: 'center', cursor: 'pointer' }} className="icon-status" onClick={() => { openPopup(data.value) }}></FontAwesomeIcon>
    } else {
      icon = <FontAwesomeIcon icon={faImages} ></FontAwesomeIcon>
    }
    return icon
  }

  function cellRenderViewAnswers(data) {
    let icon
    if (data.value !== null) {
      icon = <FontAwesomeIcon icon={faCommentDots} style={{ textAlign: 'center', cursor: 'pointer' }} className="icon-status" onClick={() => { openPopup2(data.value) }}></FontAwesomeIcon>
    } else {
      icon = <FontAwesomeIcon icon={faCommentDots} ></FontAwesomeIcon>
    }
    return icon
  }

  const openPopup = (fotos) => {
    setShowpictures(fotos)
    setShowPopup(true);
  };

  const hidePopup = () => {
    setShowPopup(false);
  };

  const openPopup2 = (respuestas) => {
    respuestas.forEach(element => {
      if (typeof element.respuesta === 'boolean') {
        element.respuesta = element.respuesta === true ? 'Si' : 'No'
      }
    });
    setRespuestasForm(respuestas)
    setShowPopup2(true);
  };

  const hidePopup2 = () => {
    setShowPopup2(false);
  };

  const DescargarAllZip = () => {

    let images = []
    showpictures.forEach(x => {
      if (showpictures.length > 0) {
        images.push({ url: x.foto, name: x.tag })
      }
    })

    const zip = new JSZip();
    let contador = 0
    images.forEach((url, index) => {
      // Carga la imagen como un blob
      fetch(url.url)
        .then(res => res.blob())
        .then(blob => {
          // Agrega la imagen al archivo ZIP
          contador++
          zip.file(contador + "- " + `${url.name}.jpg`, blob);
          if (contador === images.length) {
            // Cuando se hayan agregado todas las imágenes, genera el archivo ZIP
            zip.generateAsync({ type: 'blob' }).then(content => {
              // Descarga el archivo ZIP
              // saveAs(content, 'GaleriaDeImagenes.zip');
            });
          }
        });
    });
  }

  const saveButtonPhotoOptions = {
    text: "Descargar todas las imágenes",
    onClick: () => {
      DescargarAllZip(false);
    },
  };


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userData"));
    setClientes(user.cliente);
    setRegiones(user.region);
    setFilters({ ...filters, region: user.region[0] })
  }, [])

  useEffect(() => {
    const areFieldsEmpty = Object.values(filters).some(value => typeof value === 'string' && value === '');
    setButtonDisabled(areFieldsEmpty);
  }, [filters]);

  return (
    <React.Fragment>
      <div className="d-md-flex justify-content-between pruebaBoton mb-2">
        <h5 className={"content-block titleCliente"}>Supervisiones</h5>
        <div style={{ display: "flex", width: "45%", justifyContent: 'flex-end' }}>
          <Button className="btn btn-light mt-4 mr-2" onClick={clearFilters}>Limpiar Filtros</Button>
          <Button className="btn btn-primary mt-4 mr-2" disabled={isButtonDisabled} onClick={searchSupervisions}>Buscar</Button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mt-4">
          <SelectBox
            searchEnabled
            label='Cliente'
            onValueChanged={(e) => { searchUsersAndStablishment(e) }}
            dataSource={Clientes}
            defaultValue={filters.cliente}
            value={filters.cliente}
          />
        </div>

        <div className="col-md-4 mt-4">
          <DateBox
            label='Desde'
            onValueChanged={(e) =>
              setFilters({
                ...filters,
                fechaInicial: e.value,
              })
            }
            defaultValue={fechaInicial}
            value={fechaInicial}
            max={now}
            type='date'
          />
        </div>

        <div className="col-md-4 mt-4">
          <DateBox
            label='Hasta'
            onValueChanged={(e) =>
              setFilters({
                ...filters,
                fechaFinal: e.value,
              })
            }
            defaultValue={FechaFinal}
            value={FechaFinal}
            max={now}
            type='date'
          />
        </div>

        <div className="col-md-4 mt-4">
          <SelectBox
            searchEnabled
            label='Region'
            dataSource={Regiones}
            defaultValue={filters.region}
            value={filters.region}
            onValueChanged={(e) => { searchUsersAndStablishment(e) }}
          />
        </div>

        <div className="col-md-4 mt-4">
          <SelectBox
            label='Usuarios'
            dataSource={usuario}
            defaultValue={filters.usuarios}
            value={filters.usuarios}
            valueExpr="uid"
            displayExpr="nombre"
            onValueChange={(e) => {
              setFilters({
                ...filters,
                usuarios: e,
              })
            }}
            searchEnabled={true}
            disabled={filters.region !== '' && filters.cliente !== '' ? false : true}
          />
        </div>

        <div className="col-md-4 mt-4">
          <SelectBox
            label='Establecimientos'
            dataSource={Establecimiento}
            defaultValue={filters.Establecimientos}
            value={filters.Establecimientos}
            valueExpr="nombre_establecimiento"
            displayExpr="nombre_establecimiento"
            onValueChanged={(e) => {
              setFilters({
                ...filters,
                Establecimientos: e.value,
              })
            }}
            searchEnabled={true}
            disabled={filters.region !== '' && filters.cliente !== '' ? false : true}
          />
        </div>
      </div>

      <DataGrid
        className={"dx-card wide-card"}
        dataSource={dataSupervisiones}
        showBorders={true}
        remoteOperations={true}
        focusedRowEnabled={false}
        keyExpr="key"
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
        <Export enabled={true} />
        <Pager
          showPageSizeSelector={true}
          showInfo={true}
          allowedPageSizes={allowedPageSizes}
        />
        <HeaderFilter visible={true} />

        <Toolbar>
          {/* <Item location="after">
            <Button
              icon='refresh'
            // onClick={getAllEstablishment}
            />
          </Item> */}
          <Item name="exportButton" />
          <Item name="columnChooserButton" />
        </Toolbar>

        <Column
          caption={"Cliente"}
          dataField={"cliente"}
        />

        <Column
          caption={"Supervisor"}
          dataField={"supervisor"}
        />

        <Column
          caption={"Establecimiento"}
          dataField={"establecimiento"}
        />

        <Column
          caption={"Fecha"}
          dataField={"fecha_Reporte"}
        />

        <Column
          caption={"Region"}
          dataField={"region"}
        />

        <Column
          dataField={"supervision"}
          caption={"Ver Respuestas"}
          alignment={'center'}
          allowFiltering={false}
          cellRender={(data) => cellRenderViewAnswers(data)}
        />

        <Column
          dataField={"fotos"}
          caption={"Ver Fotos"}
          alignment={'center'}
          allowFiltering={false}
          cellRender={(data) => cellRenderViewPhotos(data)}
        />
      </DataGrid>

      <Popup
        width={"75%"}
        height={"85%"}
        visible={showPopup}
        onHiding={hidePopup}
        showTitle={true}
        title={"Galería de Imágenes"}
        showCloseButton={true}
        fullScreen
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          cssClass="save-toolbar-button"
          options={saveButtonPhotoOptions}
        />
        <ScrollView width='100%' height='100%'>
          <div className="row">
            {/* <Button className="btn btn-light mt-4 mr-2" onClick={DescargarAllZip}>Descargar todas las imágenes</Button> */}
            {
              showpictures.map((cadaRegistro) => {
                return (
                  showpictures.length != 0 ? (
                    <div className="col-md-3 mt-5" key={cadaRegistro.foto}>
                      <div className='mb-4'>
                        <div className={'dx-card p-4'}>
                          <div className="">
                            <img src={cadaRegistro.foto} alt="image-form" width='100%' height='300px' />
                          </div>
                          <div className="">
                            <p className='mt-3' style={{ textAlign: 'center', height: '90%' }}>{cadaRegistro.tag}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : ''
                )
              })
            }
          </div>
        </ScrollView>
      </Popup>

      <Popup
        width={"75%"}
        height={"85%"}
        visible={showPopup2}
        onHiding={hidePopup2}
        showTitle={true}
        title={"Respuestas Supervision"}
        showCloseButton={true}
        fullScreen
      >
        <ScrollView width='100%' height='100%'>
          <DataGrid
            className={"dx-card wide-card"}
            dataSource={respuestasForm}
            showBorders={true}
            remoteOperations={true}
            focusedRowEnabled={false}
            keyExpr="pregunta"
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
            <Export enabled={true} />
            <Pager
              showPageSizeSelector={true}
              showInfo={true}
              allowedPageSizes={allowedPageSizes}
            />
            <HeaderFilter visible={true} />

            <Toolbar>
              {/* <Item location="after">
            <Button
              icon='refresh'
            // onClick={getAllEstablishment}
            />
          </Item> */}
              <Item name="exportButton" />
              <Item name="columnChooserButton" />
            </Toolbar>

            <Column
              caption={"Pregunta"}
              dataField={"pregunta"}
            />

            <Column
              caption={"Respuesta"}
              dataField={"respuesta"}
            />

          </DataGrid>
        </ScrollView>
      </Popup>
    </React.Fragment>
  )
}

export default Supervisiones
import SelectBox from "devextreme-react/select-box";
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Popup } from "devextreme-react/popup";
import { fire } from '../../../api/firebaseEnv';


import DataGrid, {
    Pager,
    Column,
    Paging,
    Export,
    FilterRow,
    HeaderFilter,
    Toolbar, Item,
    ColumnChooser,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import DateBox from "devextreme-react/date-box";
import CellRenderEstatus from '../../../components/Grids/estatus-grid/estatus-grid';
import CellRenderIconsGrids from '../../../components/Grids/icons-grid/icons-grid';
import ScrollView from "devextreme-react/scroll-view";
import Moment from "moment";
import * as FormService from '../../../api/forms';
import moment from "moment";

export default function EditForm() {
    const history = useNavigate();
    const allowedPageSizes = [8, 12, 20];
    const todayDate = new Date().toLocaleDateString();
    const [forms, setForms] = useState([]);
    const [filters, setFilters] = useState({fecha_Desde: todayDate, fecha_Hasta: todayDate})
    const [showPopupfiltro, setShowPopupfiltro] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState(false);
    const [FormDelete, setFormDelete] = useState({});
    const [Clientes, setClientes] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const initialState = {
        cliente: "",
        region: "TODAS LAS REGIONES",
        fechaInicio: new Date(new Date().setDate(new Date().getDate() - 7)),
        fechaFinal: new Date(),
      };
    const [FiltrosReporte, setFiltrosReporte] = useState(initialState);
    const [fechaInicial, setfechaInicial] = useState(
        new Date(new Date().setDate(new Date().getDate() - 7))
      );
    const [FechaFinal, setFechaFinal] = useState(new Date());

    let user = JSON.parse(localStorage.getItem("userData"));
    
    useEffect(() => {

        
  
        setClientes(user.cliente);
        setRegiones(user.region);

        // FormService.getSavedForms(filters).then(result => {
        //     console.log("🚀 ~ file: editForm.js:29 ~ FormService.getSavedForms ~ result:", result)
        //     if(result.status == 200 && result.data.msg == true){
        //         setForms(result.data.data);
        //     }else{
        //         console.log('Ha ocurrido un error ');
        //     }
        // })
    }, [])

    const openEditPopup = (data) => {
       console.log('Editando Popup ', data);
       localStorage.setItem("SelectedForm",JSON.stringify([data]))
       localStorage.setItem("Actualizar", "Yes")
       history('/Form')
    }


    const openDeletePopup = (data) => {
       console.log('Eliminando Popup ', data);
        setShowPopupDelete(true)
        setFormDelete(data)

    };

    const hideDeletePopup = () => {
        setShowPopupDelete(false);
        setFormDelete({})
      };

    const goBack = () => {
        history('/formularios')
    }

    const openFiltrarPopup = (uid) =>{
        setShowPopupfiltro(true);
    }

    const hidefiltroPopup = () => {
        setShowPopupfiltro(false);
        setFiltrosReporte(initialState)
      };

      const onDelete = () => {
        let data = {
            fecha_eliminado: moment().format(),
            formulario_eliminado: {
                form_key: FormDelete.key,
                establecimiento: FormDelete.establecimiento,
                fecha_formulario: FormDelete.fecha_Formulario,
                promotor: FormDelete.promotor
            },
            nombre_usuario: `${user.nombre} ${user.apellido}`,
            user_key: user.uid
           }

           console.log(data)
           fire.collection('Formularios_Eliminados').add(data).then((res) => {
            console.log(res.id)
            fire.collection('Formularios_Llenos').doc(data.formulario_eliminado.form_key).delete().then(
                console.log('Formulario Eliminado')
            )
           })
    }

      const OnSubmit = () => {
        const fechaInicialReport = Moment(FiltrosReporte.fechaInicio).format(
          "YYYY-MM-DD"
        );
        console.log("🚀 ~ file: editForm.js:86 ~ OnSubmit ~ fechaInicialReport:", fechaInicialReport)
        const fechaFinalReport = Moment(FiltrosReporte.fechaFinal).format(
          "YYYY-MM-DD"
        );

        console.log("🚀 ~ file: editForm.js:90 ~ OnSubmit ~ fechaFinalReport:", fechaFinalReport)

        console.log(FiltrosReporte)

        const searchData = {
            cliente:FiltrosReporte.cliente,
            region:FiltrosReporte.region,
            fecha_Desde:fechaInicialReport,
            fecha_Hasta:fechaFinalReport,
        }
        

        FormService.getSavedForms(searchData).then(result => {
            console.log("🚀 ~ file: editForm.js:29 ~ FormService.getSavedForms ~ result:", result)
            if(result.status === 200 && result.data.msg === true){
                console.log(result.data.data)
                setForms(result.data.data);
                hidefiltroPopup()
                setFiltrosReporte(initialState)
            }else{
                console.log('Ha ocurrido un error ');
            }
        })
      }

    return (
        <div id="container" style={{height:'80%'}}>
            <div className="d-flex">
                <div className="header-grid-title100">
                    <h5 className='content-block titleCliente mb-3 mt-4'>
                        <ArrowLeftCircle onClick={goBack} className="btn-back mr-2" /> 
                        Edición de Formularios
                    </h5>
                </div>
            </div>
            <div className="edit-form-container h-100">
                <div>
                    <Button className="btn btn-primary mt-2 mb-2" icon="filter" text="Filtros" onClick={openFiltrarPopup}/>
                </div>
                <DataGrid
                    className={"dx-card wide-card form-edit-grid h-75"}
                    dataSource={forms}
                    showBorders={true}
                    remoteOperations={true}
                    focusedRowEnabled={true}
                    rowAlternationEnabled={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    keyExpr="fecha_Formulario"
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
                        showInfo={true}
                        allowedPageSizes={allowedPageSizes}
                    />
                    <HeaderFilter visible={true} />

                    <Column
                        caption={"Formulario"}
                        dataField={"nombre"}
                        width={150}
                    />
                    <Column
                        dataField={"cliente"}
                        caption={"Cliente"}
                        dataType="string"
                    />
                    <Column
                        dataField={"establecimiento"}
                        caption={"Establecimiento"}
                        dataType="string"
                        width={250}
                    />
                    <Column
                        dataField={"promotor"}
                        caption={"Promotor"}
                        dataType="string"
                    />
                    <Column dataField={"fecha_Sincronizado"} caption={"Fecha"} dataType="string" />
                    <Column dataField={"version"} caption={"Versión"} dataType="string" />
                    {/* <Column
                        dataField={"estatus"}
                        caption={"Editado"}
                        dataType="string"
                        cellRender={CellRenderEstatus}
                    /> */}
                    <Column
                        width={80}
                        caption=""
                        allowSorting={false}
                        cellRender={(data) => CellRenderIconsGrids(data, openEditPopup, openDeletePopup)}
                        name="renderEstab"
                    />
                    <Export enabled={true} />
                    
                </DataGrid>
            
                <Popup
                    width={"700px"}
                    height={"500px"}
                    visible={showPopupfiltro}
                    onHiding={hidefiltroPopup}
                    showTitle={true}
                    title="Filtrar informacion"
                    showCloseButton={true}
                    
                >
                    <ScrollView width="100%" height="100%">
                    <div className="form-container text-center">
                            <div className="dx">
                                <div className="seles">
                                <SelectBox
                                    className="SelectBoxC mb-4"
                                    placeholder="Seleccione un cliente"
                                    label="Cliente"
                                    searchEnabled={true}
                                    dataSource={Clientes}
                                    defaultValue={FiltrosReporte.cliente}
                                    value={FiltrosReporte.cliente}
                                    onValueChanged={(e) =>
                                        setFiltrosReporte({ ...FiltrosReporte, cliente: e.value })
                                    }
                                />
                                </div>
                            </div>

                        <div className="dx">
                            <div className="">
                            <SelectBox
                                className="SelectBoxR mb-4"
                                placeholder="Seleccione una región"
                                label="Región"
                                searchEnabled={true}
                                dataSource={Regiones}
                                onValueChanged={(e) =>
                                setFiltrosReporte({ ...FiltrosReporte, region: e.value })
                                }
                                defaultValue={FiltrosReporte.region}
                                value={FiltrosReporte.region}
                                style={{}}
                            />
                            </div>
                        </div>
                        <div className="dx">
                            <div className="">
                            <DateBox
                                className="SelectBoxDate mb-4"
                                placeholder="Fecha de reporte desde"
                                label="Desde"
                                onValueChanged={(e) =>
                                setFiltrosReporte({
                                    ...FiltrosReporte,
                                    fechaInicio: e.value,
                                })
                                }
                                defaultValue={fechaInicial}
                                value={fechaInicial}
                                type="date"
                            />
                            </div>
                        </div>

                        <div className="dx">
                            <div className="">
                            <DateBox
                                className="SelectBoxDate mb-4"
                                placeholder="Fecha de reporte hasta"
                                label="Hasta"
                                onValueChanged={(e) =>
                                setFiltrosReporte({
                                    ...FiltrosReporte,
                                    fechaFinal: e.value,
                                })
                                }
                                defaultValue={FechaFinal}
                                value={FechaFinal}
                                type="date"
                            />
                            </div>
                        </div>
                    <div className="BTN">
                        <Button
                        className="btnGenerarReporte"
                        variant="contained"
                        onClick={() => OnSubmit()}
                        size="large"
                        >
                        Filtrar
                        </Button>
                    </div>
                    </div>

                    </ScrollView>
                </Popup>

                <Popup
                    width={"700px"}
                    height={"500px"}
                    visible={showPopupDelete}
                    onHiding={hideDeletePopup}
                    showTitle={true}
                    title="Eliminar informacion"
                    showCloseButton={true}
                    
                >
                    <ScrollView width="100%" height="100%">
                    <div className="form-container text-center">
                        <div className="dx">
                            <p>¿Seguro que desea eliminar este formulario?</p>
                            <p><b>Importante</b> El borrado del formulario es permanente</p>
                            <div className="btnContainer">
                                <Button
                                    className="btnEliminar"
                                    variant="contained"
                                    onClick={() => onDelete()}
                                    size="large"
                                >
                                    Filtrar
                                </Button>
                                
                                <Button
                                    className="btnEliminar"
                                    variant="contained"
                                    onClick={hideDeletePopup}
                                    size="large"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>

                    </ScrollView>
                </Popup>
            </div>
        </div>

    );
}
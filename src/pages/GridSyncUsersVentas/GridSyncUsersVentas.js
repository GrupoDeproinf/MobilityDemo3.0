import DataGrid, {
    Pager,
    Column,
    Paging,
    Export,
    FilterRow,
    HeaderFilter,
    ColumnChooser,
} from "devextreme-react/data-grid";
import CellRenderEstatus from '../../components/Grids/estatus-grid/estatus-grid';
import { Popup } from "devextreme-react/popup";
import * as DinamicQueries from '../../api/DinamicsQuery'; 
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import React, { useEffect, useState } from "react";
import moment from 'moment/moment';

export default function UserSyncGridVentas() {
    const [Clientes, setClientes] = useState([]);
    const [Usuarios, setUsuarios] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const [primareVez, setPrimeraVez] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [FormulariosUsuario, setFormulariosUsuario] = useState([]);
    const [msgPopup, setMsgPopup] = useState("Formularios Sincronizados");
    const [fechaInicialDesde, setfechaInicial] = useState(
        new Date(new Date().setDate(new Date().getDate() - 7))
    );
    const [fechaFinalHasta, setFechaFinal] = useState(new Date());
    const InitialStateFilters = {
        cliente: '',
        region: '',
        FechaInicial:  new Date(new Date().setDate(new Date().getDate() - 7)),
        FechaFinal: new Date(),
    };
    const [filters, setFilters] = useState(InitialStateFilters);

    const allowedPageSizes = [8, 12, 20];
    const now = new Date();
    const minDate = moment(new Date()).subtract(3, 'months');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userData"));
        setFilters({ ...filters, cliente: user.cliente[0],  region: user.region[0]})
        setClientes(user.cliente);
        setRegiones(user.region);
    }, []);

    const searchUsers = (e, item) => {
        if (e != "") {
            if(item === 'Clientes'){
                let Users = []
                setUsuarios([])
                DinamicQueries.getDataWithParameters('UsersByDataSync', "home/", {cliente: e, region: filters.region, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
                .then(usuarios => {
                    console.log("🚀 ~ file: homeEffectiveness.js ~ line 113 ~ searchUsuarios ~ usuarios", usuarios)
                    Users = usuarios.data
                    setUsuarios(Users)
                })
            } else if(item === 'Regiones') {
                console.log("🚀 ~ file: homeEffectiveness.js ~ line 131 ~ searchUsuarios ~ e", e)
                let Users = []
                setUsuarios([]);
                
                const user = JSON.parse(localStorage.getItem("userData"));
                let cliente = primareVez === true ? user.cliente[0] : filters.cliente;
                
                DinamicQueries.getDataWithParameters('UsersByDataSync', "home/", {cliente: cliente, region: e, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
                .then(usuarios => {
                    console.log("🚀 ~ file: homeEffectiveness.js ~ line 126 ~ searchUsuarios ~ usuarios", usuarios)
                    Users = usuarios.data
                    setUsuarios(Users)
                })
            }
        }
    };

    const cellRender = (data) => {
        return <div className='d-flex icons_grid'>
            <i className="dx-icon-search" onClick={()=>searchForms(data.data)}></i>
            {/* <i className="dx-icon-trash" onClick={()=>openDeletePopup(data.data)}></i> */}
        </div>;
    }

    const hidePopup = () => {
        setShowPopup(false);
        // setAsignacion(initialState)
        // setEstablecimientos([])
        setMsgPopup("Formularios Sincronizados");
      };

    const searchForms = (user) => {
        // console.log("🚀 ~ file: GridSyncUsers.js ~ line 82 ~ searchForms ~ user", user)
        let formularios = []
        setFormulariosUsuario([])
        DinamicQueries.getDataWithParameters('FormByUser', "home/", { uid_promotor: user.uid, cliente: filters.cliente, region: filters.region, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
        .then(forms=>{
            // console.log("🚀 ~ file: GridSyncUsers.js ~ line 94 ~ searchForms ~ forms", forms)
            forms.data.forEach((cadaForm)=>{
                // let temporal ={...cadaForm, 
                //     fecha_Sincronizado: moment(cadaForm.fecha_Sincronizado).format('YYYY/MM/DD'),
                //     fecha_Creado: moment(cadaForm.fecha_Creado).format('YYYY/MM/DD')
                // }
                formularios.push(cadaForm)
            })
            console.log("🚀 ~ file: GridSyncUsers.js ~ line 101 ~ forms.forEach ~ formularios", formularios)
            setFormulariosUsuario(formularios)
        });
        setShowPopup(true);
    };

    return (
        <React.Fragment>

            <h5 className={"content-block titleCliente"}>Registro de formularios sincronizados</h5>

            <div className="row mt-2">
                <div className="col-md-12 mb-3">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3 mt-2">
                                    <SelectBox
                                        label='Clientes'
                                        searchEnabled
                                        dataSource={Clientes}
                                        defaultValue={filters.cliente}
                                        value={filters.cliente}
                                        onSelectionChanged={(e) => {
                                            searchUsers(e.selectedItem, e.element.innerText)
                                        }}
                                        onValueChanged={(e) => {
                                            if (e.value != "") {
                                                setFilters({ ...filters, cliente: e.value })
                                                // searchUsers(e.value, e.element.innerText)
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-3 mt-2">
                                    <SelectBox
                                        label='Regiones'
                                        searchEnabled
                                        dataSource={Regiones}
                                        defaultValue={filters.region}
                                        value={filters.region}
                                        onSelectionChanged={(e) => {
                                            if(e.selectedItem){
                                                searchUsers(e.selectedItem, e.element.innerText)
                                            }
                                        }}
                                        onValueChanged={(e) => {
                                            if (e.value != "" && primareVez == true) {
                                                const user = JSON.parse(localStorage.getItem("userData"));
                                                setFilters({ ...filters, region: e.value, cliente: user.cliente[0] });
                                                searchUsers( e.value, e.element.innerText)
                                                setPrimeraVez(false);
                                            }else if(e.value != ""){
                                                setFilters({ ...filters, region: e.value});
                                                searchUsers(e.value, e.element.innerText)
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-md-3 mt-2">
                                    <DateBox
                                        label='Desde'
                                        max={now}
                                        min={minDate}
                                        defaultValue={fechaInicialDesde}
                                        value={fechaInicialDesde}
                                        type='date'
                                        onValueChanged={(e) => {
                                            setFilters({
                                                ...filters,
                                                FechaInicial: new Date(e.value)
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-md-3 mt-2">
                                    <DateBox
                                        label='Hasta'
                                        max={now}
                                        min={minDate}
                                        defaultValue={fechaFinalHasta}
                                        value={fechaFinalHasta}
                                        type='date'
                                        onValueChanged={(e) => { 
                                            setFilters({
                                                ...filters,
                                                FechaFinal: new Date(e.value)
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DataGrid
                className={"dx-card wide-card"}
                dataSource={Usuarios}
                showBorders={true}
                remoteOperations={true}
                focusedRowEnabled={true}
                keyExpr="uid"
                style={{ height: "500px" }}
                rowAlternationEnabled={true}
                columnAutoWidth={true}
                wordWrapEnabled={true}
                paginate={true}
                paging={true}
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
                caption={"Nombre"}
                dataField={"nombre"}
                width={'auto'}
            />
            <Column 
                caption={"Apellido"} 
                dataField={"apellido"} 
                width={'auto'} 
            />
            <Column
                dataField={"region[0]"}
                caption={"Region"}
                width={'auto'}
            />
            <Column
                dataField={"cliente"}
                caption={"Cliente"}
                width={'auto'}
            />
            <Column
                dataField={"perfil"}
                caption={"Perfil"}
                dataType="string"
                width={'auto'}
            />
            <Column 
                dataField={"estatus"} 
                caption={"Estatus"} 
                dataType="string" 
                cellRender={CellRenderEstatus}
            />
            <Column
                width={80}
                caption=""
                allowSorting={false}
                cellRender={cellRender}
                name="renderUserData"
            />
            <Export enabled={true} />
            </DataGrid>

            <Popup
                width={"auto"}
                height={"auto"}
                visible={showPopup}
                onHiding={hidePopup}
                showTitle={true}
                title={msgPopup}
                showCloseButton={true}
                
                fullScreen={true}
            >
                <DataGrid
                    className={"dx-card wide-card mt-2"}
                    dataSource={FormulariosUsuario}
                    showBorders={true}
                    remoteOperations={true}
                    focusedRowEnabled={true}
                    keyExpr="uid_promotor"
                    style={{ height: "100%" }}
                    rowAlternationEnabled={true}
                    columnAutoWidth={true}
                    wordWrapEnabled={true}
                    // paginate={true}
                    // paging={true}
                >
                <FilterRow visible={true} />
                <Paging defaultPageSize={20} />
                <Pager
                    showPageSizeSelector={true}
                    showInfo={true}
                    allowedPageSizes={allowedPageSizes}
                />
                <HeaderFilter visible={true} />

                <Column
                    caption={"Promotor"}
                    dataField={"promotor"}
                    width={'auto'}
                />
                <Column 
                    caption={"Establecimiento"} 
                    dataField={"establecimiento"} 
                    width={'auto'} 
                />
                <Column
                    caption={"Ciudad"}
                    dataField={"ciudad"}
                    width={'auto'}
                />
                <Column
                    caption={"Formulario"}
                    dataField={"nombre"}
                    width={'auto'}
                />
                <Column
                    caption={"Estatus"}
                    dataField={"estatus"}
                    width={'auto'}
                />
                <Column 
                    caption={"Fecha Sincronizado"} 
                    dataField={"fecha_Sincronizado"} 
                    width={'auto'}
                />
                <Column 
                    caption={"Fecha Creado"} 
                    dataField={"fecha_Creado"} 
                    width={'auto'}
                />
                {/* <Column 
                    caption={"Fecha Reporte"} 
                    dataField={"fecha_Reporte"} 
                    width={'auto'}
                /> */}
                {/* <Column
                    width={80}
                    caption=""
                    allowSorting={false}
                    cellRender={cellRender}
                    name="renderUserData"
                /> */}
                <Export enabled={true} />
                </DataGrid>
            </Popup>
        </React.Fragment>
    );
}

import React, { useState, useEffect } from 'react';
import * as DinamicQueries from '../../../api/DinamicsQuery';
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import * as ReportsService from "../../../api/reports";
import DataGrid, {
    Column,
    Grouping,
    GroupPanel,
    Paging,
    HeaderFilter,
    Pager
} from 'devextreme-react/data-grid';
import moment from 'moment';
import '../home.scss';

const HomeInventory = () => {
    const [Clientes, setClientes] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const [Formularios, setFormularios] = useState([]);
    const [allowedPageSizes] = useState([10, 20, 30, 50])
    const [FechaFinalHasta] = useState(new Date());
    const [FechaInicioDesde] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [shouldFetchData, setShouldFetchData] = useState(true);
    const [GridData, setDataGrid] = useState([])

    const [filters, setFilters] = useState({
        cliente: '',
        nombre: '',
        region: '',
        FechaInicial: new Date(new Date().setDate(new Date().getDate() - 7)),
        FechaFinal: new Date(),
    });

    const [toastConfig, setToastConfig] = React.useState(
        {
            isVisible: false,
            type: "success",
            message: "Guardado Exitosamente",
            displayTime: 2000,
        },
        []
    );

    const now = new Date();
    const minDate = moment(new Date()).subtract(3, 'months');

    const searchFormulario = (e) => {
        if (e != "") {
            let forms = []
            setFormularios([]);
            DinamicQueries.getDataWithParameters('getFormsWeb', 'formularios/', { cliente: e }).then((resp) => {
                resp.data.data.forEach((cadaform) => {
                    forms = [...forms, cadaform]
                })
                console.log("🚀 ~ file: homeInventory.js:31 ~ resp.data.data.forEach ~ forms:", forms)
                setFormularios(forms);
            });
        }
    };

    const handleValueChange = (fieldName, fieldValue) => {
        setFilters((prevValues) => ({
            ...prevValues,
            [fieldName]: fieldValue,
        }));
    };

    const GetReportsData = () => {
        const fechaInicialReport = moment(filters.FechaInicial).format(
            "YYYY-MM-DD"
        );
        const fechaFinalReport = moment(filters.FechaFinal).format(
            "YYYY-MM-DD"
        );

        const generarReporte = {
            region: filters.region,
            fechaInicio: fechaInicialReport,
            fechaFinal: fechaFinalReport,
            formulario: filters.nombre,
            nombre_Cliente: filters.cliente,
        };

        if (generarReporte.region == "TODAS LAS REGIONES") {
            generarReporte.region = undefined
        }

        ReportsService.generateReports(generarReporte).then((resp) => {
            if (resp.data.length > 0) {
                if (generarReporte.formulario == "Fundamentales" || generarReporte.formulario == "Fundamental" || generarReporte.formulario == "FUNDAMENTAL") {
                    let arrayForm = resp.data.filter(x => x.pregunta !== "¿ESTÁ EL PRODUCTO EN EL PDV?" && x.pregunta !== "CARAS" && x.pregunta !== "PRECIO")
                    let tempArrayForms = []
                    arrayForm.forEach((cadaRespuesta) => {
                        cadaRespuesta.Fecha = moment(cadaRespuesta.fecha_Formulario).format('YYYY-MM-DD')
                        tempArrayForms = [...tempArrayForms, cadaRespuesta]
                    })
                    console.log("🚀 ~ file: homeInventory.js:94 ~ ReportsService.generateReports ~ tempArrayForms:", tempArrayForms)
                    setDataGrid(tempArrayForms)
                } else {
                    // Descargar archivo de Excel
                    console.log('====================================');
                    console.log('No es Fundamental');
                    console.log('====================================');
                }
            } else {
                setToastConfig({
                    ...toastConfig,
                    type: "warning",
                    message: "No se encontraron registro en la fecha dada",
                    isVisible: true,
                });
            }
        });
    };

    useEffect(() => {
        if (shouldFetchData) {
            const user = JSON.parse(localStorage.getItem("userData"));
            setFilters((prevValues) => ({
                ...prevValues,
                ['cliente']: user.cliente[0],
                ['region']: user.region[0],
            }));
            searchFormulario(user.cliente[0]);
            setClientes(user.cliente);
            setRegiones(user.region);
            setShouldFetchData(false);
        } else {
            GetReportsData();
        }
    }, [filters])

    return (
        <React.Fragment>
            <div className="row mt-4">
                <div className="col-md-12">
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
                                        onValueChanged={(e) => handleValueChange('cliente', e.value)}
                                        onSelectionChanged={(e) => {
                                            searchFormulario(e.selectedItem)
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
                                        onValueChanged={(e) => handleValueChange('region', e.value)}
                                    />
                                </div>
                                <div className="col-md-3 mt-2">
                                    <SelectBox
                                        label='Formularios'
                                        searchEnabled
                                        dataSource={Formularios}
                                        defaultValue={filters.nombre}
                                        value={filters.nombre}
                                        valueExpr={"nombre"}
                                        displayExpr={"nombre"}
                                        onValueChanged={(e) => { handleValueChange('nombre', e.value) }}
                                    />
                                </div>
                                <div className="col-md-3 mt-2">
                                    <DateBox
                                        label='Desde'
                                        max={now}
                                        min={minDate}
                                        defaultValue={FechaInicioDesde}
                                        value={filters.FechaInicial}
                                        type='date'
                                        onValueChanged={(e) => handleValueChange('FechaInicial', e.value)}
                                    />
                                </div>
                                <div className="col-md-3 mt-2">
                                    <DateBox
                                        label='Hasta'
                                        max={now}
                                        min={minDate}
                                        defaultValue={FechaFinalHasta}
                                        value={filters.FechaFinal}
                                        type='date'
                                        onValueChanged={(e) => handleValueChange('FechaFinal', e.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3"></div>

            <div className="col-md-12 mt-4">
                <div className="card">
                    <div className="card-body">
                        <DataGrid
                            dataSource={GridData}
                            keyExpr="cod_est"
                            allowColumnReordering={true}
                            showBorders={true}
                        >
                            <GroupPanel visible={true} />
                            <Grouping autoExpandAll={false} />
                            <HeaderFilter visible={true} />
                            <Paging defaultPageSize={10} />
                            <Pager
                                visible={true}
                                allowedPageSizes={allowedPageSizes}
                                showPageSizeSelector={true}
                                showInfo={true}
                                showNavigationButtons={true}
                            />

                            <Column dataField="establecimiento" dataType="string" groupIndex={2} />
                            <Column dataField="fecha_Formulario" dataType="string" groupIndex={1} />
                            <Column dataField="producto" dataType="string" groupIndex={3} />
                            <Column dataField="Fecha" dataType="string" groupIndex={0} />
                            {/* <Column dataField="usuario" dataType="string" groupIndex={2} /> */}
                            <Column dataField="pregunta" dataType="string" />
                            <Column dataField="respuesta" dataType="string" />
                            {/* <Column dataField="State" dataType="string" groupIndex={0} /> */}
                        </DataGrid>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default HomeInventory
import Validator, { RequiredRule } from 'devextreme-react/validator';
import * as DinamicQueries from '../../../api/DinamicsQuery';
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import React, { useState, useEffect } from 'react';
import TagBox from 'devextreme-react/tag-box';
import moment from 'moment/moment';

import { 
    Chart, 
    Series, 
    ArgumentAxis,
    CommonSeriesSettings,
    CommonAxisSettings, 
    Label, 
    Format,
    Grid, 
    Legend, 
    Export, 
    ZoomAndPan, 
    ScrollBar, 
    ValueAxis, 
    Margin, 
    CommonAnnotationSettings, 
    Annotation, 
    Tooltip
} from 'devextreme-react/chart';

export default function HomeForms() {
    const [Clientes, setClientes] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const [Categorias, setCategorias] = useState([]);
    const [Formularios, setFormularios] = useState([]);

    const [ProductosForm, setProductosForm] = useState([]);
    const [EstablecSelect, setEstablecSelect] = useState([]);
    const [ProductosSelect, setProductosSelect] = useState([]);

    const [PrecioEstablecimiento, setPrecioEstablecimiento] = useState([]);
    const [precioProductos, setprecioProductos] = useState([]);
    const [Precios, setPrecios] = useState([])

    const [Establecimientos, setEstablecimientos] = useState([]);
    const [DataPriceMAxAndMin, setDataPriceMAxAndMin] = useState([]);
    const [DataPromedio, setDataPromedio] = useState([]);
    const [DataMediana, setDataMediana] = useState([]);
    const [DataModa, setDataModa] = useState([]);

    const [fechaInicialDesde, setfechaInicial] = useState(
        new Date(new Date().setDate(new Date().getDate() - 7))
    );
    const [fechaFinalHasta, setFechaFinal] = useState(new Date());
    const now = new Date();
    const minDate = moment(new Date()).subtract(3, 'months');

    const InitialStateFilters = {
        cliente: '',
        nombre: '',
        region: '',
        FechaInicial:  new Date(new Date().setDate(new Date().getDate() - 7)),
        FechaFinal: new Date(),
    };
    const [filters, setFilters] = useState(InitialStateFilters);
    const [primareVez, setPrimeraVez] = useState(true);

    const state = {
        isTooltipVisible: false
    }

    const maxItems = 8;
    const maxItemsE = 1;
    const hideEvent = { delay: 2000, name: "mouseout" };

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userData"));
        setFilters({ ...filters, cliente: user.cliente[0],  region: user.region[0]})
        setClientes(user.cliente);
        setRegiones(user.region);
        // setTimeout(() => {
        //     searchPromedio(filtros)
        // }, 4000)
    }, [])

    const searchFormulario = (e) => {
        if (e != "") {
            let forms = []
            setFormularios([]);
            DinamicQueries.getDataWithParameters('getFormsWeb', 'formularios/',  { cliente: e } ).then((resp) => {
                resp.data.data.forEach((cadaform)=>{
                    forms.push(cadaform)
                })
                setFormularios(forms);
                // setTimeout(() => {
                //     setFilters({...filters, nombre: resp.data.data[0].nombre});
                // }, 2000)
            });
        } 
    };

    const searchProductsForms = (e) =>{
        if (e != "") {
            DinamicQueries.getDataWithParameters('getProductsForms', 'home/',  { nombre: e,  cliente: filters.cliente} ).then((resp) => {
                // console.log("🚀 ~ file: hemeForms.js:90 ~ DinamicQueries.getDataWithParameters ~ resp", resp)
                setProductosForm(resp.data)
            });
        }
    }

    const searchEstablecimientos = (e, item) => {
        if (e != "") {
            if(item === 'Clientes'){
                let finalEstablemientos = [];
                setEstablecimientos([]);

                DinamicQueries.getDataWithParameters('getEstablecimientosFilter', "galeria/", {cliente: e, region: filters.region})
                .then(establecimientos=>{
                    // console.log(establecimientos)
                    establecimientos.data.forEach((cadaEstablecimiento)=>{
                        finalEstablemientos.push(cadaEstablecimiento.nombre_establecimiento)
                    })
                    setEstablecimientos(finalEstablemientos)
                })
            } else if(item === 'Regiones'){
                let finalEstablemientos = [];
                setEstablecimientos([]);

                const user = JSON.parse(localStorage.getItem("userData"));
                let cliente = primareVez === true ? user.cliente[0] : filters.cliente;

                DinamicQueries.getDataWithParameters('getEstablecimientosFilter', "galeria/", {cliente: cliente, region: e})
                .then(establecimientos=>{
                    // console.log(establecimientos)
                    establecimientos.data.forEach((cadaEstablecimiento)=>{
                        finalEstablemientos.push(cadaEstablecimiento.nombre_establecimiento)
                    })
                    setEstablecimientos(finalEstablemientos)
                })
            }
        }
      };

    const customizeTooltip = (e) => {
        return {
            text: `Establecimiento: ${e.point.tag}`,
          };
    }
    
    const customizeLabel = (e) => {
        return `${Math.abs(e.value)}%`;
    }

    // const data = [{
    //     age: '0-4',
    //     male: -3.1,
    //     female: 2.9,
    //   }, {
    //     age: '5-9',
    //     male: -3.1,
    //     female: 3.0,
    //   }, {
    //     age: '10-14',
    //     male: -3.0,
    //     female: 2.9,
    //   }, {
    //     age: '15-19',
    //     male: -3.2,
    //     female: 3.0,
    //   }, {
    //     age: '20-24',
    //     male: -3.5,
    //     female: 3.3,
    //   }, {
    //     age: '25-29',
    //     male: -3.5,
    //     female: 3.4,
    //   }, {
    //     age: '30-34',
    //     male: -3.5,
    //     female: 3.3,
    //   }, {
    //     age: '35-39',
    //     male: -3.3,
    //     female: 3.1,
    //   }, {
    //     age: '40-44',
    //     male: -3.7,
    //     female: 3.4,
    //   }, {
    //     age: '45-49',
    //     male: -3.8,
    //     female: 3.5,
    //   }, {
    //     age: '50-54',
    //     male: -3.4,
    //     female: 3.2,
    //   }, {
    //     age: '55-59',
    //     male: -3.1,
    //     female: 3.0,
    //   }, {
    //     age: '60-64',
    //     male: -2.7,
    //     female: 2.7,
    //   }, {
    //     age: '65-69',
    //     male: -2.9,
    //     female: 2.9,
    //   }, {
    //     age: '70-74',
    //     male: -2,
    //     female: 2.1,
    //   }, {
    //     age: '75-79',
    //     male: -1.2,
    //     female: 1.4,
    //   }, {
    //     age: '80-84',
    //     male: -0.8,
    //     female: 1.2,
    //   }, {
    //     age: '85-89',
    //     male: -0.5,
    //     female: 0.8,
    //   }, {
    //     age: '90-94',
    //     male: -0.2,
    //     female: 0.5,
    //   }, {
    //     age: '95+',
    //     male: 0,
    //     female: 0.1,
    // }]

    const architectureSourcesP = [
        { value: 'promedio', name: 'Promedio' },
    ];

    const architectureSourcesMo = [
        { value: 'moda', name: 'Moda' },
    ];


    const architectureSourcesMe = [
        { value: 'mediana', name: 'Mediana' },
    ];


    const onValueChangedProductoPreciosMAx = (e) => {
        if (e.value.length > maxItems) {
            const newValue = e.value.slice(0, maxItems);
            e.component.option('value', newValue);
            state.isTooltipVisible = true;
        } else if(e.value.length <= maxItems){
            DinamicQueries.getDataWithParameters('GetMaxAndMinPriceProducts', 'home/',  { productos: e.value,  cliente: filters.cliente, region: filters.region, nombre: filters.nombre, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal}).then((resp) => {
                setDataPriceMAxAndMin(resp.data)
            });
        }
    }

    const onValueChangedProductoPrecios = (establecimientos, productos) => {
            if (productos.value.length > maxItems ) {
                const newValueP = productos.value.slice(0, maxItems);
                productos.component.option('value', newValueP);
                state.isTooltipVisible = true;
            }else if(establecimientos.value.length > maxItemsE){
                const newValueE = establecimientos.value.slice(0, maxItemsE);
                establecimientos.component.option('value', newValueE);
                state.isTooltipVisible = true;
            } else if(productos.value.length <= maxItems || establecimientos.value.length <= maxItemsE){
                if( establecimientos.value.length > 0 && establecimientos.value.length > 0){
                    DinamicQueries.getDataWithParameters('PriceAverage', 'home/', { productos: productos.value, establecimientos: establecimientos.value, cliente: filters.cliente, region: filters.region, nombre: filters.nombre, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal }).then((resp) => {
                        // console.log("🚀 ~ file: hemeForms.js:292 ~ DinamicQueries.getDataWithParameters ~ resp", resp)
                        let modaTemporal = [];
                        let medianaTemporal = [];
                        let promedioTemporal = [];
                        resp.data.forEach(element => {
                            modaTemporal = [...modaTemporal, {
                                sku: element.sku,
                                moda: element.moda
                            }]

                            medianaTemporal = [...medianaTemporal, {
                                sku: element.sku,
                                mediana: element.mediana
                            }]                            
                            
                            promedioTemporal = [...promedioTemporal, {
                                sku: element.sku,
                                promedio: element.promedio
                            }]
                        });

                        setDataPromedio(promedioTemporal)
                        setDataModa(modaTemporal)
                        setDataMediana(medianaTemporal)
                    });
                }
        }
    }

    const onValueChangedProductoPrices = (establecimientos, productos) => {
        if (productos.value.length > maxItems ) {
            const newValueP = productos.value.slice(0, maxItems);
            productos.component.option('value', newValueP);
            state.isTooltipVisible = true;
        }else if(establecimientos.value.length > maxItemsE){
            const newValueE = establecimientos.value.slice(0, maxItemsE);
            establecimientos.component.option('value', newValueE);
            state.isTooltipVisible = true;
        } else if(productos.value.length <= maxItems || establecimientos.value.length <= maxItemsE){
            if( establecimientos.value.length > 0 && establecimientos.value.length > 0){
                DinamicQueries.getDataWithParameters('ProductPrices', 'home/', { productos: productos.value, establecimientos: establecimientos.value, cliente: filters.cliente, region: filters.region, nombre: filters.nombre, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal }).then((resp) => {
                    console.log("🚀 ~ file: hemeForms.js:292 ~ DinamicQueries.getDataWithParameters ~ resp", resp)
                    setPrecios(resp.data)
                });
            }
        }
    }

    const onTooltipHiding = (e) => {
        state.isTooltipVisible = false;
    }

return (
    <React.Fragment>
        {/* <h4 className='mt-4'>Dashboard</h4> */}
        
        <div className="row mt-2 mx-2">
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
                                    onSelectionChanged={(e) => {
                                        searchFormulario(e.selectedItem)
                                        searchEstablecimientos(e.value, e.element.innerText)
                                    }}
                                    onValueChanged={(e)=>{
                                        if (e.value != "") {
                                            setFilters({ ...filters, cliente: e.value })
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
                                            searchEstablecimientos(e.selectedItem, e.element.innerText)
                                        }
                                    }} 
                                    onValueChanged={(e) => { 
                                        if (e.value != "" && primareVez == true) {
                                            const user = JSON.parse(localStorage.getItem("userData"));
                                            setFilters({ ...filters, region: e.value, cliente: user.cliente[0] });
                                            searchFormulario(user.cliente[0]) 
                                            searchEstablecimientos(e.value, e.element.innerText)
                                            setPrimeraVez(false);
                                        } else if(e.value != ""){
                                            setFilters({
                                                ...filters,
                                                region: e.value
                                            })
                                            searchEstablecimientos(e.value, e.element.innerText)
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-md-2 mt-2">
                                <SelectBox
                                    label='Formularios'
                                    searchEnabled
                                    dataSource={Formularios}
                                    defaultValue={filters.nombre}
                                    value={filters.nombre}
                                    valueExpr={"nombre"}
                                    displayExpr={"nombre"}
                                    onSelectionChanged={(e) => {
                                        searchProductsForms(e.selectedItem.nombre)
                                    }}
                                    onValueChanged={(e) => { 
                                        if (e.value != "") {
                                            setFilters({...filters, nombre: e.value});
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-md-2 mt-2">
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
                            <div className="col-md-2 mt-2">
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
        
        <div className="row mt-2 mx-2">

        <div className="col-md-12 mt-2">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex justify-content-around mb-4">
                        <div className="col-md-5">
                            <div className='mt-3'>
                                <TagBox
                                    id="tagBoxContainer"
                                    placeholder='Seleccione productos a consultar'
                                    items={ProductosForm}
                                    multiline={false}
                                    stylingMode={'filled'}
                                    width="100%"
                                    label=""
                                    labelMode={'floating'}
                                    maxDisplayedTags={3}
                                    showSelectionControls={true}
                                    onValueChanged={(e) => {
                                        setprecioProductos(e);
                                        onValueChangedProductoPrices(PrecioEstablecimiento, e)
                                    }}
                                >
                                    <Validator>
                                        <RequiredRule />
                                    </Validator>
                                </TagBox>
                                <Tooltip
                                    target="#tagBoxContainer"
                            hideEvent={hideEvent}
                            position="bottom"
                            visible={state.isTooltipVisible}
                                    onHiding={onTooltipHiding}
                                />
                            </div>
                        </div>
                    <div className="col-md-5">
                        <div className='mt-3'>
                            <TagBox
                                id="tagBoxContainer"
                                placeholder='Seleccione Establecimiento a consultar'
                                searchEnabled={true}
                                items={Establecimientos}
                                multiline={false}
                                stylingMode={'filled'}
                                width="100%"
                                label=""
                                labelMode={'floating'}
                                maxDisplayedTags={3}
                                showSelectionControls={true}
                                onValueChanged={(e) => {
                                    setPrecioEstablecimiento(e);
                                    onValueChangedProductoPrices(e, precioProductos)
                                }}
                            >
                                <Validator>
                                    <RequiredRule />
                                </Validator>
                            </TagBox>
                            <Tooltip
                                target="#tagBoxContainer"
                            hideEvent={hideEvent}
                            position="bottom"
                            visible={state.isTooltipVisible}
                                onHiding={onTooltipHiding}
                            />
                        </div>
                    </div>
                    </div>
                        <Chart id="chart"
                            title="Precios por Productos"
                            dataSource={Precios}
                            adjustOnZoom={true}

                        >
                            {/* <ZoomAndPan argumentAxis="both" /> */}
                            {/* <ScrollBar visible={true} /> */}
                            <CommonSeriesSettings
                                argumentField="sku"
                                type="bar"
                                hoverMode="allArgumentPoints"
                                selectionMode="allArgumentPoints"
                            >
                                <Label visible={true}>
                                    {/* <Format type="fixedPoint" precision={0} /> */}
                                </Label>
                            </CommonSeriesSettings>
                            <Series
                                argumentField="sku"
                                valueField="precio"
                                name="Precio"
                                // tagField="establecimientoPrecioMaximo"
                                color={'#2d2c55'}
                            />
                            {/* <Series
                                argumentField="sku"
                                valueField="precio_minimo"
                                name="precio mínimo"
                                tagField="establecimientoPrecioMinimo"
                                color={'#DD012D'}
                            /> */}
                            <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
                            {/* <Export enabled={true} /> */}
                            <Tooltip
                                enabled={true}
                                color="black"
                                customizeTooltip={customizeTooltip}
                            />
                        </Chart>
                    </div>
                </div>
            </div>

            <div className="col-md-12 mt-3">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-start">
                            <div className="col-md-6">
                                <div className='mt-3'>
                                    <TagBox
                                        id="tagBoxContainer"
                                        placeholder='Seleccione productos a consultar'
                                        items={ProductosForm}
                                        multiline={false}
                                        stylingMode={'filled'}
                                        width="100%"
                                        label=""
                                        labelMode={'floating'}
                                        maxDisplayedTags={3}
                                        showSelectionControls={true}
                                        onValueChanged={(e) => {
                                            onValueChangedProductoPreciosMAx(e)
                                        }}
                                    >
                                        <Validator>
                                            <RequiredRule />
                                        </Validator>
                                    </TagBox>
                                    <Tooltip
                                        target="#tagBoxContainer"
                                        hideEvent={hideEvent}
                                        position="bottom"
                                        visible={state.isTooltipVisible}
                                        onHiding={onTooltipHiding}
                                    />
                                </div>
                            </div>
                        </div>
                        <Chart id="chart"
                            title="Precios Máximos y Mínimos por Productos"
                            dataSource={DataPriceMAxAndMin}
                            adjustOnZoom={true}

                        >
                            {/* <ZoomAndPan argumentAxis="both" /> */}
                            {/* <ScrollBar visible={true} /> */}
                            <CommonSeriesSettings
                                argumentField="sku"
                                type="bar"
                                hoverMode="allArgumentPoints"
                                selectionMode="allArgumentPoints"
                            >
                                <Label visible={true}>
                                    {/* <Format type="fixedPoint" precision={0} /> */}
                                </Label>
                            </CommonSeriesSettings>
                            <Series
                                argumentField="sku"
                                valueField="precio_maximo"
                                name="precio máximo"
                                tagField="establecimientoPrecioMaximo"
                                color={'#2d2c55'}
                            />
                            <Series
                                argumentField="sku"
                                valueField="precio_minimo"
                                name="precio mínimo"
                                tagField="establecimientoPrecioMinimo"
                                color={'#DD012D'}
                            />
                            <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
                            {/* <Export enabled={true} /> */}
                            <Tooltip
                                enabled={true}
                                color="black"
                                customizeTooltip={customizeTooltip}
                            />
                        </Chart>
                    </div>
                </div>
            </div>        

            <div className="col-md-12 mt-4">
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-around mb-4">
                            <div className="col-md-5">
                    <div className='mt-3'>
                        <TagBox
                            id="tagBoxContainer"
                            placeholder='Seleccione productos a consultar'
                            items={ProductosForm}
                            multiline={false}
                            stylingMode={'filled'}
                            width="100%"
                            label=""
                            labelMode={'floating'}
                            maxDisplayedTags={3}
                            showSelectionControls={true}
                            onValueChanged={(e) => {
                                setProductosSelect(e);
                                onValueChangedProductoPrecios(EstablecSelect, e)
                            }}
                        >
                            <Validator>
                                <RequiredRule />
                            </Validator>
                        </TagBox>
                        <Tooltip
                            target="#tagBoxContainer"
                            hideEvent={hideEvent}
                            position="bottom"
                            visible={state.isTooltipVisible}
                            onHiding={onTooltipHiding}
                        />
                    </div>
                            </div>
                            <div className="col-md-5">
                    <div className='mt-3'>
                        <TagBox
                            id="tagBoxContainer"
                            placeholder='Seleccione Establecimiento a consultar'
                            searchEnabled={true}
                            items={Establecimientos}
                            multiline={false}
                            stylingMode={'filled'}
                            width="100%"
                            label=""
                            labelMode={'floating'}
                            maxDisplayedTags={3}
                            showSelectionControls={true}
                            onValueChanged={(e) => {
                                setEstablecSelect(e);
                                onValueChangedProductoPrecios(e, ProductosSelect)
                            }}
                        >
                            <Validator>
                                <RequiredRule />
                            </Validator>
                        </TagBox>
                        <Tooltip
                            target="#tagBoxContainer"
                            hideEvent={hideEvent}
                            position="bottom"
                            visible={state.isTooltipVisible}
                            onHiding={onTooltipHiding}
                        />
                    </div>
                            </div>
                        </div>
                        <Chart
                            palette="Material"
                            dataSource={DataPromedio}
                            title="Promedio"
                        >
                            <CommonSeriesSettings
                                argumentField="sku"
                                type={'spline'}
                            />
                            <CommonAxisSettings>
                                <Grid visible={true} />
                            </CommonAxisSettings>
                            {
                                architectureSourcesP.map((item) => <Series
                                    key={item.value}
                                    valueField={item.value}
                                    name={item.name} />)
                            }
                            <Margin bottom={20} />
                            <ArgumentAxis
                                allowDecimals={false}
                                axisDivisionFactor={60}
                            >
                                <Label>
                                    <Format type="decimal" />
                                </Label>
                            </ArgumentAxis>
                            <Legend
                                verticalAlignment="top"
                                horizontalAlignment="right"
                            />
                            {/* <Export enabled={true} /> */}
                            <Tooltip enabled={true} />
                        </Chart>
                    </div>
                </div>
            </div>

            <div className="col-md-6 mt-4">
                <div className="card">
                    <div className="card-body">
                        <Chart
                            palette="Material"
                            dataSource={DataMediana}
                            title="Mediana"
                        >
                            <CommonSeriesSettings
                                argumentField="sku"
                                type={'spline'}
                            />
                            <CommonAxisSettings>
                                <Grid visible={true} />
                            </CommonAxisSettings>
                            {
                                architectureSourcesMe.map((item) => <Series
                                    key={item.value}
                                    valueField={item.value}
                                    name={item.name} />)
                            }
                            <Margin bottom={20} />
                            <ArgumentAxis
                                allowDecimals={false}
                                axisDivisionFactor={60}
                            >
                                <Label>
                                    <Format type="decimal" />
                                </Label>
                            </ArgumentAxis>
                            <Legend
                                verticalAlignment="top"
                                horizontalAlignment="right"
                            />
                            <Export enabled={true} />
                            <Tooltip enabled={true} />
                        </Chart>
                    </div>
                </div>
            </div>

            
            <div className="col-md-6 mt-4">
                <div className="card">
                    <div className="card-body">
                        <Chart
                            palette="Material"
                            dataSource={DataModa}
                            title="Moda"
                        >
                            <CommonSeriesSettings
                                argumentField="sku"
                                type={'spline'}
                            />
                            <CommonAxisSettings>
                                <Grid visible={true} />
                            </CommonAxisSettings>
                            {
                                architectureSourcesMo.map((item) => <Series
                                    key={item.value}
                                    valueField={item.value}
                                    name={item.name} />)
                            }
                            <Margin bottom={20} />
                            <ArgumentAxis
                                allowDecimals={false}
                                axisDivisionFactor={60}
                            >
                                <Label>
                                    <Format type="decimal" />
                                </Label>
                            </ArgumentAxis>
                            <Legend
                                verticalAlignment="top"
                                horizontalAlignment="right"
                            />
                            <Export enabled={true} />
                            <Tooltip enabled={true} />
                        </Chart>
                    </div>
                </div>
            </div>

            {/* <div className="col-md-6">
                <div className='mt-4'>
                    <TagBox
                        items={positions}
                        defaultValue={defaultPosition}
                        multiline={false}
                        stylingMode={'filled'}
                        width="100%"
                        label="Establecimientos"
                        labelMode={'floating'}
                    >
                        <Validator>
                            <RequiredRule />
                        </Validator>
                    </TagBox>
                </div>
            </div>
            <div className="col-md-6">
                <div className='mt-4'>
                    <TagBox
                        items={positions}
                        defaultValue={defaultPosition}
                        multiline={false}
                        stylingMode={'filled'}
                        width="100%"
                        label="Productos"
                        labelMode={'floating'}
                    >
                        <Validator>
                            <RequiredRule />
                        </Validator>
                    </TagBox>
                </div>
            </div> */}
            <div className="col-md-12">
                {/* <Chart
                    title="Prductos VS Competencia"
                    dataSource={data}
                    id="chart"
                    rotated={true}
                    barGroupWidth={18}
                >
                    <CommonSeriesSettings
                        type="stackedbar"
                        argumentField="age"
                    />
                    <Series
                        valueField="male"
                        name="Productos"
                        color="#3F7FBF"
                    />
                    <Series
                        valueField="female"
                        name="Competencia"
                        color="#F87CCC"
                    />
                    <Tooltip
                        enabled={true}
                        customizeTooltip={customizeTooltip}
                    />
                    <ValueAxis>
                        <Label customizeText={customizeLabel} />
                    </ValueAxis>
                    <Legend
                        verticalAlignment="bottom"
                        horizontalAlignment="center"
                    >
                    <Margin left={50} />
                    </Legend>
                </Chart> */}
            </div>
        </div>

    </React.Fragment>
)}

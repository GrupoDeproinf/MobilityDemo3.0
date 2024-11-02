import * as DinamicQueries from '../../../api/DinamicsQuery';
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import React, { useState, useEffect } from 'react';
import moment from 'moment/moment';

import Chart, {
    ArgumentAxis,
    Legend,
    Series,
    ValueAxis,
    Label,
    Export,
    Tick,
    CommonSeriesSettings,
    Format,
    ZoomAndPan, 
    ScrollBar,
} from 'devextreme-react/chart';

import PieChart, {
    SmallValuesGrouping,
    Connector,
} from 'devextreme-react/pie-chart';


export default function HomeEffectiveness() {
    const [Formularios, setFormularios] = useState([]);
    const [Formularioscards, setFormulaiosCards] = useState([]);
    const [CantidadEstablecimitos, setCantidadEstablecimitos] = useState();
    const [PromedioEstablecimiento, setPromedioEstablecimiento] = useState([]);
    const [Clientes, setClientes] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const [Usuarios, setUsuarios] = useState([]);
    const [Promedio, setPromedio] = useState([]);
    const [fechaInicialDesde, setfechaInicial] = useState(
        new Date(new Date().setDate(new Date().getDate() - 7))
    );
    const [fechaFinalHasta, setFechaFinal] = useState(new Date());

    const InitialStateFilters = {
        cliente: '',
        nombre: 'Informacion General',
        region: '',
        FechaInicial:  new Date(new Date().setDate(new Date().getDate() - 7)),
        FechaFinal: new Date(),
        uid_promotor: 'Todos_los_usuarios',
    };
    const [filters, setFilters] = useState(InitialStateFilters);
    const now = new Date();
    const minDate = moment(new Date()).subtract(3, 'months')
    
    const [dataUsersChart, setDataUsersChart] = useState([]);
    const [FormsPercent, setFormsPercent] = useState([]);
    const [primareVez, setPrimeraVez] = useState(true);

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userData"));
        const filtros = { ...filters, cliente: user?.cliente[0],  region: user.region[0]}
        setFilters(filtros)
        setClientes(user.cliente);
        setRegiones(user.region);
        searchKpiData(filtros, 'Usuarios')
        setTimeout(() => {
          searchPromedio(filtros, 'Formularios')
          searchPromedioEstablecimientos(filtros, 'Formularios')
        }, 4000)
    }, [])


    const customizeText = (e) => {
        return `${e.value}`;
    };
    
    const customizeLabel = (point) => {
        return `${point.argumentText}: ${point.valueText}%`;
    }
    
    const searchKpiData = (value, item) => {
      if (value != "") {
        if(item === 'Formularios'){
          DinamicQueries.getDataWithParameters('getEffectivenessGraphics', "home/",  {cliente: filters.cliente, region: filters.region, nombre: value, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal, uid_promotor: filters.uid_promotor })
          .then(DataKpi => {
          console.log("🚀 ~ file: home.js ~ line 227 ~ searchKpiData ~ DataKpi", DataKpi.data)
              setDataUsersChart(DataKpi.data.chart1)
              setFormsPercent(DataKpi.data.chart2)
              setFormulaiosCards(DataKpi.data.kpi.formularios)
              setCantidadEstablecimitos(DataKpi.data.kpi.cantidadFormVisit)
          })
        }else if(item === 'Usuarios'){
          if(value.cliente == undefined){
            value = {
              cliente: filters.cliente,
              region: filters.region, 
              uid_promotor: value
            }
          }
          DinamicQueries.getDataWithParameters('getEffectivenessGraphics', "home/", {cliente: value.cliente, region: value.region, nombre: filters.nombre, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal, uid_promotor: value.uid_promotor })
          .then(DataKpi => {
          console.log("🚀 ~ file: home.js ~ line 227 ~ searchKpiData ~ DataKpi", DataKpi.data)
              setDataUsersChart(DataKpi.data.chart1)
              setFormsPercent(DataKpi.data.chart2)
              setFormulaiosCards(DataKpi.data.kpi.formularios)
              setCantidadEstablecimitos(DataKpi.data.kpi.cantidadFormVisit)
          })
        }
      }
    }

    const searchUsuarios = (e, item) => {
      if (e != "") {
        if(item === 'Clientes'){
            let Users = []
            setUsuarios([])
            DinamicQueries.getDataWithParameters('getUserClientAndRegion', "usuarios/", {cliente: e, region: filters.region})
            .then(usuarios => {
              console.log("🚀 ~ file: homeEffectiveness.js ~ line 115 ~ searchUsuarios ~ usuarios", usuarios)
              Users = [{
                nombre: 'Todos los usuarios',
                uid: 'Todos_los_usuarios'
              }, ... usuarios.data]
              setUsuarios(Users)
            })
          } else if(item === 'Regiones') {
            let Users = []
            setUsuarios([]);

            const user = JSON.parse(localStorage.getItem("userData"));
            let cliente = primareVez === true ? user.cliente[0] : filters.cliente;

            DinamicQueries.getDataWithParameters('getUserClientAndRegion', "usuarios/", {cliente: cliente, region: e})
            .then(usuarios => {
              console.log("🚀 ~ file: homeEffectiveness.js ~ line 130 ~ searchUsuarios ~ usuarios", usuarios)
              Users = [{
                nombre: 'Todos los usuarios',
                uid: 'Todos_los_usuarios'
              }, ... usuarios.data]
              setUsuarios(Users)
            })
          }
      }
    };

    const searchFormulario = (e) => {
        if (e != "") {
            let forms = []
            setFormularios([])
            DinamicQueries.getDataWithParameters('getFormsWeb', 'formularios/',  { cliente: e } ).then((resp) => {
                forms = [{
                nombre: 'Informacion General'
            }, ...resp.data.data]
                setFormularios(forms);
            });
        } 
    };

    const searchPromedio = (e, item) => {
      if (e != "") {
        if(item === 'Formularios'){
          if(e.cliente == undefined){
            e = {
              cliente: filters.cliente,
              region: filters.region, 
              uid_promotor: filters.uid_promotor
            }
          }
          DinamicQueries.getDataWithParameters('AverageEstablishmentsVisited', "home/", {cliente: e.cliente, region: e.region, uid_promotor: e.uid_promotor, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
          .then(DataKpi => {
            setPromedio(DataKpi.data)
          })
        } else if(item === 'Usuarios'){
          if(e.cliente == undefined){
            e = {
              cliente: filters.cliente,
              region: filters.region, 
              uid_promotor: e
            }
          }
          DinamicQueries.getDataWithParameters('AverageEstablishmentsVisited', "home/", {cliente: e.cliente, region: e.region, uid_promotor: e.uid_promotor, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
          .then(DataKpi => {
            setPromedio(DataKpi.data)
          })
        }
      }
    }

    const searchPromedioEstablecimientos = (e, item) => {
      if (e != "") {
        if(item === 'Formularios'){
          if(e.cliente == undefined){
            e = {
              cliente: filters.cliente,
              region: filters.region, 
              uid_promotor: filters.uid_promotor
            }
          }
          let Data = [];
          DinamicQueries.getDataWithParameters('AverageEstablishmentsVisit', "home/", {cliente: e.cliente, region: e.region, uid_promotor: e.uid_promotor, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
          .then(DataKpi => {
            DataKpi.data.forEach(element => {
              Data = [...Data, {
                nombre_usuario: element.nombre_usuario,
                promedio: Number(Math.round(element.promedio)),
                suma: element.suma
              }] 
            });
            setPromedioEstablecimiento(Data)
          })
        } else if(item === 'Usuarios'){
          if(e.cliente == undefined){
            e = {
              cliente: filters.cliente,
              region: filters.region, 
              uid_promotor: e
            }
          }
          let Data = [];
          DinamicQueries.getDataWithParameters('AverageEstablishmentsVisit', "home/", {cliente: e.cliente, region: e.region, uid_promotor: e.uid_promotor, FechaInicial: filters.FechaInicial, FechaFinal: filters.FechaFinal})
          .then(DataKpi => {
            DataKpi.data.forEach(element => {
              Data = [...Data, {
                nombre_usuario: element.nombre_usuario,
                promedio: Number(Math.round(element.promedio)),
                suma: element.suma
              }] 
            });
            setPromedioEstablecimiento(Data)
          })
        }
      }
    }

return (
  <React.Fragment>
    {/* <h4 className='mt-4'>Dashboard</h4> */}

    <div className="row mt-2 mx-2">
      <div className="col-md-12 ">
        <div className="card">
          <div className="inputsFilter card-body">
            <div className="row">
              <div className="col-md-2">
                <SelectBox
                  label='Clientes'
                  searchEnabled
                  dataSource={Clientes}
                  defaultValue={filters.cliente}
                  value={filters.cliente}
                  onSelectionChanged={(e) => {
                      searchFormulario(e.selectedItem); 
                      searchUsuarios(e.selectedItem, e.element.innerText)
                  }}
                  onValueChanged={(e) => {
                    if (e.value != "") {
                      setFilters({ ...filters, cliente: e.value })
                      searchFormulario(e.value); 
                      // searchUsuarios(e.value, e.element.innerText)
                    }
                  }}
                />
              </div>
              <div className="col-2">
                <SelectBox
                  label='Regiones'
                  searchEnabled
                  dataSource={Regiones}
                  defaultValue={filters.region}
                  value={filters.region}
                  onSelectionChanged={(e) => {
                    if(e.selectedItem){
                      searchUsuarios(e.selectedItem, e.element.innerText)
                    }
                  }}
                  onValueChanged={(e) => {
                    if (e.value != "" && primareVez == true) {
                      const user = JSON.parse(localStorage.getItem("userData"));
                      setFilters({ ...filters, region: e.value, cliente: user.cliente[0] });
                      searchUsuarios( e.value, e.value)
                      setPrimeraVez(false);
                    }else if(e.value != ""){
                      setFilters({ ...filters, region: e.value});
                      searchUsuarios(e.value, e.element.innerText)
                    }
                  }}
                />
              </div>
              <div className="col-md-2">
                <SelectBox
                  label='Formularios'
                  searchEnabled
                  dataSource={Formularios}
                  defaultValue={filters.nombre}
                  value={filters.nombre}
                  valueExpr="nombre"
                  displayExpr={"nombre"}
                  onSelectionChanged={(e) => {
                    searchKpiData(e.selectedItem.nombre, e.element.innerText);
                    searchPromedio(e.selectedItem.nombre, e.element.innerText);
                    searchPromedioEstablecimientos(e.selectedItem.nombre, e.element.innerText)
                  }}
                  onValueChanged={(e)=>{
                    if (e.value != "") {
                      setFilters({...filters, nombre: e.value})
                    }
                  }}
                />
              </div>
              <div className="col-md-2">
                <SelectBox
                  label='Usuarios'
                  searchEnabled
                  dataSource={Usuarios}
                  defaultValue={filters.uid_promotor}
                  value={filters.uid_promotor}
                  valueExpr="uid"
                  displayExpr={"nombre"}
                  onSelectionChanged={(e) => {
                    searchKpiData(e.selectedItem.uid, e.element.innerText);
                    searchPromedio(e.selectedItem.uid, e.element.innerText);
                    searchPromedioEstablecimientos(e.selectedItem.nombre, e.element.innerText)
                  }}
                  onValueChanged={(e)=>{
                    if (e.value != "") {
                      setFilters({...filters, uid_promotor: e.value})
                    }
                  }}
                />
              </div>
              <div className="col-2">
                <DateBox
                  label='Desde'
                  max={now}
                  min={minDate}
                  type='date'
                  defaultValue={fechaInicialDesde}
                  value={fechaInicialDesde}
                  onValueChanged={(e) => {
                    setFilters({
                      ...filters,
                      FechaInicial: new Date(e.value),
                    });
                    setfechaInicial(e.value)
                  }}
                />
              </div>
              <div className="col-2">
                <DateBox
                  label='Hasta'
                  max={now}
                  min={minDate}
                  type='date'
                  defaultValue={fechaFinalHasta}
                  value={fechaFinalHasta}
                  onValueChanged={(e) => {
                    setFilters({
                      ...filters,
                      FechaFinal: new Date(e.value),
                    })
                    setFechaFinal(e.value)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row justify-content-center mt-2 mx-2">
        {
          Formularioscards.map((cadaForm)=>{
            return (
              cadaForm.length != 0 ? (
              <div className="col-md-4 mt-2">
                <div className="card cardInfo">
                  <p>{cadaForm.nombre}</p>
                  <p className='numberEst'>{cadaForm.cantidad}</p>
                  <p>Formularios Sincronizados</p>
                </div>
              </div>
                ) : ''
            )
          })
        }
        <div className="col-md-4 mt-2">
          <div className="card cardInfo">
            <p>Establecimientos</p>
            <p className='numberEst'>{CantidadEstablecimitos}</p>
            <p>Establecimientos visitados</p>
          </div>
        </div>
    </div>

    <div className="row mt-3 mx-2 graficos">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Chart
                title="Formularios Sincronizados"
                className='grafico'
                dataSource={dataUsersChart}
                rotated={true}
                id="chart"
              >
                <ArgumentAxis>
                  <Label customizeText={customizeText} />
                </ArgumentAxis>
              
                <ValueAxis>
                  <Tick visible={false} />
                  <Label visible={false} />
                </ValueAxis>home
              
                <Series
                  valueField="formulario"
                  argumentField="nombre"
                  type="bar"
                  color="#039BBD"
                >
                  <Label visible={true} backgroundColor="#F49F3C" />
                </Series>
              
                <Legend visible={false} />
              
                <Export enabled={true} />
              
              </Chart>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Chart id="chart"
                title="Promedio Formularios Sincronizados"
                className='grafico'
                dataSource={Promedio}
                rotated={true}
              >
                {/* <ZoomAndPan argumentAxis="both" />
                <ScrollBar visible={true} /> */}
                <CommonSeriesSettings
                  argumentField="Promotor"
                  type="bar"
                  hoverMode="allArgumentPoints"
                  selectionMode="allArgumentPoints"
                >
                  <Label visible={true} backgroundColor="#F49F3C">
                    {/* <Format type="fixedPoint" /> */}
                  </Label>
                </CommonSeriesSettings>
                <Series
                  argumentField="Promotor"
                  valueField="promedio"
                  name="Promedio"
                  color="#039BBD"
                />
                {/* <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend> */}
                <Legend visible={false} />
                <Export enabled={true} />
              </Chart>
            </div>
          </div>
        </div>

        <div className="col-md-6 mt-2">
          <div className="card">
            <div className="card-body">
              <PieChart
                id="pie"
                type="doughnut"
                title="Porcentaje de Formularios Sincronizados"
                palette={['#039BBD', '#005B84', '#1CD1A1', '#F29017']}
                dataSource={FormsPercent}
                className='grafico'
              >
                <Series argumentField="nombre" valueField="percent">
                  <SmallValuesGrouping mode="topN" topCount={3} />
                  <Label
                    visible={true}
                    format="fixedPoint"
                    customizeText={customizeLabel}
                    backgroundColor='#F49F3C'
                  >
                    <Connector visible={true} width={1} />
                  </Label>
                </Series>
                <Export enabled={true} />
                <Legend horizontalAlignment="center" verticalAlignment="bottom" />
              </PieChart>
            </div>
          </div>
        </div>

        <div className="col-md-6 mt-2">
          <div className="card">
            <div className="card-body">
              <Chart id="chart"
                title="Promedio Establecimientos Visitados"
                className='grafico'
                dataSource={PromedioEstablecimiento}
                rotated={true}
              >
                {/* <ZoomAndPan argumentAxis="both" />
                <ScrollBar visible={true} /> */}
                <CommonSeriesSettings
                  argumentField="nombre_usuario"
                  type="bar"
                  hoverMode="allArgumentPoints"
                  selectionMode="allArgumentPoints"
                >
                  <Label visible={true} backgroundColor="#F49F3C">
                    <Format type="fixedPoint" />
                  </Label>
                </CommonSeriesSettings>
                <Series
                  argumentField="nombre_usuario"
                  valueField="promedio"
                  name="Promedio"
                  color="#039BBD"
                />
                {/* <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend> */}
                <Legend visible={false} />
                <Export enabled={true} />
              </Chart>
            </div>
          </div>
        </div>
    </div>
  </React.Fragment>
)}
import React, { useEffect, useState } from 'react';
import * as DinamicQueries from '../../api/DinamicsQuery';
import moment from 'moment';

//Elementos DevExpress
import ScrollView from "devextreme-react/scroll-view";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import { TextBox } from "devextreme-react/text-box";
import { CheckBox } from 'devextreme-react/check-box';
import { NumberBox } from "devextreme-react/number-box";
import { SelectBox } from 'devextreme-react/select-box';
import LoadIndicator from "devextreme-react/load-indicator";

// modulo de mapa de Google
import MapGoogle from "./widgets/MapGoogle";

//CSS
import './newEstablishment.scss';
import { fire } from '../../api/firebaseEnv';

const NewEstablishment = (props) => {
    const { showpopup, hidepopup, idtoedit, successsave } = props;

    const [ID, setID] = useState('');
    const [RIF, setRIF] = useState('');
    const [pais, setPais] = useState({});
    const [canal, setCanal] = useState({});
    const [paises, setPaises] = useState([]);
    const [estado, setEstado] = useState({});
    const [ciudad, setCiudad] = useState({});
    const [region, setRegion] = useState({});
    const [cadena, setCadena] = useState({});
    const [latLng, setLatLng] = useState('');
    const [zelle, setZelle] = useState(false);
    const [placeID, setPlaceID] = useState('');
    const [canales, setCanales] = useState([]);
    const [estados, setEstados] = useState([]);
    const [cadenas, setCadenas] = useState([]);
    const [paypal, setPaypal] = useState(false);
    const [regiones, setRegiones] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [userData, setUserData] = useState('');
    const [telefono, setTelefono] = useState('');
    const [estatus, setEstatus] = useState(false);
    const [neveras, setNeveras] = useState(false);
    const [municipio, setMunicipio] = useState({});
    const [parroquia, setParroquia] = useState({});
    const [delivery, setDelivery] = useState(false);
    const [farmacia, setFarmacia] = useState(false);
    const [fruteria, setFruteria] = useState(false);
    const [municipios, setMunicipios] = useState([]);
    const [parroquias, setParroquias] = useState([]);
    const [pagoMovil, setPagoMovil] = useState(false);
    const [licoreria, setLicoreria] = useState(false);
    const [panaderia, setPanaderia] = useState(false);
    const [dataFiltros, setDataFiltros] = useState([]);
    const [razonSocial, setRazonSocial] = useState('');
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [pescaderia, setPescaderia] = useState(false);
    const [carniceria, setCarniceria] = useState(false);
    const [codigoPostal, setCodigoPostal] = useState('');
    const [urbanizacion, setUrbanizacion] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [disableSave, setDisableSave] = useState(false);
    const [charcuteria, setCharcuteria] = useState(false);
    const [nombreGerente, setNombreGerente] = useState('');
    const [nombreOficina, setNombreOficina] = useState('');
    const [cantidadCajas, setCantidadCajas] = useState('');
    const [urbanizaciones, setUrbanizaciones] = useState([]);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [nombreEstablecimiento, setNombreEstablecimiento] = useState('');
    const [direccionEstablecimiento, setDireccionEstablecimiento] = useState('');

    const handleSubmit = async () => {
        setDisableSave(true);
        setIsLoadingSave(true);

        if (ID !== '') {
            const temp_estatus = estatus === false ? "Inactivo" : "Activo";

            const TempDataFinal = {
                ID: ID,
                ID_FD_GOOGLE: placeID,
                cant_cajas: cantidadCajas,
                codigo_cadena: Object.keys(cadena)?.length !== 0 ? cadena.codigo_cadena : '',
                codigo_canal: Object.keys(canal)?.length !== 0 ? canal.codigo_canal : '',
                codigo_ciudad: Object.keys(ciudad)?.length !== 0 ? ciudad.codigo_ciudad : '',
                codigo_estado: Object.keys(estado)?.length !== 0 ? estado.codigo_estado : '',
                codigo_manzana: "",
                codigo_municipio: Object.keys(municipio)?.length !== 0 ? municipio.codigo_municipio : '',
                codigo_oficina: "",
                codigo_pais: Object.keys(pais)?.length !== 0 ? pais.codigo_pais : '',
                codigo_parroquia: Object.keys(parroquia)?.length !== 0 ? parroquia.codigo_parroquia : '',
                codigo_postal: codigoPostal.toString().trim(),
                codigo_region: Object.keys(region)?.length !== 0 ? region.cod_region : '',
                codigo_urbanizacion: Object.keys(urbanizacion)?.length !== 0 ? urbanizacion.codigo_urbanizacion : '',
                coordenadas: latLng,
                delivery: delivery,
                direccion: direccionEstablecimiento,
                estatus: temp_estatus,
                fecha_modify: moment(new Date()).format('YYYY-MM-DD hh:mm:ss a'),
                horarios: [],
                key: idtoedit,
                login_modify: userData.nombre,
                metodos_pago: { pago_movil: pagoMovil, paypal: paypal, zelle: zelle },
                neveras: neveras,
                nombre_cadena: Object.keys(cadena)?.length !== 0 ? cadena.nombre_cadena : '',
                nombre_canal: Object.keys(canal)?.length !== 0 ? canal.nombre_canal : '',
                nombre_ciudad: Object.keys(ciudad)?.length !== 0 ? ciudad.nombre_ciudad : '',
                nombre_establecimiento: nombreEstablecimiento.toUpperCase().trim(),
                nombre_estado: Object.keys(estado)?.length !== 0 ? estado.nombre_estado : '',
                nombre_gerente: nombreGerente.toUpperCase().trim(),
                nombre_municipio: Object.keys(municipio)?.length !== 0 ? municipio.nombre_municipio : '',
                nombre_oficina: nombreOficina.toString().toUpperCase().trim(),
                nombre_parroquia: Object.keys(parroquia)?.length !== 0 ? parroquia.nombre_parroquia : '',
                nombre_region: Object.keys(region)?.length !== 0 ? region.nombre_region : '',
                nombre_urbanizacion: Object.keys(urbanizacion)?.length !== 0 ? urbanizacion.nombre_urbanizacion : '',
                pais: Object.keys(pais)?.length !== 0 ? pais.nombre_pais : '',
                razon_social: razonSocial.toUpperCase().trim(),
                rif: RIF.toString().trim(),
                secciones: {
                    carniceria: carniceria,
                    charcuteria: charcuteria,
                    farmacia: farmacia,
                    fruteria: fruteria,
                    licoreria: licoreria,
                    panaderia: panaderia,
                    pescaderia: pescaderia
                },
                telefonos: telefono.toString().trim(),
                uid_canal: Object.keys(canal)?.length !== 0 ? canal.key : '',
                uid_ciudad: Object.keys(ciudad)?.length !== 0 ? ciudad.key : '',
                uid_estado: Object.keys(estado)?.length !== 0 ? estado.key : '',
                uid_municipio: Object.keys(municipio)?.length !== 0 ? municipio.key : '',
                uid_pais: Object.keys(pais)?.length !== 0 ? pais.key : '',
                uid_parroquia: Object.keys(parroquia)?.length !== 0 ? parroquia.key : '',
                uid_region: Object.keys(region)?.length !== 0 ? region.key : '',
                uid_urbanizacion: Object.keys(urbanizacion)?.length !== 0 ? urbanizacion.key : '',
                uid_cadena: Object.keys(cadena)?.length !== 0 ? cadena.key : ''
            }

            DinamicQueries.getDataWithParameters("updateEstablishment", "EstablecimientosNuevos/", { dataFinal: TempDataFinal }).then((resp) => {
                setDisableSave(false);
                setIsLoadingSave(false);
                hidepopup();
                successsave();
            }).catch((e) => {
                console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ e:", e)
                setDisableSave(false);
                setIsLoadingSave(false);
            })
        } else {
            const temp_estatus = estatus === false ? "Inactivo" : "Activo";
            let newID = 0

            const LastID = await fire.collection('establecimientos').orderBy("ID", "desc").limit(1).get();

            LastID.forEach((ultimoDocumento) => {
                const TempDoc = ultimoDocumento.data();
                newID = TempDoc.ID + 1
            })

            const TempDataFinal = {
                ID: newID,
                ID_FD_GOOGLE: placeID,
                cant_cajas: cantidadCajas,
                codigo_cadena: Object.keys(cadena).length !== 0 ? cadena.codigo_cadena : '',
                codigo_canal: Object.keys(canal).length !== 0 ? canal.codigo_canal : '',
                codigo_ciudad: Object.keys(ciudad).length !== 0 ? ciudad.codigo_ciudad : '',
                codigo_estado: Object.keys(estado).length !== 0 ? estado.codigo_estado : '',
                codigo_manzana: "",
                codigo_municipio: Object.keys(municipio).length !== 0 ? municipio.codigo_municipio : '',
                codigo_oficina: "",
                codigo_pais: Object.keys(pais).length !== 0 ? pais.codigo_pais : '',
                codigo_parroquia: Object.keys(parroquia).length !== 0 ? parroquia.codigo_parroquia : '',
                codigo_postal: codigoPostal.toString().trim(),
                codigo_region: Object.keys(region).length !== 0 ? region.cod_region : '',
                codigo_urbanizacion: Object.keys(urbanizacion).length !== 0 ? urbanizacion.codigo_urbanizacion : '',
                coordenadas: latLng,
                delivery: delivery,
                direccion: direccionEstablecimiento,
                estatus: temp_estatus,
                fecha_modify: "",
                fecha_registro: moment(new Date()).format('YYYY-MM-DD hh:mm:ss a'),
                horarios: [],
                key: "",
                login_modify: "",
                login_registro: userData.nombre,
                metodos_pago: { pago_movil: pagoMovil, paypal: paypal, zelle: zelle },
                neveras: neveras,
                nombre_cadena: Object.keys(cadena).length !== 0 ? cadena.nombre_cadena : '',
                nombre_canal: Object.keys(canal).length !== 0 ? canal.nombre_canal : '',
                nombre_ciudad: Object.keys(ciudad).length !== 0 ? ciudad.nombre_ciudad : '',
                nombre_establecimiento: nombreEstablecimiento.toUpperCase().trim(),
                nombre_estado: Object.keys(estado).length !== 0 ? estado.nombre_estado : '',
                nombre_gerente: nombreGerente.toUpperCase().trim(),
                nombre_municipio: Object.keys(municipio).length !== 0 ? municipio.nombre_municipio : '',
                nombre_oficina: nombreOficina.toString().toUpperCase().trim(),
                nombre_parroquia: Object.keys(parroquia).length !== 0 ? parroquia.nombre_parroquia : '',
                nombre_region: Object.keys(region).length !== 0 ? region.nombre_region : '',
                nombre_urbanizacion: Object.keys(urbanizacion).length !== 0 ? urbanizacion.nombre_urbanizacion : '',
                pais: Object.keys(pais).length !== 0 ? pais.nombre_pais : '',
                razon_social: razonSocial.toUpperCase().trim(),
                revisado: false,
                rif: RIF.toString().trim(),
                secciones: {
                    carniceria: carniceria,
                    charcuteria: charcuteria,
                    farmacia: farmacia,
                    fruteria: fruteria,
                    licoreria: licoreria,
                    panaderia: panaderia,
                    pescaderia: pescaderia
                },
                telefonos: telefono.toString().trim(),
                uid_canal: Object.keys(canal).length !== 0 ? canal.key : '',
                uid_ciudad: Object.keys(ciudad).length !== 0 ? ciudad.key : '',
                uid_estado: Object.keys(estado).length !== 0 ? estado.key : '',
                uid_municipio: Object.keys(municipio).length !== 0 ? municipio.key : '',
                uid_pais: Object.keys(pais).length !== 0 ? pais.key : '',
                uid_parroquia: Object.keys(parroquia).length !== 0 ? parroquia.key : '',
                uid_region: Object.keys(region).length !== 0 ? region.key : '',
                uid_urbanizacion: Object.keys(urbanizacion).length !== 0 ? urbanizacion.key : '',
                uid_cadena: Object.keys(cadena).length !== 0 ? cadena.key : ''
            }

            DinamicQueries.getDataWithParameters("saveNewEstablishment", "EstablecimientosNuevos/", { dataFinal: TempDataFinal }).then((resp) => {
                setDisableSave(false);
                setIsLoadingSave(false);
                hidepopup();
                successsave();
            }).catch((e) => {
                console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ e:", e)
                setDisableSave(false);
                setIsLoadingSave(false);
            })

        }
    }

    const saveButtonOptions = {
        icon: "check",
        text: "Guardar",
        onClick: handleSubmit,
        // disabled: !isFormValid,
    };

    const getDireccionEstablecimiento = (direccion, placeId, latLng) => {
        setDireccionEstablecimiento(direccion);
        setPlaceID(placeId);
        setLatLng(latLng);
    };

    const validateForm = () => {
        if (nombreEstablecimiento.trim() !== '' && Object.keys(pais).length !== 0 && Object.keys(estado).length !== 0 && Object.keys(region).length !== 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    const getEstablishmentData = (idtoedit) => {
        DinamicQueries.getDataWithParameters('getEstablishmentData', 'EstablecimientosNuevos/', { id: idtoedit }).then((resp) => {
            console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ resp:", resp.data)
            const estatus = resp.data.estatus === 'Activo' ? true : false;

            setNombreEstablecimiento(resp.data.nombre_establecimiento);
            setDireccionEstablecimiento(resp.data.direccion);
            setPagoMovil(resp.data.metodos_pago?.pago_movil);
            setCharcuteria(resp.data.secciones?.charcuteria);
            setNombreGerente(resp.data.nombre_gerente);
            setNombreOficina(resp.data.nombre_oficina);
            setPescaderia(resp.data.secciones?.pescaderia);
            setCarniceria(resp.data.secciones?.carniceria);
            setCodigoPostal(resp.data.codigo_postal);
            setLicoreria(resp.data.secciones?.licoreria);
            setPanaderia(resp.data.secciones?.panaderia);
            setRazonSocial(resp.data.razon_social);
            setFarmacia(resp.data.secciones?.farmacia);
            setFruteria(resp.data.secciones?.fruteria);
            setPaypal(resp.data.metodos_pago?.paypal);
            setPlaceID(resp.data.ID_FD_GOOGLE);
            setZelle(resp.data.metodos_pago?.zelle);
            setCantidadCajas(resp.data.cant_cajas);
            setTelefono(resp.data.telefonos);
            setLatLng(resp.data.coordenadas);
            setDelivery(resp.data.delivery);
            setNeveras(resp.data.neveras);
            setRIF(resp.data.rif);
            setEstatus(estatus);
            setID(resp.data.ID);
            validateForm();

            let searchCadena = cadenas.find((x) => x.codigo_cadena === resp.data.codigo_cadena);
            setCadena(searchCadena ?? {});
            let searchCanal = canales.find((x) => x.codigo_canal === resp.data.codigo_canal);
            setCanal(searchCanal ?? {})
            let searchPais = paises.find((x) => x.nombre_pais === resp.data.pais.toUpperCase());
            setPais(searchPais ?? {});
            handleChangePais({ value: searchPais }, true, resp.data);
        }).catch((e) => {
            console.log("🚀 ~ DinamicQueries.getDataWithParameters ~ e:", e)
        })
    };

    const getFiltersData = () => {
        setLoadingAPI(true);

        DinamicQueries.getData('getFilters', 'EstablecimientosNuevos/').then((resp) => {
            setDataFiltros(resp.data);
            setPaises(resp.data[0].paises);
            setCanales(resp.data[7].canales);
            setCadenas(resp.data[8].cadenas);
            setLoadingAPI(false);
        }).catch((e) => {
            setLoadingAPI(false);
        })
    };

    const handleChangePais = (Pais, editing, dataEdit) => {
        const FilterRegion = dataFiltros[1]?.regiones.filter(x => (x.pais === Pais.value?.nombre_pais || x.cod_region === 0));
        const FilterEstados = dataFiltros[2]?.estados.filter(x => x.pais === Pais.value?.nombre_pais);
        setEstados(FilterEstados)
        setRegiones(FilterRegion)

        if (editing == null || editing == undefined) {
            setPais(Pais.value)
        } else {
            let searchEstado = FilterEstados.find((x) => x.nombre_estado == dataEdit.nombre_estado);
            setEstado(searchEstado ?? {});
            let searchRegion = FilterRegion.find((x) => x.nombre_region == dataEdit.nombre_region);
            setRegion(searchRegion ?? {});
            setDefaultCiudad(searchEstado ?? {}, searchRegion ?? {}, dataEdit);
        }
    };

    const handleChangeRegionOrEstado = (value, name) => {
        let temporal_estado = estado;
        let temporal_region = region;

        if (name === 'estado') {
            temporal_estado = value;
            const FilterMunicipios = dataFiltros[6].municipios.filter(x => (x.codigo_estado === temporal_estado.codigo_estado))
            setMunicipios(FilterMunicipios)
            setEstado(value)
        }

        if (name === 'region') {
            temporal_region = value;
            setRegion(value)
        }

        if (Object.keys(temporal_region).length !== 0 && Object.keys(temporal_estado).length !== 0) {
            const FilterCiudades = dataFiltros[3].ciudades.filter(x => (x.codigo_estado === temporal_estado.codigo_estado && x.codigo_region === temporal_region.cod_region && x.pais === pais.nombre_pais));
            setCiudades(FilterCiudades);
        }
    };

    const setDefaultCiudad = (estado, region, dataEdit) => {
        let temporal_estado = estado;
        const FilterMunicipios = dataFiltros[6].municipios.filter(x => (x.codigo_estado === temporal_estado.codigo_estado))
        setMunicipios(FilterMunicipios)

        let searchMunicipio = FilterMunicipios.find((x) => x.codigo_municipio == dataEdit.codigo_municipio) ?? {};
        setMunicipio(searchMunicipio);
        handleChangeMunicipio({ value: searchMunicipio }, true, dataEdit);


        let temporal_region = region;

        const FilterCiudades = dataFiltros[3].ciudades.filter(x => (x.codigo_estado === temporal_estado.codigo_estado && x.codigo_region === temporal_region.cod_region));
        setCiudades(FilterCiudades);

        let searchCiudad = FilterCiudades.find((x) => x.nombre_ciudad == dataEdit.nombre_ciudad) ?? {};
        setCiudad(searchCiudad);
        handleChangeCiudad({ value: searchCiudad }, true, dataEdit);
    };

    const handleChangeMunicipio = (Municipio, editing, dataEdit) => {
        const FilterParroquias = dataFiltros[4].parroquias.filter(x => x.codigo_municipio === Municipio.value.codigo_municipio);
        setParroquias(FilterParroquias);

        if (editing == null || editing == undefined) {
            setMunicipio(Municipio.value);
        } else {
            let searchParroquia = FilterParroquias.find((x) => x.codigo_parroquia == dataEdit.codigo_parroquia);
            setParroquia(searchParroquia ?? {});
        }
    };

    const handleChangeCiudad = (Ciudad, editing, dataEdit) => {
        const FilterUrbanizaciones = dataFiltros[5].urbanizaciones.filter(x => x.codigo_ciudad === Ciudad.value.codigo_ciudad)
        setUrbanizaciones(FilterUrbanizaciones)

        if (editing == null || editing == undefined) {
            setCiudad(Ciudad.value);
        } else {
            let searchUrbanizacion = FilterUrbanizaciones.find((x) => x.nombre_urbanizacion == dataEdit.nombre_urbanizacion);
            setUrbanizacion(searchUrbanizacion ?? {});
        }
    };

    useEffect(() => {
        if (idtoedit !== '0' && idtoedit !== '') {
            getEstablishmentData(idtoedit);
        } else if (idtoedit === '0' && idtoedit !== '') {
            setDireccionEstablecimiento('');
            setNombreEstablecimiento('');
            setCharcuteria(false);
            setDisableSave(false);
            setCantidadCajas('');
            setNombreOficina('');
            setNombreGerente('');
            setPescaderia(false);
            setCarniceria(false);
            setPagoMovil(false);
            setCodigoPostal('');
            setLicoreria(false);
            setPanaderia(false);
            setUrbanizacion({});
            setRazonSocial('');
            setFarmacia(false);
            setDelivery(false);
            setFruteria(false);
            setNeveras(false);
            setEstatus(true);
            setPaypal(false);
            setParroquia({});
            setMunicipio({});
            setZelle(false);
            setTelefono('');
            setPlaceID('');
            setCadena({});
            setLatLng('');
            setEstado({});
            setCiudad({});
            setRegion({});
            setCanal({});
            setPais({});
            setRIF('');
            setID('');
        }
    }, [idtoedit])

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"))
        setUserData(userData);
        getFiltersData();
    }, [])

    return (
        <Popup
            width={"75%"}
            height={"85%"}
            visible={showpopup}
            onHiding={hidepopup}
            showTitle={true}
            title={idtoedit !== '0' ? "Editar Establecimiento" : "Agregar Establecimiento"}
            showCloseButton={true}
            fullScreen
        >
            <ToolbarItem
                widget="dxButton"
                toolbar="top"
                location="after"
                disabled={disableSave}
                options={saveButtonOptions}
            />
            <ScrollView width='100%' height='100%'>
                <div className="form-container mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* <div style={{ textAlign: 'center' }}>
                                <LoadIndicator
                                    width={"64px"}
                                    height={"64px"}
                                    visible={isLoadingSave}
                                />
                            </div> */}

                            <h6 className='mt-3'>Dirección del establecimiento</h6>

                            <div className="mt-2">
                                <MapGoogle direccionEST={getDireccionEstablecimiento} Editing={idtoedit} DireccionEstablecimiento={direccionEstablecimiento} />
                            </div>

                            <h6 className='mt-3'>Datos del establecimiento</h6>

                            <div className="col-3">
                                <TextBox
                                    className='mt-3'
                                    value={nombreEstablecimiento}
                                    onValueChanged={(e) => { setNombreEstablecimiento(e.value); validateForm() }}
                                    label="Nombre del establecimiento *"
                                    disabled={idtoedit !== '0'}
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <TextBox
                                    className='mt-3'
                                    value={direccionEstablecimiento}
                                    disabled
                                    label="Dirección del establecimiento"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={paises}
                                    searchEnabled
                                    displayExpr={"nombre_pais"}
                                    value={pais}
                                    onValueChanged={(e) => { handleChangePais(e); validateForm() }}
                                    label="Seleccione un país *"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={regiones}
                                    searchEnabled
                                    displayExpr={"nombre_region"}
                                    value={region}
                                    onValueChanged={(e) => { handleChangeRegionOrEstado(e.value, 'region'); validateForm() }}
                                    label="Seleccione una región *"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={estados}
                                    searchEnabled
                                    displayExpr={"nombre_estado"}
                                    value={estado}
                                    onValueChanged={(e) => { handleChangeRegionOrEstado(e.value, 'estado'); validateForm() }}
                                    label="Seleccione un estado *"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={ciudades}
                                    searchEnabled
                                    displayExpr={"nombre_ciudad"}
                                    value={ciudad}
                                    onValueChanged={(e) => { handleChangeCiudad(e) }}
                                    label="Seleccione una ciudad"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={municipios}
                                    searchEnabled
                                    displayExpr={"nombre_municipio"}
                                    value={municipio}
                                    onValueChanged={(e) => { handleChangeMunicipio(e) }}
                                    label="Seleccione un municipio"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={parroquias}
                                    searchEnabled
                                    displayExpr={"nombre_parroquia"}
                                    value={parroquia}
                                    onValueChanged={(e) => { setParroquia(e.value) }}
                                    label="Seleccione una parroquia"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={urbanizaciones}
                                    searchEnabled
                                    displayExpr={"nombre_urbanizacion"}
                                    value={urbanizacion}
                                    onValueChanged={(e) => { setUrbanizacion(e.value); validateForm() }}
                                    label="Seleccione una urbanización"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <TextBox
                                    className='mt-3'
                                    value={razonSocial}
                                    onValueChanged={(e) => { setRazonSocial(e.value) }}
                                    label="Razón Social"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <TextBox
                                    className='mt-3'
                                    value={RIF}
                                    onValueChanged={(e) => { setRIF(e.value) }}
                                    label="RIF *"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={canales}
                                    searchEnabled
                                    displayExpr={"nombre_canal"}
                                    value={canal}
                                    onValueChanged={(e) => { setCanal(e.value) }}
                                    label="Seleccione una canal"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <NumberBox
                                    className='mt-3'
                                    value={telefono}
                                    onValueChanged={(e) => { setTelefono(e.value) }}
                                    label="Teléfono"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <TextBox
                                    className='mt-3'
                                    value={nombreGerente}
                                    onValueChanged={(e) => { setNombreGerente(e.value) }}
                                    label="Nombre de Gerente"
                                />
                            </div>

                            <div className="col-3">
                                <NumberBox
                                    className='mt-3'
                                    value={codigoPostal}
                                    onValueChanged={(e) => { setCodigoPostal(e.value) }}
                                    label="Código Postal"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <SelectBox
                                    className='mt-3'
                                    dataSource={cadenas}
                                    searchEnabled
                                    displayExpr={"nombre_cadena"}
                                    value={cadena}
                                    onValueChanged={(e) => { setCadena(e.value) }}
                                    label="Seleccione una cadena"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <TextBox
                                    className='mt-3'
                                    value={nombreOficina}
                                    onValueChanged={(e) => { setNombreOficina(e.value) }}
                                    label="Oficina"
                                />
                            </div>

                            <div className="col-3">
                                <NumberBox
                                    className='mt-3'
                                    value={cantidadCajas}
                                    onValueChanged={(e) => { setCantidadCajas(e.value) }}
                                    label="Cantidad de cajas"
                                    required
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={estatus}
                                    onValueChanged={(e) => { setEstatus(e.value) }}
                                    text="Estatus"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3 text-dark'
                                    value={delivery}
                                    onValueChanged={(e) => { setDelivery(e.value) }}
                                    text="Delivery"
                                />
                            </div>

                            <h6 className='mt-4'>Métodos de Pago</h6>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={paypal}
                                    onValueChanged={(e) => { setPaypal(e.value) }}
                                    text="Paypal"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={zelle}
                                    onValueChanged={(e) => { setZelle(e.value) }}
                                    text="Zelle"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={pagoMovil}
                                    onValueChanged={(e) => { setPagoMovil(e.value) }}
                                    text="Pago movil"
                                />
                            </div>

                            <h6 className='mt-4'>Secciones</h6>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={neveras}
                                    onValueChanged={(e) => { setNeveras(e.value) }}
                                    text="Neveras"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={farmacia}
                                    onValueChanged={(e) => { setFarmacia(e.value) }}
                                    text="Farmacia"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={licoreria}
                                    onValueChanged={(e) => { setLicoreria(e.value) }}
                                    text="Licorería"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={fruteria}
                                    onValueChanged={(e) => { setFruteria(e.value) }}
                                    text="Frutería"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={charcuteria}
                                    onValueChanged={(e) => { setCharcuteria(e.value) }}
                                    text="Charcutería"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={pescaderia}
                                    onValueChanged={(e) => { setPescaderia(e.value) }}
                                    text="Pescadería"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={panaderia}
                                    onValueChanged={(e) => { setPanaderia(e.value) }}
                                    text="Panadería"
                                />
                            </div>

                            <div className="col-3">
                                <CheckBox
                                    className='mt-3'
                                    value={carniceria}
                                    onValueChanged={(e) => { setCarniceria(e.value) }}
                                    text="Carnicería"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </ScrollView>
        </Popup>
    )
}

export default NewEstablishment
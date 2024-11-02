import React, { useEffect, useState } from 'react';
import * as DinamicQueries from '../../api/DinamicsQuery';
import { ExclamationDiamond } from "react-bootstrap-icons";
//Elementos DevExpress
import ScrollView from "devextreme-react/scroll-view";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import DataGrid, {
    Pager,
    Column,
    Paging,
    FilterRow,
    HeaderFilter,
    ColumnChooser,
} from "devextreme-react/data-grid";
import { Toast } from 'devextreme-react/toast';
import { Button } from "devextreme-react/button";
import { TextBox } from "devextreme-react/text-box";
import { CheckBox } from 'devextreme-react/check-box';
import { NumberBox } from "devextreme-react/number-box";
import { SelectBox } from 'devextreme-react/select-box';

//Firebase
import { fire } from '../../api/firebaseEnv';

// modulo de mapa de Google
import MapGoogle from "../../components/popup-create-establishment/widgets/MapGoogle";

//Componentes Externos
import CellRenderIconsGrids from '../../components/Grids/icons-grid/icons-grid';
import CellRenderEstatus from '../../components/Grids/estatus-grid-establecimientos/estatus-grid';
// import CellRenderVerifica from '../../components/Grids/verificar-grid/verificar-grid';
import CellRenderMapa from '../../components/Grids/mapa-grid/mapa-grid';
// import FormEstablishment from './widgets/FormEstablishment'; CellRenderVerifica
import LoadIndicator from "devextreme-react/load-indicator";

//CSS
// import './establishmentNew.scss';
import moment from 'moment';

export default function EstablishmentNew() {
    const [UserData, setUserData] = useState('');
    const [EstablishmentData, setEstablishmentData] = useState([]);
    const [pais, setPais] = useState({});
    const [paises, setPaises] = useState([]);
    const [region, setRegion] = useState({});
    const [regiones, setRegiones] = useState([]);
    const [estado, setEstado] = useState({});
    const [estados, setEstados] = useState([]);
    const [ciudad, setCiudad] = useState({});
    const [ciudades, setCiudades] = useState([]);
    const [municipio, setMunicipio] = useState({});
    const [municipios, setMunicipios] = useState([]);
    const [parroquia, setParroquia] = useState({});
    const [parroquias, setParroquias] = useState([]);
    const [canal, setCanal] = useState({});
    const [canales, setCanales] = useState([]);
    const [urbanizacion, setUrbanizacion] = useState({});
    const [urbanizaciones, setUrbanizaciones] = useState([]);
    const [DataFiltros, setDataFiltros] = useState([]);
    const [RIF, setRIF] = useState('');
    const [cadena, setcadena] = useState({});
    const [cadenas, setCadenas] = useState([]);
    const [celular, setCelular] = useState('');
    const [nivelSE, setNivelSE] = useState({});
    const [NivelesSE] = useState([
        {
            nivel_se: "A"
        },
        {
            nivel_se: "B"
        },
        {
            nivel_se: "c"
        },
        {
            nivel_se: "D"
        },
        {
            nivel_se: "E"
        },
        {
            nivel_se: "F"
        },
    ]);
    const [telefono, setTelefono] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');
    const [nombreGerente, setNombreGerente] = useState('');
    const [nombreOficina, setNombreOficina] = useState('');
    const [cantidadCajas, setCantidadCajas] = useState('');
    const [nombreEstablecimiento, setNombreEstablecimiento] = useState('');
    const [DireccionEstablecimiento, setDireccionEstablecimiento] = useState('');
    const [PlaceID, setPlaceID] = useState('');
    const [LatLng, setLatLng] = useState('');
    const [ID, setID] = useState('');
    const [keyToEdit, setkeyToEdit] = useState('');
    const [estatus, setEstatus] = useState(false);
    const [neveras, setNeveras] = useState(false);
    const [Delivery, setDelivery] = useState(false);
    const [paypal, setPaypal] = useState(false);
    const [zelle, setZelle] = useState(false);
    const [pagoMovil, setPagoMovil] = useState(false);
    const [farmacia, setFarmacia] = useState(false);
    const [licoreria, setLicoreria] = useState(false);
    const [fruteria, setFruteria] = useState(false);
    const [charcuteria, setCharcuteria] = useState(false);
    const [pescaderia, setPescaderia] = useState(false);
    const [panaderia, setPanaderia] = useState(false);
    const [carniceria, setCarniceria] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [Editing, setEditing] = useState(false);
    const [loadingAPI, setLoadingAPI] = useState(false);
    const [disableSave, setDisableSave] = useState(false);
    const [isLoadingSave, setIsLoadingSave] = useState(false);
    const [showPopupDelete, setShowPopupDelete] = useState(false);
    const [editingId, setEditingId] = useState();
    const [toastConfig, setToastConfig] = React.useState({
        isVisible: false,
        type: 'error',
        message: 'Ya se encuentra un establecimiento registrado con esta dirección',
        displayTime: 4000,
    }, []);


    const allowedPageSizes = [30, 50, 100];

    const handleSubmit = async () => {

        setDisableSave(true);
        setIsLoadingSave(true);

        if (ID !== '') {
            const temp_estatus = estatus === false ? "Inactivo" : "Activo";

            const TempDataFinal = {
                ID: ID,
                ID_FD_GOOGLE: PlaceID,
                cant_cajas: cantidadCajas,
                celulares: celular.toString().trim(),
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
                coordenadas: LatLng,
                delivery: Delivery,
                direccion: DireccionEstablecimiento,
                estatus: temp_estatus,
                fecha_modify: moment(new Date()).format('YYYY-MM-DD hh:mm:ss a'),
                horarios: [],
                key: keyToEdit,
                login_modify: UserData.nombre,
                metodos_pago: { pago_movil: pagoMovil, paypal: paypal, zelle: zelle },
                neveras: neveras,
                // nivel_socio_economico: Object.keys(nivelSE)?.length !== 0 ? nivelSE.nivel_se : '',
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
                // revisado: true,
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


            let IDEst = [];
            let contador = 0;

            fire.collection('establecimientos').where('ID_FD_GOOGLE', '==', PlaceID).get().then((DataEst) => {
                if (DataEst.size > 0) {
                    DataEst.forEach((cadaEst) => {
                        const tempEstID = cadaEst.id
                        IDEst = [...IDEst, tempEstID]
                        contador++

                        if (contador === DataEst.size) {
                            const found = IDEst.find((element) => element === keyToEdit);
                            if (found !== keyToEdit) {
                                setToastConfig({
                                    ...toastConfig,
                                    isVisible: true,
                                });
                            } else {
                                fire.collection('establecimientos').doc(keyToEdit).update(TempDataFinal).then(() => {
                                    successPopup();
                                    getAllEstablishment();
                                }).catch((error) => {
                                })
                            }
                        }
                    })
                    setDisableSave(false);
                } else {
                    fire.collection('establecimientos').doc(keyToEdit).update(TempDataFinal).then(() => {
                        successPopup();
                        getAllEstablishment();
                    }).catch((error) => {
                        setDisableSave(false);
                    })
                }
            }).catch((error) => {
                setDisableSave(false);
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
                ID_FD_GOOGLE: PlaceID,
                cant_cajas: cantidadCajas,
                celulares: celular.toString().trim(),
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
                coordenadas: LatLng,
                delivery: Delivery,
                direccion: DireccionEstablecimiento,
                estatus: temp_estatus,
                fecha_modify: "",
                fecha_registro: moment(new Date()).format('YYYY-MM-DD hh:mm:ss a'),
                horarios: [],
                key: "",
                login_modify: "",
                login_registro: UserData.nombre,
                metodos_pago: { pago_movil: pagoMovil, paypal: paypal, zelle: zelle },
                neveras: neveras,
                nivel_socio_economico: Object.keys(nivelSE).length !== 0 ? nivelSE.nivel_se : '',
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


            if (DireccionEstablecimiento !== '') {
                fire.collection('establecimientos').where('ID_FD_GOOGLE', '==', PlaceID).get().then((DataEst) => {
                    if (DataEst.size > 0) {
                        setToastConfig({
                            ...toastConfig,
                            isVisible: true,
                        });
                        setDisableSave(false);
                    } else {
                        fire.collection('establecimientos').add(TempDataFinal).then((NuevoEsta) => {
                            fire.collection('establecimientos').doc(NuevoEsta.id).update({ key: NuevoEsta.id }).then(() => {
                                successPopup();
                                getAllEstablishment();
                                setDisableSave(false);
                            }).catch((error) => {
                                setDisableSave(false);
                            })
                        }).catch((error) => {
                            setDisableSave(false);
                        })
                    }
                }).catch((error) => {
                    setDisableSave(false);
                })
            } else {
                fire.collection('establecimientos').add(TempDataFinal).then((NuevoEsta) => {
                    fire.collection('establecimientos').doc(NuevoEsta.id).update({ key: NuevoEsta.id }).then(() => {
                        successPopup();
                        getAllEstablishment();
                        setDisableSave(false);
                    }).catch((error) => {
                        setDisableSave(false);
                    })
                }).catch((error) => {
                    setDisableSave(false);
                })
            }
        }
    }

    const saveButtonOptions = {
        icon: "check",
        text: "Guardar",
        onClick: handleSubmit,
        // disabled: !isFormValid,
    }

    const openPopup = () => {
        setNombreEstablecimiento('')
        setEditing(false);
        setEstatus(true)
        setNeveras(false)
        setDelivery(false)
        setPaypal(false)
        setZelle(false)
        setPagoMovil(false)
        setFarmacia(false)
        setLicoreria(false)
        setFruteria(false)
        setCharcuteria(false)
        setPescaderia(false)
        setPanaderia(false)
        setCarniceria(false)
        setCantidadCajas('');
        setCelular('');
        setcadena({});
        setNombreOficina('');
        setCodigoPostal('');
        setDireccionEstablecimiento('');
        setNivelSE({});
        setNombreGerente('');
        setRazonSocial('');
        setRIF('');
        setTelefono('');
        setPlaceID('');
        setLatLng('')
        setID('');
        setkeyToEdit('');
        setPais({});
        setEstado({});
        setCiudad({})
        setMunicipio({})
        setParroquia({});
        setUrbanizacion({})
        setRegion({});
        setCanal({});
        // setIsLoadingSave(false);
        setDisableSave(false);
        setShowPopup(true);
        validateForm();
    }

    const openEditPopup = (data) => {
        const estatus = data.estatus === 'Activo' ? true : false;
        const form = { ...data, estatus: estatus };
        setkeyToEdit(form.key)
        setNombreEstablecimiento(form.nombre_establecimiento)
        setEstatus(form.estatus)
        setNeveras(form.neveras)
        setDelivery(form.delivery)
        setPaypal(form.metodos_pago?.paypal)
        setZelle(form.metodos_pago?.zelle)
        setPagoMovil(form.metodos_pago?.pago_movil)
        setFarmacia(form.secciones?.farmacia)
        setLicoreria(form.secciones?.licoreria)
        setFruteria(form.secciones?.fruteria)
        setCharcuteria(form.secciones?.charcuteria)
        setPescaderia(form.secciones?.pescaderia)
        setPanaderia(form.secciones?.panaderia)
        setCarniceria(form.secciones?.carniceria)
        setCantidadCajas(form.cant_cajas);
        setCelular(form.celulares);
        setNombreOficina(form.nombre_oficina);
        setCodigoPostal(form.codigo_postal);
        setDireccionEstablecimiento(form.direccion);
        setNivelSE(form.nivel_socio_economico);
        setNombreGerente(form.nombre_gerente);
        setRazonSocial(form.razon_social);
        setRIF(form.rif);
        setTelefono(form.telefonos)
        setPlaceID(form.ID_FD_GOOGLE);
        setLatLng(form.coordenadas);
        setID(form.ID);
        setEditing(true);
        validateForm();

        let searchNivelSE = NivelesSE.find((x) => x.nivel_se === data.nivel_socio_economico);
        setNivelSE(searchNivelSE);
        let searchCadena = cadenas.find((x) => x.codigo_cadena === data.codigo_cadena);
        setcadena(searchCadena);
        let searchCanal = canales.find((x) => x.codigo_canal === data.codigo_canal);
        setCanal(searchCanal ?? {})
        let searchPais = paises.find((x) => x.nombre_pais === data.pais);
        setPais(searchPais ?? {});
        handleChangePais({ value: searchPais }, true, data);
        setShowPopup(true);
    };

    const hidePopup = () => {
        setEditing(false);
        setShowPopup(false);
    };

    const successPopup = () => {
        hidePopup();
        setToastConfig({
            ...toastConfig,
            isVisible: true,
            type: 'success',
            message: 'Establecimiento guardado exitosamente'
        });
        setDisableSave(false);
        setIsLoadingSave(false);
    }

    const getAllEstablishment = () => {
        let Establecimientos = []
        let contador = 0;
        fire.collection('establecimientos').get().then((DataEstableciminetos) => {
            DataEstableciminetos.forEach((cadaEst) => {
                const TempEstFire = cadaEst.data();
                contador++
                Establecimientos = [...Establecimientos, TempEstFire]
            })

            if (contador === DataEstableciminetos.size) {
                setEstablishmentData(Establecimientos)
            }
        }).catch((error) => {
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
        const FilterRegion = DataFiltros[1]?.regiones.filter(x => (x.pais === Pais.value?.nombre_pais || x.cod_region === 0));
        const FilterEstados = DataFiltros[2]?.estados.filter(x => x.pais === Pais.value?.nombre_pais);
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

    const setDefaultCiudad = (estado, region, dataEdit) => {
        let temporal_estado = estado;
        const FilterMunicipios = DataFiltros[6].municipios.filter(x => (x.codigo_estado === temporal_estado.codigo_estado))
        setMunicipios(FilterMunicipios)

        let searchMunicipio = FilterMunicipios.find((x) => x.codigo_municipio == dataEdit.codigo_municipio) ?? {};
        setMunicipio(searchMunicipio);
        handleChangeMunicipio({ value: searchMunicipio }, true, dataEdit);


        let temporal_region = region;

        const FilterCiudades = DataFiltros[3].ciudades.filter(x => (x.codigo_estado === temporal_estado.codigo_estado && x.codigo_region === temporal_region.cod_region));
        setCiudades(FilterCiudades);

        let searchCiudad = FilterCiudades.find((x) => x.nombre_ciudad == dataEdit.nombre_ciudad) ?? {};
        setCiudad(searchCiudad);
        handleChangeCiudad({ value: searchCiudad }, true, dataEdit);
    };

    const handleChangeRegionOrEstado = (value, name) => {
        let temporal_estado = estado;
        let temporal_region = region;

        if (name === 'estado') {
            temporal_estado = value;
            const FilterMunicipios = DataFiltros[6].municipios.filter(x => (x.codigo_estado === temporal_estado.codigo_estado))
            setMunicipios(FilterMunicipios)
            setEstado(value)
        }

        if (name === 'region') {
            temporal_region = value;
            setRegion(value)
        }

        if (Object.keys(temporal_region).length !== 0 && Object.keys(temporal_estado).length !== 0) {
            const FilterCiudades = DataFiltros[3].ciudades.filter(x => (x.codigo_estado === temporal_estado.codigo_estado && x.codigo_region === temporal_region.cod_region && x.pais === pais.nombre_pais));
            setCiudades(FilterCiudades);
        }
    };

    const handleChangeMunicipio = (Municipio, editing, dataEdit) => {
        const FilterParroquias = DataFiltros[4].parroquias.filter(x => x.codigo_municipio === Municipio.value.codigo_municipio);
        setParroquias(FilterParroquias);

        if (editing == null || editing == undefined) {
            setMunicipio(Municipio.value);
        } else {
            let searchParroquia = FilterParroquias.find((x) => x.codigo_parroquia == dataEdit.codigo_parroquia);
            setParroquia(searchParroquia ?? {});
        }
    };

    const handleChangeCiudad = (Ciudad, editing, dataEdit) => {
        const FilterUrbanizaciones = DataFiltros[5].urbanizaciones.filter(x => x.codigo_ciudad === Ciudad.value.codigo_ciudad)
        setUrbanizaciones(FilterUrbanizaciones)

        if (editing == null || editing == undefined) {
            setCiudad(Ciudad.value);
        } else {
            let searchUrbanizacion = FilterUrbanizaciones.find((x) => x.nombre_urbanizacion == dataEdit.nombre_urbanizacion);
            setUrbanizacion(searchUrbanizacion ?? {});
        }
    };

    const getDireccionEstablecimiento = (dirreccion, placeID, latLng) => {
        setDireccionEstablecimiento(dirreccion);
        setPlaceID(placeID);
        setLatLng(latLng);
    };

    const validateForm = () => {
        if (nombreEstablecimiento.trim() !== '' && DireccionEstablecimiento.trim() !== '' && Object.keys(pais).length !== 0 && Object.keys(estado).length !== 0 && Object.keys(ciudad).length !== 0 && Object.keys(municipio).length !== 0 && Object.keys(parroquia).length !== 0 && Object.keys(urbanizacion).length !== 0 && Object.keys(region).length !== 0 && razonSocial.trim() !== '' && RIF !== '' && Object.keys(canal).length !== 0 && telefono !== '' && codigoPostal !== '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    };

    const deleteData = (id) => {
        setEditingId(id);
        setShowPopupDelete(true);
    }

    const deleteFunction = () => {
        // setEditingId(null);
        // setShowPopupDelete(false);
        // setToastConfig({
        //     ...toastConfig,
        //     isVisible: true,
        //     type: 'success',
        //     message: 'Eliminado exitosamente!'
        // });
    }

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"))
        // getEstablishmentData(userData.est_censo)
        getAllEstablishment();
        setUserData(userData);
        getFiltersData();
    }, [])

    const ChangeRevision = (value, info) => {
        fire.collection('establecimientos').doc(info.key).update({revisado:value}).then(() => {
            getAllEstablishment()
            setToastConfig({
                ...toastConfig,
                isVisible: true,
                type: 'success',
                message: 'Establecimiento actualizado exitosamente'
            });
            getAllEstablishment()
        })
    }

    const checkedLabel = { 'aria-label': 'Checked' };
    const CellRenderVerifica = (data) => {
        return (
            <CheckBox defaultValue={data?.data?.revisado} elementAttr={checkedLabel} onValueChanged={(e) => ChangeRevision(e.value, data.data)} />
        );
    };

    return (
        <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className='my-4'>
                <h6 className={"titleEstablecimiento "}>Establecimientos (Nuevos)</h6>
                <div className='d-flex justify-content-end'>
                    <Button onClick={openPopup} disabled={loadingAPI} className="btn-agregar" style={{ width: '200px' }}>
                        + Crear Establecimiento
                    </Button>
                </div>
            </div>

            <DataGrid
                className={"dx-card wide-card"}
                dataSource={EstablishmentData}
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
                <Pager
                    showPageSizeSelector={true}
                    showInfo={true}
                    allowedPageSizes={allowedPageSizes}
                />
                <HeaderFilter visible={true} />

                <Column
                    caption={"ID"}
                    dataField={"ID"}
                    width={140}
                    sortOrder={"asc"}
                />
                <Column
                    dataField={"nombre_establecimiento"}
                    caption={"Nombre"}
                    dataType="string"
                    width={250}
                />

                <Column
                    dataField={"razon_social"}
                    caption={"Razon Social"}
                    dataType="string"
                />
                <Column dataField={"nombre_ciudad"} caption={"Ciudad"} dataType="string" />
                <Column dataField={"nombre_region"} caption={"Región"} dataType="string" />

                <Column
                    dataField={"estatus"}
                    caption={"Estatus"}
                    dataType="string"
                    cellRender={CellRenderEstatus}
                />
                <Column
                    dataField={"revisado"}
                    caption={"Verificado"}
                    dataType="string"
                    cellRender={(data) => CellRenderVerifica(data)}
                />
                <Column
                    dataField={"coordenadas"}
                    caption={"Ver Mapa"}
                    dataType="string"
                    cellRender={(data) => CellRenderMapa(data)}
                />
                <Column
                    width={80}
                    caption=""
                    allowSorting={false}
                    cellRender={(data) => CellRenderIconsGrids(data, openEditPopup, deleteData, loadingAPI)}
                    name="renderEstab"
                />

            </DataGrid>

            <Popup
                width={"75%"}
                height={"85%"}
                visible={showPopup}
                onHiding={hidePopup}
                showTitle={true}
                title='Agregar Establecimiento'
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
                <ScrollView width="100%" height="100%">
                    <div className="form-container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">

                                <div style={{ textAlign: 'center' }}>
                                    <LoadIndicator
                                        width={"64px"}
                                        height={"64px"}
                                        visible={isLoadingSave}
                                    />
                                </div>

                                <h6 className='mt-3'>Dirección del establecimiento</h6>

                                <div className="mt-2">
                                    <MapGoogle direccionEST={getDireccionEstablecimiento} Editing={Editing} DireccionEstablecimiento={DireccionEstablecimiento} />
                                </div>

                                <h6 className='mt-3'>Datos del establecimiento</h6>

                                <div className="col-3">
                                    <TextBox
                                        className='mt-3'
                                        value={nombreEstablecimiento}
                                        onValueChanged={(e) => { setNombreEstablecimiento(e.value); validateForm() }}
                                        label="Nombre del establecimiento *"
                                        required
                                    />
                                </div>

                                <div className="col-3">
                                    <TextBox
                                        className='mt-3'
                                        value={DireccionEstablecimiento}
                                        disabled
                                        onValueChanged={validateForm}
                                        label="Dirección del establecimiento *"
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
                                        onValueChanged={(e) => { handleChangeCiudad(e); validateForm() }}
                                        label="Seleccione una ciudad *"
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
                                        onValueChanged={(e) => { handleChangeMunicipio(e); validateForm() }}
                                        label="Seleccione un municipio *"
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
                                        onValueChanged={(e) => { setParroquia(e.value); validateForm() }}
                                        label="Seleccione una parroquia *"
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
                                        label="Seleccione una urbanización *"
                                        required
                                    />
                                </div>

                                <div className="col-3">
                                    <TextBox
                                        className='mt-3'
                                        value={razonSocial}
                                        onValueChanged={(e) => { setRazonSocial(e.value); validateForm() }}
                                        label="Razón Social *"
                                        required
                                    />
                                </div>

                                <div className="col-3">
                                    <TextBox
                                        className='mt-3'
                                        value={RIF}
                                        onValueChanged={(e) => { setRIF(e.value); validateForm() }}
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
                                        onValueChanged={(e) => { setCanal(e.value); validateForm() }}
                                        label="Seleccione una canal *"
                                        required
                                    />
                                </div>

                                <div className="col-3">
                                    <NumberBox
                                        className='mt-3'
                                        value={telefono}
                                        onValueChanged={(e) => { setTelefono(e.value); validateForm() }}
                                        label="Teléfono *"
                                        required
                                    />
                                </div>

                                {/* <div className="col-3">
                                    <NumberBox
                                        className='mt-3'
                                        value={celular}
                                        onValueChanged={(e) => { setCelular(e.value) }}
                                        label="Celulares"
                                    />
                                </div> */}

                                <div className="col-3">
                                    <TextBox
                                        className='mt-3'
                                        value={nombreGerente}
                                        onValueChanged={(e) => { setNombreGerente(e.value) }}
                                        label="Nombre de Gerente"
                                    />
                                </div>

                                {/* <div className="col-3">
                                    <SelectBox
                                        className='mt-3'
                                        dataSource={NivelesSE}
                                        searchEnabled
                                        displayExpr="nivel_se"
                                        value={nivelSE}
                                        onValueChanged={(e) => { setNivelSE(e.value) }}
                                        label="Seleccione Nivel Socio Economico"
                                    />
                                </div> */}

                                <div className="col-3">
                                    <NumberBox
                                        className='mt-3'
                                        value={codigoPostal}
                                        onValueChanged={(e) => { setCodigoPostal(e.value); validateForm() }}
                                        label="Código Postal *"
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
                                        onValueChanged={(e) => { setcadena(e.value); validateForm() }}
                                        label="Seleccione una cadena *"
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
                                        onValueChanged={(e) => { setCantidadCajas(e.value); validateForm() }}
                                        label="Cantidad de cajas *"
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
                                        className='mt-3'
                                        value={Delivery}
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

            <Popup
                width={'50%'}
                height={'50%'}
                visible={showPopupDelete}
                onHiding={() => setShowPopupDelete(false)}
                showTitle={true}
                title='Eliminar Establecimiento'
                showCloseButton={true}
            >
                <ScrollView width='100%' height='100%'>
                    <div className="form-container text-center">
                        <ExclamationDiamond className='warning_icon' />
                        <h5>¿Seguro que desea eliminar este registro?</h5>
                        <p>Esta acción no puede revertirse</p>
                        <div className='d-flex text-center col-md-12 button_popup'>
                            <Button onClick={() => deleteFunction()} className="btn btn-outline-primary">Sí, eliminar</Button>
                            <Button onClick={() => setShowPopupDelete(false)} className="btn btn-outline-secondary">Cancelar</Button>
                        </div>
                    </div>
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

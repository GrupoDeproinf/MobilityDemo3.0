import React, { useEffect, useState } from 'react';
import { fire } from '../../api/firebaseEnv';
import { Button } from "devextreme-react/button";
import { SelectBox } from "devextreme-react/select-box";
import * as DinamicQueries from "../../api/DinamicsQuery";
import DataGrid, {
    Column,
    Pager,
    Paging,
    FilterRow,
    HeaderFilter,
    LoadPanel,
    Selection,
} from "devextreme-react/data-grid";
import { getOpenAIResponse } from '../../api/firebaseEnvIA';

const RutasIa = () => {
    const [regiones, setRegiones] = useState([]);
    const [establecimientos, setEstablecimientos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [filterUsers, setFilterUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [selectedStore, setSelectedStore] = useState([])
    const [load, setLoad] = useState(false)
    const allowedPageSizes = [8, 12, 20];

    const isDisabled = selectedUsers.length === 0 || selectedStore.length === 0;

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        setRegiones(userData.region);
        getUserAssigned(userData.uid);
    }, [])

    const getUserAssigned = (uid) => {
        let usuariosFinales = []

        fire.collection(`/Usuarios/${uid}/usuariosAsignados`).get().then((resp) => {
            resp.forEach((CadaUsuario) => {
                const tempUser = CadaUsuario.data();
                tempUser.nombre = tempUser.nombre + tempUser.apellido
                usuariosFinales = [...usuariosFinales, CadaUsuario.data()]
                setUsuarios(usuariosFinales)
            })
        }).catch((error) => {
            console.log("🚀 ~ fire.collection ~ error:", error)
        })
    };

    const searchEstablecimientos = (e) => {
        if (e.value != "") {
            setSelectedStore([])
            setSelectedUsers([])

            DinamicQueries.getDataWithParameters("callProcedure", "analytics/", {
                method: "sp_get_storeWithRegion",
                params: {
                    nameRegion: e.value
                }
            }).then((establecimientos) => {
                const TempUsers = usuarios.filter((usuario) => usuario.region.includes(e.value));
                setFilterUsers(TempUsers)

                const temporalEstfilter = establecimientos.data.filter((x) => x.LAT !== null && x.LNG !== null);
                const estFinal = temporalEstfilter.splice(0, 50);
                console.log("🚀 ~ searchEstablecimientos ~ estFinal:", estFinal.length)
                setEstablecimientos(estFinal)
            })
        }
    };

    const handleOptionChange = (e) => {
        setSelectedStore(e.selectedRowsData)
    };

    const handleOptionChangeUser = (e) => {
        setSelectedUsers(e.selectedRowsData)
    };

    const realizarConsulta = async () => {
        // setLoad(true)

        const UsuariosLimpiosSimplificado = selectedUsers.map(usuario => ({
            region: usuario.region,
            uid: usuario.uid,
            nombre: usuario.nombre
        }));

        const EstablecimientosLimpiosSimplificado = selectedStore.map(est => ({
            NAME: est.NAME,
            LAT: est.LAT,
            LNG: est.LNG,
            ID_FB: est.ID_FB,
            NAME_REGION: est.NAME_REGION
        }));

        const chunkedUsuariosLimpios = await chunkArray(UsuariosLimpiosSimplificado, 10);
        const chunkedEstablecimientosLimpios = await chunkArray(EstablecimientosLimpiosSimplificado, 10);

        // - Los establecimientos asignados a un promotor deben estar dentro de un radio de 10 km entre cada uno.
        // 2. **Región del Promotor**: Cada promotor solo puede visitar establecimientos dentro de su misma región.
        try {
            const conversation = [
                {
                    role: "system",
                    content: `Eres un asistente de una empresa de merchandising donde tu principal función es realizar la asignación eficiente de rutas para los promotores que visitan distintos establecimientos.
            Tu objetivo principal es minimizar el tiempo de viaje y optimizar las rutas asignadas.
            Para ello, debes considerar los siguientes datos y criterios:
            1. **Coordenadas Geográficas y Región**: Las direcciones de los establecimientos a visitar están dadas en coordenadas geográficas (latitud y longitud) y se clasifican por NAME_REGION.
            2. **Asignación Equitativa**: La asignación de los establecimientos debe ser lo mas equitativo posible entre los promotores pero sin dejar establecimientos sin asignar.
            3. **No Repetición**: Un establecimiento no debe ser asignado a más de un promotor.
            La salida debe ser en formato JSON.`
                },
            ];

            chunkedUsuariosLimpios.forEach((chunk, index) => {
                conversation.push({
                    role: "user",
                    content: `JSON. Haz la asignación de establecimientos para estos promotores (Parte ${index + 1}): ${JSON.stringify(chunk)}`
                });
            });

            chunkedEstablecimientosLimpios.forEach((chunk, index) => {
                conversation.push({
                    role: "user",
                    content: `JSON. Utiliza estos establecimientos (Parte ${index + 1}): ${JSON.stringify(chunk)}`
                });
            });

            conversation.push({
                role: "user",
                content: `Ejemplo de output esperado en formato JSON:
                    {
                        "nombre_promotor_1": {
                            "region": "CAPITAL",
                            "ruta": [
                                { "ID_FB": "oZfojhM0H6XusNdM3f4S", "NAME": "LA MURALLA", "LAT": 10.4275889, "LNG": -66.829305 }
                            ]
                        },
                        "nombre_promotor_2": {
                            "region": "CAPITAL",
                            "ruta": [
                                { "ID_FB": "ABcd1234EFgh5678IJkl", "NAME": "EL PALACIO", "LAT": 9.4242, "LNG": -65.8273 },
                                { "ID_FB": "EFGd1234EFgh5678IJkl", "NAME": "EL MUNDO", "LAT": 9.6242, "LNG": -60.8273 }
                            ]
                        },
                        "no_asignados": [
                            { "ID_FB": "xyz123", "NAME": "ESTABLECIMIENTO NO ASIGNADO", "LAT": 10.1234, "LNG": -66.1234 }
                        ]
                    }
                        
                    La distribución de los establecimientos se realizó de la siguiente manera:
                    1. Los promotores fueron asignados a los establecimientos dentro de su misma región.
                    2. Los establecimientos que no pudieron ser asignados se enumeran en una sección separada "no_asignados".

                    Asegúrate de proporcionar la distribución de todos los establecimientos entre los promotores y de incluir una lista de los establecimientos no asignados, si los hay.`
            });

            // 2. La asignación fue relativamente equitativa, asegurando que cada promotor reciba un número similar de establecimientos.


            console.log(conversation);

            getOpenAIResponse({ conversation })
                .then((response) => {
                    const openAIResponse = response;
                    console.log('====================================');
                    console.log(JSON.parse(openAIResponse.data.choices[0].message.content));
                    console.log('====================================');
                    realizarConsulta2(openAIResponse.data.choices[0].message.content)
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setLoad(false)
                });
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setLoad(false)
        }
    };

    const realizarConsulta2 = (promptResult) => {
        // console.log('====================================');
        // console.log(promptResult);
        // console.log('====================================');

        // 2. **Frecuencia de visitas**: Cada establecimiento reciba el número de visitas especificado.

        const conversation = [
            {
                role: "system",
                content: `Contexto: Aquí tienes la distribución inicial de las rutas de los promotores. Ahora debes asignar la frecuencia de visitas a los establecimientos de manera eficiente.
            Distribuye las visitas a lo largo de los 5 días de la semana, asegurándote de que:
            1. **No haya visitas en días consecutivos**: Los promotores no visiten el mismo establecimiento en días seguidos.
            La salida debe ser en formato JSON.
            `
            },
            {
                role: "system",
                content: `Distribución inicial:
                            ${promptResult}`
            },
            {
                role: "user",
                content: `JSON. Asigna la frecuencia de visitas a los establecimientos para los siguientes promotores.`
            },
            {
                role: "user",
                content: `Ejemplo de output esperado en formato JSON:
                    {
                        "nombre_promotor_1": {
                            "region": "CAPITAL",
                            "frecuencia_visitas": [
                                { "id": "oZfojhM0H6XusNdM3f4S", "nombre_establecimiento": "LA MURALLA", "coordenadas": { "lat": 10.4275889, "lng": -66.829305 }, "dias_visita": ["lunes", "miércoles"] }
                            ]
                        },
                        "nombre_promotor_2": {
                            "region": "CENTRO",
                            "frecuencia_visitas": [
                                { "id": "ABcd1234EFgh5678IJkl", "nombre_establecimiento": "EL PALACIO", "coordenadas": { "lat": 9.4242, "lng": -65.8273 }, "dias_visita": ["martes", "jueves", "sábado"] }
                            ]
                        }
                    }
                    En este formato, cada promotor tiene una lista de establecimientos asignados, con la frecuencia de visitas distribuida a lo largo de la semana sin visitas en días consecutivos.`
            }
        ];

        console.log("🚀 ~ realizarConsulta2 ~ conversation:", conversation)

        // const conversation = [
        //     {
        //         role: "system",
        //         content: `Eres un asistente de una empresa de merchandising. Ahora que tienes las rutas asignadas para los promotores, tu objetivo es asignar la frecuencia de visitas a los establecimientos de forma eficiente.
        // Debes distribuir las visitas a lo largo de los 5 días de la semana, asegurándote de que:
        // 1. **No haya visitas en días consecutivos**: Los promotores no visiten el mismo establecimiento en días seguidos.
        // La salida debe ser en formato JSON.`
        //     },
        //     {
        //         role: "user",
        //         content:
        //             `JSON. asigna la frecuencia de visitas a los establecimientos, para los promotores promotores ${promptResult}.`,
        //     },
        //     {
        //         role: "user",
        //         content: `Ejemplo de output esperado en formato JSON:
        //                     {
        //                         "nombre_promotor_1": {
        //                             "region": "CAPITAL",
        //                             "frecuencia_visitas": [
        //                             { "id": "oZfojhM0H6XusNdM3f4S", "nombre_establecimiento": "LA MURALLA", "coordenadas": { "lat": 10.4275889, "lng": -66.8293405 }, "dias_visita": ["lunes", "miércoles"] }
        //                             ]
        //                         },
        //                         "nombre_promotor_2": {
        //                             "region": "CENTRO",
        //                             "frecuencia_visitas": [
        //                             { "id": "ABcd1234EFgh5678IJkl", "nombre_establecimiento": "EL PALACIO", "coordenadas": { "lat": 9.4242, "lng": -65.8273 }, "dias_visita": ["martes", "jueves", "sábado"] }
        //                             ]
        //                         }
        //                     }`
        //     }
        // ];

        getOpenAIResponse({ conversation })
            .then((response) => {
                const openAIResponse = response;
                console.log('====================================');
                console.log(JSON.parse(openAIResponse.data.choices[0].message.content));
                console.log('====================================');
                // setAsignacion(openAIResponse.data.choices[0].message.content)
                // setLoad(false)
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoad(false)
            });
    };

    async function chunkArray(array, chunk_size) {
        const results = [];
        for (let i = 0; i < array.length; i += chunk_size) {
            results.push(array.slice(i, i + chunk_size));
        }
        return results;
    }

    async function dividePorUsuario(usuarios, chunkSize) {
        const chunks = [];
        let currentChunk = [];
        let currentLength = 0;

        usuarios.forEach((usuario, index) => {
            const jsonUsuario = JSON.stringify(usuario);
            if (currentLength + jsonUsuario.length > chunkSize) {
                chunks.push(currentChunk.join('\n'));
                currentChunk = [];
                currentLength = 0;
            }
            currentChunk.push(jsonUsuario);
            currentLength += jsonUsuario.length;
        });

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n'));
        }

        return chunks;
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <SelectBox
                        className="SelectBoxR mb-2"
                        placeholder="Seleccione una región"
                        label="Región"
                        dataSource={regiones}
                        onValueChanged={(e) => searchEstablecimientos(e)}
                        searchEnabled={true}
                    />
                </div>
            </div>

            <div className="row mx-5" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="col-md-6 mt-2">
                    <div className={'dx-card'} style={{ padding: "20px", borderRadius: "15px" }}>
                        <h6 className="title">Establecimientos</h6>
                        <DataGrid
                            className="tabla-user"
                            dataSource={establecimientos}
                            showBorders={true}
                            remoteOperations={true}
                            defaultFocusedRowIndex={0}
                            style={{ height: "65vh", width: "100%" }}
                            keyExpr="ID_FB"
                            onSelectionChanged={(e) => handleOptionChange(e)}
                            wordWrapEnabled={true}
                        >
                            <FilterRow visible={true} />
                            <Selection mode="multiple" />
                            <LoadPanel enabled />
                            <Paging defaultPageSize={20} />
                            <Pager
                                showPageSizeSelector={true}
                                allowedPageSizes={allowedPageSizes}
                            />
                            <HeaderFilter visible={true} />

                            <Column
                                caption={"ID"}
                                dataField={"ID_STORE"}
                                width={100}
                            />

                            <Column
                                dataField={"NAME"}
                                caption={"Nombre Establecimiento"}
                                dataType="string"
                            />
                        </DataGrid>
                    </div>
                </div>

                <div className="col-md-6 mt-2">
                    <div className={'dx-card'} style={{ padding: "20px", borderRadius: "15px" }}>
                        <h6 className="title">Usuarios</h6>
                        <DataGrid
                            className="tabla-user"
                            dataSource={filterUsers}
                            showBorders={true}
                            remoteOperations={true}
                            defaultFocusedRowIndex={0}
                            style={{ height: "65vh", width: "100%" }}
                            keyExpr="uid"
                            wordWrapEnabled={true}
                            onSelectionChanged={(e) => handleOptionChangeUser(e)}
                        >
                            <FilterRow visible={true} />
                            <Selection mode="multiple" />
                            <LoadPanel enabled />
                            <Paging defaultPageSize={20} />
                            <Pager
                                showPageSizeSelector={true}
                                allowedPageSizes={allowedPageSizes}
                            />
                            <HeaderFilter visible={true} />

                            <Column
                                caption="Nombre"
                                dataField="nombre"
                                dataType="string"
                            />
                            <Column
                                caption="Region"
                                dataField="region"
                                dataType="string"
                            />
                        </DataGrid>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        className="btn-agregar mt-3"
                        style={{ width: "500px" }}
                        disabled={isDisabled || load}
                        onClick={realizarConsulta}
                    >
                        Generar Ruta
                    </Button>
                </div>
            </div>
        </>
    )
}

export default RutasIa
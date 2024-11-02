import * as DinamicQueries from '../../api/DinamicsQuery';
import { SelectBox } from 'devextreme-react/select-box';
import { DateBox } from 'devextreme-react/date-box';
import React, { useEffect, useState } from "react";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import Moment from "moment";



export default function Gallery() {
    const [Clientes, setClientes] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const [resgistros, setRegistros] = useState([]);
    const now = new Date();
    const [Usuarios, setUsuarios] = useState([]);

    const initialState = {
        cliente: "",
        region: "",
        usuario: "",
        usuariosAsignados: "",
        usuarioName: "",
        fecha: new Date(new Date().setDate(new Date().getDate() - 1))
    };
    const [dataFields, setdataFields] = useState(initialState);

    const [toastConfig, setToastConfig] = React.useState(
        {
            isVisible: false,
            type: "success",
            message: "Busqueda Exitosa",
            displayTime: 2000,
        },
        []
    );

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userData"));
        setClientes(user.cliente);
        setRegiones(user.region);
    }, [])

    // ++++++++++++++++++++++++++++++++

    const searchCoordenadas = () => {
        
    };

    const clearFilters = () => {
        setdataFields(initialState);
    };

    const searchCliente = (e) => {
        if (e.value != "") {
            setdataFields({ ...dataFields, cliente: e.value });
            const user = JSON.parse(localStorage.getItem("userData"));
            DinamicQueries.getDataWithParameters('getaUser', "usuarios/", { uid: user.uid})
            .then(dataUserConnected => {
                let dataUsuarioFinal = []
                    dataUserConnected.data[0].asignados.forEach(cadaUsuarioAsignado=>{
                        if (cadaUsuarioAsignado.cliente.includes(e.value) == true && cadaUsuarioAsignado.region.includes(dataFields.region) == true){
                            dataUsuarioFinal.push(cadaUsuarioAsignado)
                        }
                    })
                    console.log(dataUsuarioFinal)
                setUsuarios(dataUsuarioFinal)

            })
        }
    };

    const searchUsuarios = (e) => {
        if (e.value != "") {
            setdataFields({ ...dataFields, region: e.value })
            const user = JSON.parse(localStorage.getItem("userData"));
            DinamicQueries.getDataWithParameters('getaUser', "usuarios/", { uid: user.uid})
            .then(dataUserConnected => {
                let dataUsuarioFinal = []
                console.log(dataUserConnected.data[0].asignados)
                console.log(dataFields)
                    dataUserConnected.data[0].asignados.forEach(cadaUsuarioAsignado=>{
                        if (cadaUsuarioAsignado.clientes.includes(dataFields.cliente) == true && cadaUsuarioAsignado.region.includes(e.value) == true){
                            dataUsuarioFinal.push(cadaUsuarioAsignado)
                        }
                    })
                    console.log(dataUsuarioFinal)
                setUsuarios(dataUsuarioFinal)
            })
        }
};

    const searchAUsuarios = (e) => {
        if (e.value != "") {
            if (e.event != undefined) {
                // console.log(e)
                setdataFields({ ...dataFields, usuario: e.value })
                DinamicQueries.getDataWithParameters('getaUser', "usuarios/", { uid: e.value })
                    .then(usuario => {
                        console.log(usuario)
                        //   let usuariosAsignados =[]
                        //   if (usuario.data.length > 0) {
                        //     if (usuario.data[0].asignados != undefined){
                        //       usuario.data[0].asignados.forEach(DatosUsusario => {
                        //         usuariosAsignados.push(DatosUsusario.uid)
                        //       });
                        //     }
                        //   }
                        // setAsignacion({...Asignacion, usuariosAsignados: usuariosAsignados, usuarioName:usuario.data[0].nombre + " " + usuario.data[0].apellido})
                        //   setAssingTo(usuario.data[0].nombre + " " + usuario.data[0].apellido)
                        //   setUsuariosAsignadosFinal(usuariosAsignados)
                    })
            }
        }
    };


    return (
        <React.Fragment>
            <div height="100%">
                <div className="d-md-flex justify-content-between">
                    <h2 className={"content-block"}>Seguimiento</h2>
                    <div>
                        <Button className="btn btn-light mt-4 mr-2" onClick={clearFilters}>Limpiar Filtros</Button>
                        <Button disabled={dataFields.region !== '' && dataFields.cliente !== '' && dataFields.usuario !== '' ? false : true} className="btn btn-primary mt-4 mr-2" onClick={searchCoordenadas}>Buscar</Button>
                    </div>

                </div>

                <div className="row">
                    <div className="col-md-3 mt-4">
                        <SelectBox
                            className=""
                            placeholder="Seleccione un cliente"
                            label="Cliente"
                            dataSource={Clientes}
                            onValueChanged={(e) => searchCliente(e)}
                            defaultValue={dataFields.cliente}
                            value={dataFields.cliente}
                        />
                    </div>
                    <div className="col-md-3 mt-4">
                        <SelectBox
                            placeholder="Seleccione una región"
                            label="Región"
                            dataSource={Regiones}
                            onValueChanged={(e) => searchUsuarios(e)}
                            defaultValue={dataFields.region}
                            value={dataFields.region}
                        />
                    </div>
                    <div className="col-md-3 mt-4">
                        <SelectBox
                            placeholder="Seleccione un usuario"
                            label="Usuarios"
                            dataSource={Usuarios}
                            onValueChanged={(e) => searchAUsuarios(e)}
                            defaultValue={dataFields.usuario}
                            value={dataFields.usuario}
                            valueExpr="uid"
                            displayExpr="nombre"
                            searchEnabled={true}
                            disabled={dataFields.region !== '' && dataFields.cliente !== '' ? false : true}
                        />
                    </div>
                </div>

                <div className="row">
        aqui va la info

                </div>
            </div>
        </React.Fragment>
    );
}

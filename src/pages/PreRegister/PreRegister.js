import Example from "../../components/SelectMultiple/SelectMultiple";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";
import React, { useCallback, useState, useEffect } from "react";
import * as DinamicQueries from "../../api/DinamicsQuery";
import { SelectBox } from "devextreme-react/select-box";
import { DateBox } from "devextreme-react/date-box";
import * as clientService from "../../api/clients";
import { fire, app } from "../../api/firebaseEnv";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import { useAuth } from "../../contexts/auth";
import TagBox from "devextreme-react/tag-box";
import settings from "../../api/enviroment";
import "./PreRegister.scss";
import Moment from "moment";
import axios from "axios";

import { MultiSelect } from "react-multi-select-component";
import * as establecimientosService from "../../api/establishment";
export default function PreRegister() {
  const API_URL = settings.API_URL;
  const [nombre, setnombre] = useState();
  const { user } = useAuth();
  const [apellido, setapellido] = useState();
  const [cedula, setcedula] = useState();
  const [cliente, setcliente] = useState([]);
  const [clientes, setclientes] = useState([]);
  const [regiones, setregiones] = useState([]);
  const [Establecimientos, setEstablecimientos] = useState([]);
  const [nacionalidad, setnacionalidad] = useState("");
  const [perfil, setperfil] = useState("");
  const [fechaInicio, setfechaInicio] = useState();
  const [region, setregion] = useState();
  const [selected, setSelected] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const nacionalidades = [
    {
      Value: "V",
      Name: "V",
    },
    {
      Value: "E",
      Name: "E",
    },
  ];

  const perfiles = [
    {
      Value: "Supervisor",
      Name: "Supervisor",
    },
    {
      Value: "Promotor",
      Name: "Promotor",
    },
  ];

  const NewUser = {
    perfil: "",
    nombre: "",
    apellido: "",
    nacionalidad: "",
    cedula: 0,
    cliente: "",
    region: "",
    fechaInicio: new Date(),
    replace: ""
  };

  const [NewUserPre, setNewUserPre] = useState(NewUser);

  function OnSubmit(e) {
    // setNewUserPre(NewUser)

    let valores = Object.values(NewUserPre);
    let keys = Object.keys(NewUserPre);

    for (let i = 0; i < valores.length; i++) {
      if (
        valores[i] === undefined ||
        valores[i] === "" ||
        valores[i] === null
      ) {
        if (keys[i] !== "establecimientos" && keys[i] !== "replace") {
          setToastConfig({
            ...toastConfig,
            type: "warning",
            message: "No puede dejar campos vacios",
            isVisible: true,
          });
          return;
        }
      }
    }
    let menu_asig = [];
    perfil.forEach(cadaRol => {
      if (NewUserPre.perfil == cadaRol.nombre) {
        const data = cadaRol.menu.map(x => {
          var mendef = { "text": x.text }
          menu_asig.push(mendef)

          return x.text
        })

      }
    })

    const userData = JSON.parse(localStorage.getItem("userData"));
    let arrayEstablecimiento = [];
    Establecimientos.forEach((cadaEstablecimientoData) => {
      if (NewUserPre.establecimientos != undefined) {
        if (NewUserPre.establecimientos.length > 0) {
          NewUserPre.establecimientos.forEach((cadaEstablecimiento) => {
            if (
              cadaEstablecimientoData.nombre_establecimiento.trim() ==
              cadaEstablecimiento.trim()
            ) {
              // const data = {
              //   canal: cadaEstablecimientoData.canal,
              //   ciudad: cadaEstablecimientoData.ciudad,
              //   descripcion_razon_social:
              //     cadaEstablecimientoData.descripcion_agrupador,
              //   direccion: cadaEstablecimientoData.direccion,
              //   id_establecimiento:
              //     cadaEstablecimientoData.id_establecimiento,
              //   nombre_establecimiento:
              //     cadaEstablecimientoData.nombre_establecimiento,
              //   region: cadaEstablecimientoData.region,
              // };
              arrayEstablecimiento.push(cadaEstablecimientoData);
            }
          });
        }
      }
    });

    const dataFinal = {
      estatus: "Pre-Registrado",
      nombre: NewUserPre.nombre,
      segundo_nombre: "",
      apellido: NewUserPre.apellido,
      segundo_apellido: "",
      email: "",
      nacionalidad: NewUserPre.nacionalidad,
      uid: "",
      direccion: "",
      cliente: [NewUserPre.cliente],
      region: [NewUserPre.region],
      cedula: NewUserPre.cedula,
      telefono: "",
      fecha_insert: Moment().format("MMMM DD YYYY, h:mm"),
      user_insert: Moment().format("MMMM DD YYYY, h:mm"),
      perfil: NewUserPre.perfil,
      // supervisor:[],
      establecimientos: arrayEstablecimiento,
      estatus: "Pre-Registrado",
      DatosBancarios: [
        {
          numeroCuenta: "",
          nombreBanco: "",
          tipoCuenta: "",
          estatus: "",
          numeroBanco: "",
        },
      ],
      menu: menu_asig, // respRoles.data[0].menu  revisar != undefined ? dataUser.menu.map((x)=>{return x.text}) : []
      paginaInicio: "/home",
      asignados: [
        {
          cedula: userData.cedula,
          nombre: userData.nombre + " " + userData.apellido,
          region: userData.region,
          uid: userData.uid,
        },
      ],
      superAdmin: false,
      replaceTo: NewUserPre.replace
    };

    console.log(dataFinal);

    axios
      .post(`${API_URL}Pre-Register`, dataFinal)
      .then((res) => {
        // if (res.data) {
        setNewUserPre(NewUser);
        setToastConfig({
          ...toastConfig,
          type: "success",
          message: "¡Guardado Exitosamente!",
          isVisible: true,
        });
        // }
      })
      .catch((error) => {
        setToastConfig({
          ...toastConfig,
          type: "warning",
          message: "No se guardo el usuarios",
          isVisible: true,
        });
      });
  }

  const renderSelectNacionalidad = (data) => {
    return (
      <SelectBox
        dataSource={nacionalidades}
        valueExpr="Value"
        displayExpr="Name"
        value={NewUserPre.nacionalidad}
        isRequired={true}
        onValueChanged={onValueChangedNacionalidad}
      />
    );
  };

  const onValueChangedNacionalidad = (event) => {
    setNewUserPre({ ...NewUserPre, nacionalidad: event.value });
  };

  const renderSelectPerfiles = (data) => {
    return (
      <SelectBox
        dataSource={perfil}
        valueExpr="nombre"
        displayExpr="nombre"
        value={NewUserPre.perfil}
        isRequired={true}
        onValueChanged={onValueChangedPerfiles}
      />
    );
  };

  const renderSelectUsuarios = (data) => {
    return (
      <SelectBox
        dataSource={usuarios}
        valueExpr="cedula"
        displayExpr="nombre"
        searchEnabled={true}
        value={NewUserPre.replace}
        isRequired={true}
        onValueChanged={(e) => { setNewUserPre({ ...NewUserPre, replace: e.value }); }}
      />
    );
  };

  const onValueChangedPerfiles = (event) => {
    setNewUserPre({ ...NewUserPre, perfil: event.value });
  };

  const renderSelectRegiones = (data) => {
    return (
      <SelectBox
        dataSource={regiones}
        // valueExpr="Value"
        // displayExpr="Name"
        isRequired={true}
        value={NewUserPre.region}
        onValueChanged={onValueChangedRegiones}
      />
    );
  };

  const renderTagEstablecimientos = (data) => {
    return (
      <TagBox
        showSelectionControls={true}
        items={Establecimientos}
        valueExpr="nombre_establecimiento"
        displayExpr="nombre_establecimiento"
        searchEnabled={true}
        isRequired={true}
        value={NewUserPre.establecimientos}
        onValueChanged={(e) =>
          setNewUserPre({ ...NewUserPre, establecimientos: e.value })
        }
      />
    );
  };

  const onValueChangedRegiones = (event) => {
    NewUser.region = event.value;
    setregion(event.value);
    setNewUserPre({ ...NewUserPre, region: event.value });
    DinamicQueries.getDataWithParameters(
      "getEstablecimientosFilter",
      "galeria/",
      { cliente: NewUserPre.cliente, region: event.value }
    ).then((establecimientos) => {
      setEstablecimientos(establecimientos.data);
    });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setclientes(userData.cliente);
    setregiones(userData.region);
    DinamicQueries.getData('getRoles', "roles/")
      .then(respRoles => { setperfil(respRoles.data) })
  }, []);

  const renderSelectCliente = (data) => {
    return (
      <SelectBox
        dataSource={clientes}
        // valueExpr="cod_cliente"
        // displayExpr="nombre_cliente"
        value={NewUserPre.cliente}
        isRequired={true}
        onValueChanged={handleSelectCliente}
      />
    );
  };

  const handleSelectCliente = (e) => {
    setNewUserPre({ ...NewUserPre, cliente: e.value });
    let Usuarios = [];

    DinamicQueries.getDataWithParameters(
      "getEstablecimientosFilter",
      "galeria/",
      { cliente: e.value, region: NewUserPre.region }
    ).then((establecimientos) => {
      setEstablecimientos(establecimientos.data);
    });

    DinamicQueries.getDataWithParameters(
      "getUserClients",
      "clientes/",
      { client: e.value }
    ).then((resp) => {
      Usuarios = [{ nombre: "", cedula: "" }, ...resp.data]
      setUsuarios(Usuarios)
    });
  };

  const onHiding = () => {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  };

  const renderFecha = (data) => {
    return (
      <DateBox
        // className="SelectBoxDate mb-4"
        // placeholder="Fecha de reporte desde"
        // label="Desde"
        value={NewUserPre.fechaInicio}
        onValueChanged={(e) =>
          setNewUserPre({
            ...NewUserPre,
            fechaInicio: e.value,
          })
        }
        type="date"
      />
    );
  };

  return (
    <React.Fragment>
      <div className={"titlePreRegister mx-3 mt-4"}>
        <h5>Registrar usuario</h5>
        <p>
          Ingresar los datos del usuario para que pueda ser registrado en el
          sistema
        </p>
      </div>

      <div className={"FomularioPreRegister mx-3"}>
        <Form formData={NewUserPre}>
          <GroupItem colCount={2}>
            <SimpleItem dataField="nombre" isRequired={true} />
            <SimpleItem dataField="apellido" isRequired={true} />
            <SimpleItem
              dataField="nacionalidad"
              valueExpr="Value"
              displayExpr="Name"
              render={renderSelectNacionalidad}
              isRequired={true}
            />
            <SimpleItem dataField="cedula" isRequired={true} />
          </GroupItem>
          <GroupItem colCount={2}>
            <SimpleItem
              dataField="cliente"
              // valueExpr="cod_cliente"
              // displayExpr="nombre_cliente"
              render={renderSelectCliente}
              isRequired={true}
            />
            <SimpleItem
              dataField="fechaInicio"
              render={renderFecha}
              isRequired={true}
            />
            <SimpleItem
              dataField="region"
              // valueExpr="Value"
              // displayExpr="Name"
              render={renderSelectRegiones}
              isRequired={true}
            />

            <SimpleItem
              dataField="Sustituye a"
              valueExpr="Value"
              displayExpr="Name"
              render={renderSelectUsuarios}
            />

            {NewUserPre.replace === '' &&
              <SimpleItem
                dataField="establecimientos"
                // valueExpr="Value"
                // displayExpr="Name"
                render={renderTagEstablecimientos}
                isRequired={true}
              />
            }

            <SimpleItem
              dataField="perfil"
              valueExpr="Value"
              displayExpr="Name"
              render={renderSelectPerfiles}
              isRequired={true}
            />
          </GroupItem>
        </Form>
        <div className="bntGuardar">
          <Button onClick={OnSubmit} className="btnGuardarPreRegister">
            Agregar
          </Button>
        </div>
      </div>

      <Toast
        visible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHiding={onHiding}
        displayTime={toastConfig.displayTime}
      />
    </React.Fragment>
  );
}

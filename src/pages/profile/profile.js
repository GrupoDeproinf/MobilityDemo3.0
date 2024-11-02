// import { SelectBox } from "devextreme-react/select-box";
import React, { useState } from "react";
import { useAuth } from "../../contexts/auth";
import axios from "axios";
// import { useHistory } from "react-router-dom";
import settings from "../../api/enviroment";
import { Button } from "devextreme-react/button";
import Form, { GroupItem, SimpleItem } from "devextreme-react/form";

import { Toast } from "devextreme-react/toast";
import "./profile.scss";
import FileUpload from "../../components/FileUpload/FileUpload";
import { Paperclip } from "react-bootstrap-icons";

export default function Profile() {
  const API_URL = settings.API_URL;
  const { user } = useAuth();
  const { token } = useAuth();
  const [setimagen] = useState(user.imagen);

  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "",
      message: "",
      displayTime: 2000,
    },
    []
  );

  const NewUser = {
    nombre: user.nombre,
    segundo_nombre: user.segundo_nombre,
    apellido: user.apellido,
    segundo_apellido: user.segundo_apellido,
    telefono: user.telefono,
    fecha_nacimiento: new Date(user.fecha_nacimiento),
    direccion: user.direccion,
    cliente: user.cliente,
    region: user.region,
    perfil: user.perfil,
    cedula: user.cedula,
  };

  function onSubmit() {
    axios
      .post(
        `${API_URL}Update`,
        {
          nombre: NewUser.nombre,
          segundo_nombre: NewUser.segundo_nombre,
          apellido: NewUser.apellido,
          segundo_apellido: NewUser.segundo_apellido,
          correo: user.correo,
          fecha_nacimiento: NewUser.fecha_nacimiento,
          telefono: NewUser.telefono,
          direccion: NewUser.direccion,
          uid: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        console.log("eh????");
        console.log(res.data);
        if (res.data.msg === true) {
          setToastConfig({
            type: "success",
            message: "¡Guardado Exitosamente!",
            isVisible: true,
            displayTime: 2000,
          });
        } else if (res.data.msg === false) {
          setToastConfig({
            type: "error",
            message: "Error al enviar datos",
            isVisible: true,
            displayTime: 2000,
          });
        }
      })
      .catch((er) => {
        console.log(er);
      });
  }

  function onHiding() {
    setToastConfig({
      ...toastConfig,
      isVisible: false,
    });
  }

  return (
    <React.Fragment>

      {/* <div className={""}>

        <Toast
          visible={toastConfig.isVisible}
          message={toastConfig.message}
          type={toastConfig.type}
          onHiding={() => onHiding()}
          displayTime={2000}
        />
        <div className="imgperfil">
          <div className={"form-avatar"}>
            <img alt={""} src={`${user.foto_personal}`} />
          </div>

          <div className="infoUserProfile">

            <div className="nombrePerfil">
              {user.nombre} {user.apellido}
            </div>

            <div className="emailperfil">
              <div> {user.email}</div>
            </div>

            <div className="perfilProfile">
              <div>{user.perfil}</div>
            </div>

            <div className="Boton">
              <FileUpload image={setimagen} uid={user.uid} />
            </div> 

          </div>

        </div>

        
        

        <Form className="formularioPerfil" formData={NewUser}>
          <GroupItem  className="items" colCount={2}>
            <SimpleItem dataField="nombre" isRequired={true} />
            <SimpleItem dataField="segundo_nombre" isRequired={true} />
            <SimpleItem dataField="apellido" isRequired={true} />
            <SimpleItem dataField="segundo_apellido" isRequired={true} />
          </GroupItem>
          <GroupItem colCount={2}>
            <SimpleItem dataField="telefono" isRequired={true} />
            <SimpleItem dataField="fecha_nacimiento" isRequired={true} />
            <SimpleItem dataField="direccion" isRequired={true} />
            <SimpleItem dataField="cliente"  disabled={true} isRequired={true} />
            <SimpleItem dataField="region" disabled={true} isRequired={true} />
            <SimpleItem dataField="cedula"  disabled={true} isRequired={true} />
          </GroupItem>
        </Form>
        <div className="bntGuardar">
              <Button onClick={onSubmit} className="btnEditarPerfil">
                Guardar
              </Button>
            </div>
      </div> */}

      <div className="containerProfile">
        <div className="inputsProfile">
          <Form className="formularioPerfil" formData={NewUser}>
            <GroupItem  className="items" colCount={2}>
              <SimpleItem dataField="nombre" isRequired={true} />
              <SimpleItem dataField="segundo_nombre" isRequired={true} />
              <SimpleItem dataField="apellido" isRequired={true} />
              <SimpleItem dataField="segundo_apellido" isRequired={true} />
            </GroupItem>

            <GroupItem colCount={2}>
              <SimpleItem dataField="cedula"  disabled={true} isRequired={true} />
              <SimpleItem dataField="telefono" isRequired={true} />
              <SimpleItem dataField="fecha_nacimiento" isRequired={true} />
              <SimpleItem dataField="direccion" isRequired={true} />
              <SimpleItem dataField="cliente"  disabled={true} isRequired={true} />
              <SimpleItem dataField="region" disabled={true} isRequired={true} />
            </GroupItem>
          </Form>

          <div className="bntGuardarProfile">
            <Button onClick={onSubmit} className="btnEditarPerfil">
              Guardar
            </Button>
          </div>
        </div>

        <div className="photoProfile">
          <div className="userInfo">
            <div className="photoContainer">

            </div>
            <div className="photoUserProfile">
              <img alt={""} src={`${user.foto_personal}`} />
            </div>
            <div className="nombreUser">
              <p>{user.nombre} {user.apellido}</p>
            </div>
            <div className="emailUser">
              <p>{user.email}</p>
            </div>
            <div className="perfilUser">
              <p>{user.perfil}</p>
            </div>
          </div>

          <div className="updatePicture">

            <div className="picture"></div>
            <Paperclip size={40}/>
            <div className="selectPicture">
              <div className="label">
                <label for="file-upload">Elegir nueva imagen</label>
                <span>Haz click aqui</span>
              </div>
              <input id="file-upload" type="file"></input>
            </div>

          </div>
        </div>

      </div>
    </React.Fragment>
  );
}

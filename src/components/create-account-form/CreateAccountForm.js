import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import settings from "../../api/enviroment";
import axios from "axios";
import { Button } from "devextreme-react/button";
import Home from "../../pages/home/home";
import { TextArea } from "devextreme-react/text-area";
import LoginForm from "../login-form/LoginForm";
import TextBox from "devextreme-react/text-box";
import Form, { SimpleItem } from "devextreme-react/form";
import {
  Validator,
  RequiredRule,
  CompareRule,
  EmailRule,
  RangeRule,
} from "devextreme-react/validator";
import { useAuth } from "../../contexts/auth";
// import LoadIndicator from "devextreme-react/load-indicator";
// import { createAccount } from "../../api/auth";
import notify from "devextreme/ui/notify";
import "./CreateAccountForm.scss";
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
export default function CreateAccountForm() {
  const API_URL = settings.API_URL;

  const navigate = useNavigate();
  const { user } = useAuth();
  // const [loading, setLoading] = useState(false);
  const [cedula, setCedula] = useState("");
  const [nombre, setnombre] = useState("");
  const [home, sethome] = useState(false);
  const [nacionalidad, setnacionalidad] = useState("~");
  const [correo, setcorreo] = useState("");
  const [direccion, setdireccion] = useState("");
  const [fechaInicio, setfechaInicio] = useState("");
  const [estatus, setestatus] = useState("");
  const [apellido, setapellido] = useState("");
  const [error, seterror] = useState("");
  const [password, setpassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errors, seterrors] = useState("");
  const [errorss, seterrorss] = useState("");
  const [cliente, setcliente] = useState("");
  const [Login1, setLogin1] = useState(false);
  const [Login, setLogin] = useState(false);
  const [form1, setForm1] = useState("1");
  const [confiPassword, setconfiPassword] = useState("");
  const [errorPassword, seterrorPassword] = useState("");
  const [check, setcheck] = useState(false);
  const [Establecimiento, setEstablecimiento] = useState([]);
  const [region, setRegion] = useState("");
  const [codvalid, setcodvalid] = useState("");
  const [codvalido, setcodvalido] = useState("");
  const [perfil, setperfil] = useState("");
  const [menu, setmenu] = useState("");


  const NewUser = {
    cedula: "",
    nombre: "",
    apellido: "",
    cliente: "",
    password: "",
    confirmPassword: "",
    correo: "",
    setfechaInicio: "",
    nacionalidad: "",
    estatus: "",
    codvalid: "",
  };

  const NewUser1 = {
    cedula: cedula,
    nombre: nombre,
    apellido: apellido,
    cliente: cliente,
    nacionalidad: nacionalidad,
    estatus: estatus,
  };

  if(!codvalid) setcodvalid(Math.floor(Math.random()*(999999-100000+1)+100000));

  function onPassword(e) {
    console.log(e);
    setconfiPassword(e);
    if (e !== password) {
      notify("Las contraseñas no coniciden", "error", 4000);
    } else {
      notify("Las contraseñas correctas", "success", 4000);
    }
  }

  function onCodvalid(e) {
    setcodvalido(e);
    if (e != codvalid) {
      notify("Codigo no igual al enviado", "error", 4000);
    } else {
      notify("Codigo Valido", "success", 4000);
    }
  }

  function onSubmit() {
    if (NewUser.cedula === "") {
      notify(
        "Este campo es requerido para continuar su registro",
        "error",
        4000
      );
    } else {
      axios
        .post(`${API_URL}VerificationDoc`, {
          cedula: parseInt(NewUser.cedula),
        })
        .then((res) => {
          if (res.data.user) {
            console.log(res.data.user);
            if (res.data.user.estatus === "Registrado") {
              setForm1("1");
              notify("Cédula ya existe", "error", 4000);
            } else {
              notify("Cédula validada", "success", 4000);
              setForm1("2");
              setCedula(res.data.user.cedula);
              setnombre(res.data.user.nombre);
              setapellido(res.data.user.apellido);
              setcliente(res.data.user.cliente);
              setdireccion(res.data.user.direccion);
              setfechaInicio(res.data.user.fechaInicio);
              setnacionalidad(res.data.user.nacionalidad);
              setestatus(res.data.user.estatus);

              setEstablecimiento(res.data.user.establecimientos);
              setRegion(res.data.user.region);
              setperfil(res.data.user.perfil);
              setmenu(res.data.user.menu);
            }
          } else if (res.data.msg === false) {
            notify("Esta cédula no existe", "error", 4000);
            setForm1("1");
            seterror(res.data.text);
          } else if (res) console.log(res.data);
        });
    }
  }

  function Register() {
    console.log(correo);

    let showErrorMessage;

    if (correo === "") {
      showErrorMessage = "El campo correo no puede estar vacío";
    } else if (password === "") {
      console.log("vacio");
      showErrorMessage = "Por favor escriba una contraseña";
    } else if (password !== confiPassword) {
      showErrorMessage = "Las contraseñas no coinciden";
    } else if (codvalid != codvalido) {
      showErrorMessage = "Codigo no igual al enviado ";
    } else {
      console.log("bien"); 
      axios
        .post(`${API_URL}Register`, {
          nombre: nombre,
          apellido: apellido,
          email: correo,
          cliente: cliente,
          nacionalidad: nacionalidad,
          cedula: parseInt(cedula),
          password: password,
          establecimientos: Establecimiento,
          region: region,
          perfil: perfil,
          menu: menu,
        })
        .then((res) => {
          if (res.data)
            if (res.data.msg === true) {
              notify("Usuario creado exitosamente", "success", 4000);
              console.log(res.data);
              navigate('/')
              // sethome(true);
            } else if (res.data.msg === false) {
              notify(res.data.error, "error", 4000);
              setErrorEmail(res.data.error);
              console.log(res.data);
            }
        });
    }
    notify(showErrorMessage, "error", 6000);
  }
  
  const validacorreo = useCallback(() => {
    if (correo === "") {
      notify("El campo correo no puede estar vacío","error", 4000);
    }
    else{
      const collectionRef = collection(db, 'mail');
      const emailContent = {
        to: correo,
        message: {
          subject: 'Mobility Codigo de Validacion de Registro',
          text: '',
          html: '<p>El codigo para continuar con el proceso de registro es <h5>'+codvalid+'</h5></p>',
        },
      };
      addDoc(collectionRef, emailContent);
      notify("Correo Enviado", "success", 4000);
    }

  })

  return (
    <div>
      {home === true ? (
        <LoginForm />
      ) : (
        <div>
          {form1 === "1" ? (
            <>
              <Form formData={NewUser}>
                <SimpleItem dataField="cedula"></SimpleItem>
              </Form>
              <Button onClick={() => onSubmit()}>Siguiente</Button>
            </>
          ) : (
            <></>
          )}

          {form1 === "2" ? (
            <>
              <Form formData={NewUser1}>
                <SimpleItem dataField="cedula" disabled />
                <SimpleItem dataField="nombre" disabled />
                <SimpleItem dataField="apellido" disabled />
                <SimpleItem dataField="cliente" disabled />
              </Form>
              <Button onClick={() => setForm1("3")}>Siguiente</Button>
            </>
          ) : (
            <></>
          )}

          {form1 === "3" ? (
            <form>
              <div className="mb-3">
                <TextBox
                  defaultValue={correo}
                  placeholder="Correo"
                  mode="email"
                  value={correo}
                  onValueChange={(e) => setcorreo(e)}
                />
              </div>
              <div className="mb-3">
                <Button onClick={validacorreo}>Solicitar codigo</Button>
                <TextBox
                  defaultValue="codigo enviado"
                  placeholder="Introduzca Codigo Enviado"
                  mode="text"
                  value={codvalido}
                  onValueChange={(e) => onCodvalid(e)}
                />
              </div>
              <div className="mb-3">
                <TextBox
                  defaultValue={password}
                  placeholder="Contraseña"
                  mode="password"
                  onValueChange={(e) => setpassword(e)}
                />
              </div>
              <div className="mb-3">
                <TextBox
                  defaultValue={confiPassword}
                  placeholder="Confirmar contraseña"
                  mode="password"
                  onValueChange={(e) => onPassword(e)}
                />
              </div>
              <Button onClick={() => Register()}>Finalizar</Button>
            </form>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
// const emailEditorOptions = {
//   stylingMode: "filled",
//   placeholder: "Correo",
//   mode: "email",
// };
// const passwordEditorOptions = {
//   stylingMode: "filled",
//   placeholder: "Contraseña",
//   mode: "password",
// };
// const ConfiPasswordEditorOptions = {
//   stylingMode: "filled",
//   placeholder: " Confirmar contraseña",
//   mode: "password",
// };

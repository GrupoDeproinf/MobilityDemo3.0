import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollView from "devextreme-react/scroll-view";
import { ButtonGroup } from "devextreme-react/button-group";
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  EmailRule,
} from "devextreme-react/form";
// import ListUser from "../../api/ListUser"
import LoadIndicator from "devextreme-react/load-indicator";
import { useAuth } from "../../contexts/auth";
import { app } from "../../api/firebaseEnv";
import notify from "devextreme/ui/notify";
import "./LoginForm.scss";
import settings from "../../api/enviroment";
import axios from "axios"
import * as ListUser from "../../api/ListUser";
import { BackgroundImage } from "devextreme-react/range-selector";
const LogoImage = '../../assets/images/logo.png'

export default function LoginForm() {

  const [API_URL] = useState(settings.API_URL);
  const navigate = useNavigate();
  const { signIn, Error, user } = useAuth();
  const [token, settoken] = useState();
  const [login, setlogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");
  const [Login1, setLogin1] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const User = {
    email: "",
    password: "",
  };

  const [Datauser, setDatauser] = useState(User);

  const emailEditorOptions = {
    stylingMode: "filled",
    placeholder: "Correo o Cedula",
    // mode: "email",
  };
  const passwordEditorOptions = {
    stylingMode: "filled",
    placeholder: "Contraseña",
    mode: "password",
  };
  const rememberMeEditorOptions = {
    text: "Recordarme",
    elementAttr: { class: "form-text" },
  };


  const history = useNavigate();
  useEffect(() => {
    if (user) {
      history("/home");
    }
  }, []);

  const Login = useCallback(async () => {
    setLoading(true);
    let showErrorMessage;
    console.log(user)
    console.log(Datauser)
    if (User.email === "" || User.email === null) {
      showErrorMessage = "Por favor escriba un usuario";
    } else if (User.password === "" || User.password === null) {
      showErrorMessage = "Por favor escriba una contraseña";
      setLoading(false);
    } 
    if (isNaN(Number(User.email))) {

      // validar si el usuario esta activo 
      ListUser.getaByEmail(User.email).then((respUser)=>{
        console.log(respUser)
        if(respUser.data.length === 0){
          console.log('No se encontró el usuario')
          showErrorMessage = "No se encontro El usuario";
          setLoading(false);
          notify(showErrorMessage, "error", 4000);
        } else {
          console.log(respUser.data[0])
          if (respUser.data[0].activado === false){
            console.log('Hola')
            showErrorMessage = "El usuario se encuentra inactivo";
            setLoading(false);
            notify(showErrorMessage, "error", 4000);
            return false;
          }
        }

        signIn(User.email.trim(), User.password.trim()).then((login) => {
          setTimeout(() => {
            console.log(login)
            if (login?.status === 500) {
              console.log('Aqui estoy')

              let errorMessage = login.message.toString().split("(auth");
    
              let typeError = errorMessage[1].split(")");
    
              if (typeError == "/too-many-requests") {
                showErrorMessage =
                  "El acceso a esta cuenta se ha inhabilitado temporalmente debido a muchos intentos fallidos de inicio de sesión. Puede restaurarlo inmediatamente restableciendo su contraseña o puede volver a intentarlo más tarde.";
              } else {
                showErrorMessage = "Usuario o contraseña inválida";
              }
              setLoading(false);
              notify(showErrorMessage, "error", 4000);
            } else {
              setLoading(false);
              showErrorMessage = "Usuario o contraseña inválida";
              console.log("Entre aqui")
              // notify(showErrorMessage, "error", 4000);
            }
          }, 2000);
        });
      })

    } else {
      ListUser.getaByCedula(User.email).then((response)=>{
        console.log(response)

        if(response.data.length === 0){
          console.log('No se encontró el usuario')

          showErrorMessage = "No se encontro El usuario";
          setLoading(false);
          notify(showErrorMessage, "error", 4000);
        } else {
          if (response.data[0].activado == false){
            console.log('Estoy acá')

            showErrorMessage = "El usuario se encuentra inactivo";
            setLoading(false);
            notify(showErrorMessage, "error", 4000);
            return false;
          }
        }

        if(response.data.length === 0){
          console.log('No hay cedula')

          showErrorMessage = "No se encontro la cedula dada";
          setLoading(false);
          notify(showErrorMessage, "error", 4000);
        } else {
          signIn(response.data[0].email.trim(), User.password.trim()).then((login) => {
            if (login?.status == 500) {
            console.log('Dios mío, help')

              setLoading(false);
              let errorMessage = login.message.toString().split("(auth");
    
              let typeError = errorMessage[1].split(")");
    
              if (typeError == "/too-many-requests") {
                showErrorMessage =
                  "El acceso a esta cuenta se ha inhabilitado temporalmente debido a muchos intentos fallidos de inicio de sesión. Puede restaurarlo inmediatamente restableciendo su contraseña o puede volver a intentarlo más tarde.";
              } else {
                showErrorMessage = "Usuario o contraseña inválida";
              }
              notify(showErrorMessage, "error", 4000);
            } else {
              setLoading(false);
              
              console.log("Entre aqui x2")

            }
          });
        }
      })
    }
  }, [signIn]);

  const onCreateAccountClick = useCallback(() => {
    navigate("/create-account");
  }, [navigate]);


  return (
    <>
      {/* <div className="dx-widget dx-collection dx-responsivebox-screen-lg dx-responsivebox DivIzquierdo">
        <div className="IconMobility">
          <div className="Ic">
            <div className="ImgIco">
              <img src="/imageness/logo.png" />
            </div>
            <div className="brandi">
              <img src="/imageness/Branding.png" />
            </div>
          </div>
        </div>
        <div>
          {/* <img src='/imageness/imgcarousel.jpg' />
        <Carousel></Carousel> */}
          {/* <img className="LogoLoginLeft" src="/imageness/logo.png" alt="logo" />
        </div>

        <div className=" subTituloLogin mt-20 justify-center">
          Descubre aquí el
          <br /> trabajo de tus sueños{" "}
        </div>

        <div className=" subTituloLogin2 mt-10 mb-10">
          Explore todos los roles de trabajo más emocionantes <br />
          en función de su interés y especialidad de estudio.
        </div>

        <div className="btn-flotante">
          <div className="BtnSingin">
            <button onClick={onCreateAccountClick}>Registro</button>
          </div>

          <div className="BtnloginActive">
            <button>Iniciar sesión</button>
          </div>
        </div>
      </div>

      <div className="dx-widget dx-collection dx-responsivebox-screen-lg dx-responsivebox DivDerecho bg-black">
        <div className={"single-card-Login"}>
          <div className={"dx-card2 "}>
            <div className={"header"}>
              <div variant="h3" className=" tituloLogin">
                Login
                <br />
                <div className="loginP">
                  Vea su crecimiento obtenga soporte de consultoría!
                </div>
              </div>
              <form className={"login-form"}>
                <Form formData={Datauser}>
                  <Item
                    dataField={"email"}
                    editorType={"dxTextBox"}
                    editorOptions={emailEditorOptions}
                  > */}
                    {/* <RequiredRule message="El correo es requerido" />
                    <EmailRule message="Debe ingresar un correo válido" /> */}
                    {/* <Label visible={false} />
                  </Item>
                  <Item
                    dataField={"password"}
                    editorType={"dxTextBox"}
                    editorOptions={passwordEditorOptions}
                  >
                    <RequiredRule message="La contraseña es requerida" />
                    <Label visible={false} />
                  </Item> */}
                  {/* <Item
                    dataField={"rememberMe"}
                    editorType={"dxCheckBox"}
                    editorOptions={rememberMeEditorOptions}
                  >
                    <Label visible={false} />
                  </Item> */}
                  {/* <ButtonItem>
                    <ButtonOptions
                      className="btnLogin"
                      width={"100%"}
                      type={"default"}
                      useSubmitBehavior={true}
                       onClick={() => Login()}
                     >
                       <span className="dx-button-text">
                         {loading ? (
                           <LoadIndicator
                             width={"24px"}
                             height={"24px"}
                             visible={true}
                           />
                         ) : (
                           "Iniciar Sesión"
                         )}
                       </span>
                     </ButtonOptions>
                   </ButtonItem>
                   <Item>
                     <div className={"link"}>
                       <Link to={"/reset-password"}>
                         Olvidaste tu contraseña?
                       </Link>
                     </div>
                   </Item>
                 </Form> */}

                {/* <div className="dividerOr">
                  <divider className="divider" />
                  <span className=" OR ">O INICIA SESIÓN CON</span>
                  <divider className="divider" />
                </div>
                <div className="icon  flex items-center justify-center">
                  <div className="google">
                    <img src="/iconos/iconogoogle.png" />
                  </div>
                  <div className="apple">
                    <img src="/iconos/iconoapple.png" />
                  </div>
                  <div className="facebook">
                    <img src="/iconos/iconofacebook.png" />
                  </div>
                </div> */}
              {/* </form>
            </div>
          </div>
        </div>
      </div> */}

     <section className="containerLogin">
      <div className="containerLogin-left">
        <div className="logoLogin">
          {/* Aqui iria el logo */}
          <div className="Logo"></div>
          <div className="BrandingImage"></div>
        </div>

        <div className="branding">
          <div className="logoImg"></div>
          <div className="infoBranding">
            <h5>Gestiona ya tus Establecimientos</h5>
          </div>
          <div className="textBranding">
            <p>La información que requieres, cuando lo necesitas y donde la necesitas</p>
          </div>
        </div>
        
        <div className="buttonsBrandingContainer">
          <div className="buttonBranding" onClick={onCreateAccountClick}>
          <p>Registro</p>
          </div>
          <div className="buttonBranding buttonActive">
            <p>Iniciar Sesión</p>
          </div>
        </div>

      </div>

      <div className="containerLogin-right">
        <div className="formLoginContainer">
          <h5 className="formTitle">Iniciar Sesión</h5>
          {/* <p className="formInfo"></p> */}

          <form className={"login-form test"}>
                <Form formData={Datauser}>
                  <Item
                    dataField={"email"}
                    editorType={"dxTextBox"}
                    editorOptions={emailEditorOptions}
                  > 
                    
                     <RequiredRule message="El correo es requerido" />
                    <EmailRule message="Debe ingresar un correo válido" /> 
                     <Label visible={false} />
                  </Item>
                  <Item
                    dataField={"password"}
                    editorType={"dxTextBox"}
                    editorOptions={passwordEditorOptions}
                  >
                    <RequiredRule message="La contraseña es requerida" />
                    <Label visible={false} />
                  </Item>
                      <Item
                       dataField={"rememberMe"}
                       editorType={"dxCheckBox"}
                       editorOptions={rememberMeEditorOptions}
                      >
                        <Label visible={false} />
                      </Item> 
                  <ButtonItem>
                    <ButtonOptions
                      className="btnLogin"
                      width={"100%"}
                      type={"default"}
                      useSubmitBehavior={false}
                       onClick={() => Login()}
                     >
                       <span className="dx-button-text">
                         {loading ? (
                           <LoadIndicator
                             width={"24px"}
                             height={"24px"}
                             visible={true}
                           />
                         ) : (
                           "Iniciar Sesión"
                         )}
                       </span>
                     </ButtonOptions>
                   </ButtonItem>
                 </Form>
                
                </form>
          
          
          <div className="registerLink">
            <div>
              <p>¿No tienes cuenta? <span><Link className="link" to={"/create-account"}>Registrate</Link></span></p>
            </div>
            <div className="forgetPassword">
              <Link className="link" to={'/reset-password'}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div className="formSignUp">
            <div className="signUpTitle">
              <div className="signUpLine lineInversa"></div>
              <p>Or sign in with</p>
              <div className="signUpLine"></div>
            </div>
            <div className="signUpOptionsContainer">
              <div className="signUpOption">
                <img src="/imageness/google.png"/>
              </div>
              <div className="signUpOption">
                <img src="/imageness/apple.png"/>
              </div>
              <div className="signUpOption">
                <img src="/imageness/facebook.png"/>
              </div>
            </div>
          </div>

        </div>
      </div>
     </section>
    </>
  );
}

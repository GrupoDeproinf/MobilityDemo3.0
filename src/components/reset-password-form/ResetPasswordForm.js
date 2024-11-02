import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Form, {
  Item,
  Label,
  ButtonItem,
  ButtonOptions,
  RequiredRule,
  EmailRule
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import './ResetPasswordForm.scss';
import {app} from "../../api/firebaseEnv";
import { Button } from "devextreme-react/button";
import { ToolbarItem } from "devextreme-react/popup";
const notificationText = 'Hemos enviado un enlace a tu correo para reestablecer tu contraseña.';

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState("");
  // const [email, setemail] = useState("");
  // const [password, setpassword] = useState("");

  const User = {
    email:"",
    password:"",
  };

  // const onSubmit = useCallback(async (e) => {
  //   e.preventDefault();
  //   const { email } = formData.current;
  //   setLoading(true);

  //   const result = await resetPassword(email);
  //   setLoading(false);

  //   if (result.isOk) {
  //     navigate('/login');
  //     notify(notificationText, 'success', 2500);
  //   } else {
  //     notify(result.message, 'error', 2000);
  //   }
  // }, [navigate]);

  const Forgot = useCallback(() => {
    // console.log(e)
    // e.preventDefault();
    console.log(User.email);
    app
      .auth()
      .sendPasswordResetEmail(User.email)
      .then((res) => {
        // console.log("bien")
        // console.log(res);
        navigate('/login')
      })
      .catch((err) => {
        console.log("correo inválido o no existe ")
        seterror("correo inválido o no existe ");
        console.log(err);
      });

  })

  return (
    <form className={'reset-password-form'}>
      <Form formData={User} >
        <Item
          dataField={'email'}
          editorType={'dxTextBox'}
          editorOptions={emailEditorOptions}
        >
          <RequiredRule message="El correo es requerido" />
          <EmailRule message="Debe ingresar un correo válido" />
          <Label visible={false} />
        </Item>
        <Item>
          <Button onClick={Forgot} className="dx-button-text">
            Reestablecer
          </Button>
        </Item>

        {/* <ButtonItem>
          <Button
            elementAttr={submitButtonAttributes}
            width={'100%'}
            type={'default'}
            useSubmitBehavior={true}
            onClick={(e) => Forgot(e)}
          >
            <span className="dx-button-text">
              {
                loading
                  ? <LoadIndicator width={'24px'} height={'24px'} visible={true} />
                  : 'Reestablecer'
              }
            </span>
          </Button>
        </ButtonItem> */}
        <Item>
          <div className={'login-link'}>
            Regresar a <Link to={'/login'}>Iniciar Sesión</Link>
          </div>
        </Item>
      </Form>
    </form>
  );
}

const emailEditorOptions = { stylingMode: 'filled', placeholder: 'Correo', mode: 'email' };
const submitButtonAttributes = { class: 'submit-button' };

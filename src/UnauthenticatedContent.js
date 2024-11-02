import { Routes, Route, Navigate } from "react-router-dom";
import { SingleCard } from "./layouts";
import {
  LoginForm,
  ResetPasswordForm,
  ChangePasswordForm,
  CreateAccountForm,
} from "./components";

export default function UnauthenticatedContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route
        path="/create-account"
        element={
          <SingleCard title="Registro">
            <CreateAccountForm />
          </SingleCard>
        }
      />
      <Route
        path="/reset-password"
        element={
          <SingleCard
            title="Reestablecer contraseña"
            description="Ingrese la dirección de correo electrónico que utilizó para registrarse y le enviaremos un enlace para restablecer su contraseña por correo electrónico."
          >
            <ResetPasswordForm />
          </SingleCard>
        }
      />
      <Route
        path="/change-password/:recoveryCode"
        element={
          <SingleCard title="Cambiar Contraseña">
            <ChangePasswordForm />
          </SingleCard>
        }
      />
      <Route path="*" element={<Navigate to={"/login"} />}></Route>
    </Routes>
  );
}

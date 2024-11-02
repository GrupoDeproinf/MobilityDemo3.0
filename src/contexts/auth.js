import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { getUser } from '../api/auth';
import {app, fire, storage} from "../api/firebaseEnv"
import axios from "axios"
import settings from '../api/enviroment';
import { getStorage } from 'firebase/storage';


function AuthProvider(props) {
  const [API_URL] = useState(settings.API_URL);

  const [user, setUser] = useState();
  const [token, settoken] = useState();
  const [loading, setLoading] = useState(true);
  const [Error, setError] = useState("");
  // const [Formulario, setFormularios] = useState([]);
  useEffect(() => {(
      
    async function () {
      const Login = localStorage.getItem("user"); 
      const result = await getUser();
      if (result.isOk) {
        setUser(user);
      }

      if(Login === "" && Login === undefined && Login === null){
        fire
        .collection("Usuarios")
        .where("uid", "==", Login)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            let datos = doc.data();
            // LeerFormr(datos.cliente);
            console.log(datos)

            let asignados = datos.asignados != undefined ? datos.asignados.filter(x=> x.nombre != undefined).sort((a, b) => a.nombre.localeCompare(b.nombre)) : []
            let cliente = datos.cliente != undefined ? datos.cliente.filter(x=> x != undefined).sort((a, b) => a.localeCompare(b)) : []
            let establecimientos = datos.establecimientos != undefined ? datos.establecimientos.filter(x=> x.nombre_establecimiento != undefined).sort((a, b) => a.nombre_establecimiento.localeCompare(b.nombre_establecimiento)) : []
            let region = datos.region != undefined ? datos.region.filter(x=> x != undefined).sort((a, b) => a.localeCompare(b)) : []

            datos.asignados = asignados
            datos.cliente = cliente
            datos.establecimientos = establecimientos
            datos.region = region

            setUser(datos);
            localStorage.setItem('user', datos.uid)
            console.log(datos)
            let dataFinal = datos?.menu?.filter(x=> x.text != "Asignar establecimientos")

            datos.menu = dataFinal == undefined ? [] : dataFinal

            localStorage.setItem('userData', JSON.stringify(datos))


            if (datos) {
              axios
                .post(`${API_URL}Login`, {
                  email: datos.correo,
                })
                .then((res) => {
                  if (res.data) {
                    settoken(res.data.token);
                    localStorage.setItem('userToken', res.data.token);
                  }
                });

            } else {
            }
          });
        });
      }else{
        let user = JSON.parse(localStorage.getItem('userData'))
        let token = localStorage.getItem('userToken')
        setUser(user);
        settoken(token);
      }
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (email, password) => {

    return app
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const User = userCredential.user;
        fire
          .collection("Usuarios")
          .where("uid", "==", User.uid)
          .onSnapshot(function (querySnapshot) {
            return querySnapshot.forEach(function (doc) {
              let datos = doc.data()
              console.log(datos)

              let asignados = datos.asignados != undefined ? datos.asignados.filter(x=> x.nombre != undefined).sort((a, b) => a.nombre.localeCompare(b.nombre)) : []
              let cliente = datos.cliente != undefined ? datos.cliente.filter(x=> x != undefined).sort((a, b) => a.localeCompare(b)) : []
              let establecimientos = datos.establecimientos != undefined ? datos.establecimientos.filter(x=> x.nombre_establecimiento != undefined).sort((a, b) => a.nombre_establecimiento.localeCompare(b.nombre_establecimiento)) : []
              let region = datos.region != undefined ? datos.region.filter(x=> x != undefined).sort((a, b) => a.localeCompare(b)) : []

              datos.asignados = asignados
              datos.cliente = cliente
              datos.establecimientos = establecimientos
              datos.region = region


              setUser(datos);
              localStorage.clear();
              localStorage.setItem('user', datos.uid)
              console.log(datos)

              let dataFinal = datos?.menu?.filter(x=> x.text != "Asignar establecimientos")

              datos.menu = dataFinal == undefined ? [] : dataFinal

              localStorage.setItem('userData', JSON.stringify(datos))

              if (datos) {
                axios
                  .post(`${API_URL}Login`, {
                    email: email,
                  })
                  .then((res) => {
                    if (res.data) {
                      settoken(res.data.token);
                      localStorage.setItem('userToken', res.data.token);
                      return {message: res.data, status: 200};
                    }
                  });
              } else {
                return {message: datos, status: 204};
              }
            });
          });
      })
      .catch((err) => {
        setError("Usuario o contraseña invalida, por favor verifique");
        return {message: err, status: 500};
      });
  }, []);

  const signOut = useCallback(() => {
    setUser();
    localStorage.setItem('user', null)
    localStorage.clear();
    sessionStorage.clear()
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading, Error, }} {...props} />
  );
}

const AuthContext = createContext({ });
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }

import React, { useState, useEffect } from 'react';
import './dx-styles.scss';
import Content from './Content';
import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import { useNavigate } from "react-router-dom";
import './themes/generated/theme.additional.css';
import LoadPanel from 'devextreme-react/load-panel';
import { HashRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import { NavigationProvider } from './contexts/navigation';
import UnauthenticatedContent from './UnauthenticatedContent';
import axios from 'axios';
import { locale, loadMessages } from 'devextreme/localization';
import esMessages from 'devextreme/localization/messages/es.json';

loadMessages(esMessages);
locale('es');

function App() {
  const { user, loading } = useAuth();
  const history = useNavigate();

  useEffect(() => {
    localStorage.clear()
  }, []);

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    // const userData = JSON.parse(localStorage.getItem("userData"))
    // if (userData !== undefined && userData !== null){
    //   history(userData.paginaInicio);
    // } else {
      return <Content />;
    // }
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();
  const [carga, setcarga] = useState(false);

  useEffect(()=>{
    axios.interceptors.request.use(
      (req) => {
          // const token = localStorage.getItem("userToken")
          const token = "eyJhbGciOiJIUzI1NiJ9.amVyaXNtYXJ2QGdtYWlsLmNvbQ.ty-QB5b4NLvipLzhFRJBul_Ps5ZVhfkO4_GOevxQb5U"
          if (token) {
            req.headers['Authorization'] = 'Bearer ' + token
          }
          setcarga(true)
          return req;
      },
      (err) => {
          setcarga(false)
          return Promise.reject(err);
      }
    );

    axios.interceptors.response.use(
      (res) => {
          // Add configurations here
          
          if (res.status === 200) {
            setcarga(false)
            return res;
          }
          setcarga(false)
          return res;
      },
      (err) => {
          setcarga(false)
          return Promise.reject(err);
      }
    );

  }, [])

  return (
    <Router>
      <AuthProvider>
          <NavigationProvider>
            <div className={`app ${screenSizeClass}`}>
              <App />
              <LoadPanel visible={carga} />
            </div>
          </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}

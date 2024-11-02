import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';

export default function Content() {

  const [RutaInicial, setRutaInicial] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    setRutaInicial(userData.paginaInicio)
  }, []);

  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={element}
          />
        ))}
        <Route
          path='*'
          element={<Navigate to={RutaInicial} />}
        />
      </Routes>
      <Footer>
        Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Inc.
        <br />
        All trademarks or registered trademarks are property of their
        respective owners.
      </Footer>
    </SideNavBarLayout>
  );
}


import React, { useState, useEffect } from 'react';
import Menu from 'devextreme-react/menu';
import HomeGrafics1 from './homeGrafics/homegrafics1'
import './home.scss';

export default function Home() {
  const [UsuariosAsignados, setUsuariosAsignados] = useState([]);
  const [Graphics, setGraphics] = useState('Efectividad');

useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userData"));
    const userAsig = user.asignados.filter((cadausuario)=> cadausuario.version_app != undefined)
    setUsuariosAsignados(userAsig.slice(0,4));
}, [])

  // ++++++++++++++++++++++++++++++++

const menuGraficas = [{
  id: '1',
  name: 'Efectividad',
}, {
  id: '2',
  name: 'Usuarios',
}, {
  id: '3',
  name: 'Formularios',
}, {
  id: '4',
  name: 'Establecimientos',
}];

const showSubmenuModes = [{
  name: 'onHover',
  delay: { show: 0, hide: 500 },
}];

const state = {
  showFirstSubmenuModes: showSubmenuModes[0],
  orientation: 'horizontal',
  hideSubmenuOnMouseLeave: true,
  currentProduct: null,
};

const itemClick = (e) => {
  const { itemData } = e;
  console.log("🚀 ~ file: home.js ~ line 290 ~ itemClick ~ itemData", itemData)
  setGraphics(itemData.name);
}

return (
    <React.Fragment>
      <div className="row mt-3">
        <div className="col-md-6">
          <div className="row">
            {
              UsuariosAsignados.map((cadaUser)=>{
                return (
                  cadaUser.length != 0 ? (
                  <div className="col-md-6">
                    <div className="card mt-2">
                      <div className="card-body">
                        <div className="d-flex align-items-center justify-content-around">
                          <img src="icone-utilisateur-orange.png" alt="imagen-spoc" width={45}/>
                          <div className="">
                            <p>{cadaUser.nombre}</p>
                            <p>V. {cadaUser.version_app}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    ) : ''
                )
              })
            }
          </div>
        </div>
        <div className="col-md-6">
          <div className="mt-2">
            <img src="https://firebasestorage.googleapis.com/v0/b/testapi-16c41.appspot.com/o/files%2Fbanners%2FBanner%20full.png?alt=media&token=d7fada46-c18e-401e-b9f9-4ddb3d60e4de" width={'75%'} alt="banner-app" />
          </div>
        </div>
      </div>

      <div className="mt-4 row justify-content-center">
        <div className="card col-sm-12 col-md-6">
          <div className="card-body">
            <div className="form" style={{textAlignLast: 'center'}}>
              <div>
                <Menu dataSource={menuGraficas}
                  displayExpr="name"
                  showFirstSubmenuMode={state.showFirstSubmenuModes}
                  orientation={state.orientation}
                  hideSubmenuOnMouseLeave={state.hideSubmenuOnMouseLeave}
                  onItemClick={itemClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {(() => {
        switch (Graphics) {
          case 'Efectividad':
            return <HomeGrafics1 />
          case 'Graficos 2':
            // return <Playing handleClick={handleClick} />
          case 'Graficos 3':
            // return <Won handleClick={handleClick} />
          case 'Graficos 4':
            // return <Lost handleClick={handleClick} />
          default:
            return ''
        }
      })()}

    </React.Fragment>
)}

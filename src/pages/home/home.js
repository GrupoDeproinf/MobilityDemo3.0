import React, { useState, useEffect } from 'react';
import HomeEffectiveness from './homeGrafics/homeEffectiveness';
import HomeForms from './homeGrafics/hemeForms';
import HomeInventory from './homeGrafics/homeInventory';
import Menu from 'devextreme-react/menu';
import './home.scss';

export default function Home() {
  const [UsuariosAsignados, setUsuariosAsignados] = useState([]);
  const [Graphics, setGraphics] = useState('Efectividad');

useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userData"));
    const userAsig = user.asignados.filter((cadausuario)=> cadausuario.version_app != undefined)
    setUsuariosAsignados(userAsig.slice(0,8));
}, [])

  // ++++++++++++++++++++++++++++++++

const menuGraficas = [{
  id: '1',
  name: 'Efectividad',
}, 
// {
//   id: '2',
//   name: 'Usuarios',
// },
{
  id: '3',
  name: 'Formularios',
}, 
// {
//   id: '4',
//   name: 'Inventario',
// }
];

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
  setGraphics(itemData.text);
}

const menuItems = [{
  text: 'Efectividad', icon: 'chart'
}, 
// {
//   text: 'Usuarios', icon: 'user',
// }, 
{
  text: 'Formularios', icon: 'paste',
}, 
{
  text: 'Inventario', icon: 'box',
}
];

return (
    <React.Fragment>
      {/* <div className="row mt-3">
        <div className="col-md-12">
          <div className="row">
            {
              UsuariosAsignados.map((cadaUser)=>{
                return (
                  cadaUser.length != 0 ? (
                  <div className="col-md-3">
                    <div className="card mt-2">
                      <div className="card-body">
                        <div className="d-sm-flex align-items-center justify-content-around">
                          {
                            cadaUser.foto_personal !== undefined ?
                            <img src={cadaUser.foto_personal} alt="imagen-spoc" className='image-user'/> :
                            <img src="icone-utilisateur-orange.png" alt="imagen-spoc" className='image-user'/>
                          }
                          <div className="">
                            <p>{cadaUser.nombre}</p>
                            <p>{cadaUser.cliente[0]}</p>
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
      </div> */}

      <div className="mt-2 mx-4">
        <div className="card" style={{width: "40.75%", border: "none", borderRadius: "5vh"}}>
          <div className="card-body p-0">
            <div className="form">
              <div>
                <Menu 
                  items={menuItems}
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
            return <HomeEffectiveness />
          case 'Usuarios':
            // return <Lost handleClick={handleClick} />
          case 'Formularios':
            return <HomeForms />
          case 'Inventario':
            return <HomeInventory />
          default:
            return ''
        }
      })()}

    </React.Fragment>
)}

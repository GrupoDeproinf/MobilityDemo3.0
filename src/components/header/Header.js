import "./Header.scss";
import React, { useEffect } from "react";
import "../user-panel/UserPanel";
import Button from "devextreme-react/button";
import { useAuth } from "../../contexts/auth";
import UserPanel from "../user-panel/UserPanel";
import Toolbar, { Item } from "devextreme-react/toolbar";
import { Template } from "devextreme-react/core/template";

export default function Header({ menuToggleEnabled, title, toggleMenu }) {
  const { user, signOut } = useAuth();

  useEffect(()=>{
    if(user.foto_personal == undefined) {
      user.foto_personal = '/icone-utilisateur-orange.png';
    }
  })

  return (
    <header className={"header-component"}>
      <Toolbar className={"header-toolbar"}>
        <Item
          visible={menuToggleEnabled}
          location={"before"}
          widget={"dxButton"}
          cssClass={"menu-button"}
        >
          {/* <Button icon="menu" stylingMode="text" onClick={toggleMenu} /> */}
        </Item>

        <Item
          location={"before"}
          cssClass={"header-title"}
          text={title}
          visible={!!title}
        />
        {/* <div>
            <input
                className="buscadorHeader"
                label="Nombre"
                id="name"
                variant="outlined"
                fullWidth
              />
            </div> */}

        <Item
          location={"after"}
          locateInMenu={"auto"}
          menuItemTemplate={"userPanelTemplate"}
        >
          <div className={"user-info"}>

          <Button
              className={"user-button authorization"}
              stylingMode={"text"}
            >
              <UserPanel menuMode={"context"} className={'user-panel-component'}/>
            </Button>

            <div className={"user-info-container"}>
              <div>
                <p>{user.nombre}</p>
              </div>
              <div className={"image-container"}>
                <img alt={""} src={`${user.foto_personal}`} />
              </div>
            </div>

            
          </div>
        </Item>
        <Template name={"userPanelTemplate"}>
          <UserPanel menuMode={"list"} />
        </Template>
      </Toolbar>
    </header>
  );
}

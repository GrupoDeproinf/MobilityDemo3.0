import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useAuth } from "../../contexts/auth";
import "./UserPanel.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function UserPanel({ menuMode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const menuItems = useMemo(
    () => [
      {
        text: "Usuarios",
        icon: "user",
        onClick: navigate("/User"),
      },
      {
        text: "Formulario",
        icon: "runner",
        onClick: navigate("/formularios"),
      },
      {
        text: "Asignar Usuarios",
        icon: "runner",
        onClick: navigate("/AsignacionUsuarios"),
      },
    ],
    [signOut]
  );
  return (
    <div>
      <div className={"user-panel"}>
        {/* <div className={"user-info"}>
          <div className={"image-container"}>
            <div className={"form-avatar"}>
              <img alt={""} src={`${user.foto_personal}`} />
            </div>
          </div>
        </div> */}
        <div className="iconosvg">
          <FontAwesomeIcon icon={faPlus} color="#A3A3A3"/>
        </div>

       

        {menuMode === "context" && (
          <ContextMenu
            items={menuItems}
            target={".user-button"}
            showEvent={"dxclick"}
            width={50}
            cssClass={"user-menu"}
          >
            <Position my={"top center"} at={"bottom center"} />
          </ContextMenu>
        )}
        {menuMode === "list" && (
          <List className={"dx-toolbar-menu-action"} items={menuItems} />
        )}
      </div>
    </div>
  );
}

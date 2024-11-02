import React, { useState, useEffect } from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { Toast } from "devextreme-react/toast";
import ScrollView from "devextreme-react/scroll-view";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  HeaderFilter,
  ColumnChooser,
  Export,
} from "devextreme-react/data-grid";

import * as ManagerAPI from "../../api/Manager";
import "./User.scss";

function FormManager() {
  const [id, setID] = useState();
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    type: "success",
    message: "Guardado Exitosamente",
    displayTime: 2000,
  });

  useEffect(() => {
    getAllUser();
  }, []);

  const getAllUser = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const uid = userData.uid;
    console.log(uid);

    ManagerAPI.Cipher({uid:uid})
      .then((response) => {
        console.log(response);
        setID(response);
      })
      .catch((err) => {
        console.log(err.toString());
      });
  };

  const url = id === undefined ? "" : `https://manager.mobility-web.com/#/form?pass=${id.key ?? ""}-${id.encryptedData ?? ""}-${id.iv ?? ""}`;

  console.log(url);
  return (
    <React.Fragment>
        {id && <iframe title="Manager" src={url} width="100%" height="100%"></iframe>}
    </React.Fragment>
  );
}

export default FormManager;
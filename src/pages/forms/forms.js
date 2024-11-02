import SelectBox from "devextreme-react/select-box";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "devextreme-react/button";
import { useNavigate } from "react-router-dom";
import { Toast } from "devextreme-react/toast";
import { useAuth } from "../../contexts/auth";
import List from "devextreme-react/list";
import "./forms.scss";
import { CloudUploadFill } from "react-bootstrap-icons";
import FileUploader from "devextreme-react/file-uploader";
//Services
import * as FormService from "../../api/forms";
import * as ListUser from "../../api/ListUser";
import * as EstabService from "../../api/establishment";
import * as DinamicQueries from "../../api/DinamicsQuery";

//Components UI
import Card from "../../components/card/Card";

export default function Forms() {
  const { user } = useAuth();
  const inputRef = useRef(null);
  const [dataSourceOptions, setDataSource] = useState([]);
  const [establecimientos, setEstablecimientos] = useState([]);
  const [selectedEstab, setSelectedEstab] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Formulario Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  const history = useNavigate(); // <-- useHistory

  useEffect(() => {
    console.log("Conected USer ", user);
    localStorage.removeItem("Actualizar");
    searchClientsForm(user.cliente[0]);
    let savedForm = localStorage.getItem("SelectedForm");

    if (savedForm) savedForm = JSON.parse(savedForm);

    if (savedForm && savedForm.completado === true) {
      console.log("Pasé ", savedForm);
      setToastConfig({
        ...toastConfig,
        isVisible: true,
      });
      console.log(toastConfig);
      localStorage.removeItem("SelectedForm");
    }
  }, []);

  const renderForm = (form) => {
    if (form.name === "selectedItemKeys" && form.value.length > 0) {
      // form.value[0].establecimiento = user.establecimientos.find(x=> x.id_establecimiento === selectedEstab.id_establecimiento);
      form.value[0].establecimiento = selectedEstab;
      console.log("🚀 ~ renderForm ~ selectedEstab:", selectedEstab);
      console.log("Elegí formulario ", form.value);
      localStorage.setItem("SelectedForm", JSON.stringify(form.value));
      history("/Form");
    }
  };

  const searchClientsForm = (cliente) => {
    console.log("Elegí Cliente ", cliente);
    const client = cliente.value ? cliente.value : cliente;
    // setSelectedEstab(null)
    FormService.getForms(client)
      .then((data) => {
        console.log(data);

        if (data.status === 200) {
          if (data.data.error === "Lista vacia") {
            setDataSource([]);
          } else {
            const forms = data.data.data.filter((x) => x.estatus === true);
            setDataSource(forms);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setToastConfig({
          ...toastConfig,
          type: "error",
          message: err.message,
          isVisible: true,
        });
      });

    DinamicQueries.getDataWithParameters("getEstablecimientoNewCollection", "usuarios/", {
      uid: user.uid,
    }).then((EstablecimientosAsigandosColeccionNueva) => {
      setEstablecimientos(EstablecimientosAsigandosColeccionNueva.data.data);
    })

  };

  const chooseEstablishment = (item) => {
    console.log("Establecimiento ", item);

    if (item.value) {
      setSelectedEstab(item.value);
    } else {
      setSelectedEstab(null);
    }
  };

  const chooseClient = (item) => {
    console.log("Cliente ", item);
    setSelectedClient(item.value);
    searchClientsForm(item.value);
  };

  const renderListItem = (item) => {
    console.log("ITEM FORm ", item);
    return (
      <div>
        <div className="form-item">
          <div className="name">
            <h6>{item.nombre}</h6>
          </div>
          <div className="cliente d-flex">
            <p className="subtitle-form">Cliente: </p> {item.cliente}
          </div>
          <div className="version d-flex">
            <p className="subtitle-form">Versión: </p> V.{item.version}
          </div>
        </div>
      </div>
    );
  };

  const goEditForm = () => {
    history("/EditForm");
  };

  const handleClickUpload = () => {
    inputRef.current.click();
  };

  const uploadFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }

    e.target.value = null;

    console.log("FILE? ", file);

    const reader = new FileReader();

    reader.onload = async (event) => {
      let dataFile = event.target.result;

      if (dataFile !== undefined) {
        // console.log("ENCONTRÉ MI FORM ", dataFile)
        let json;
        try {
          json = JSON.parse(dataFile)[0];
          console.log(json);
          console.log("Elegí formulario ", json);
          localStorage.setItem("SelectedForm", JSON.stringify([json]));
          localStorage.setItem("Actualizar", "Yes");
          history("/Form");
        } catch (e) {
          console.log("🚀 ~ file: forms.js:151 ~ reader.onload=async ~ e:", e);
          setToastConfig({
            ...toastConfig,
            type: "error",
            message: "El archivo ingresado no es válido",
            isVisible: true,
          });
          return;
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <React.Fragment>
      <div id="container">
        <div className="d-flex">
          <div className="header-grid-title">
            <h5 className="content-block titleCliente mb-3 mt-4">
              Formularios
            </h5>
          </div>
          <div className="d-flex">
            <Button
              className="btn-agregar mt-4 mb-3 mr-2"
              onClick={handleClickUpload}
              style={{ width: "220px" }}
            >
              Subir Respaldo <CloudUploadFill className="ml-2" />
            </Button>
            <input
              type="file"
              style={{ display: "none" }}
              accept=".txt"
              title="Subir Respaldo"
              ref={inputRef}
              onChange={uploadFile}
            />
            <Button
              className="btn-agregar mt-4 mb-3"
              onClick={goEditForm}
              style={{ width: "215px" }}
            >
              Editar Formularios
            </Button>
            
          </div>
        </div>

        <Card className="h-80">
          <div className="dx-field">
            <div className="dx-field-label">Cliente</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={user.cliente}
                onValueChanged={chooseClient}
                searchEnabled={true}
                noDataText="No se encontró data"
                placeholder="Buscar..."
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Establecimiento</div>
            <div className="dx-field-value">
              <SelectBox
                dataSource={establecimientos}
                onValueChanged={chooseEstablishment}
                searchExpr="nombre_establecimiento"
                displayExpr="nombre_establecimiento"
                noDataText="No se encontraron establecimientos"
                value={selectedEstab}
                searchEnabled={true}
                placeholder="Buscar..."
              />
            </div>
          </div>
          {selectedEstab && selectedClient && (
            <List
              className="list-forms"
              selectionMode="single"
              dataSource={dataSourceOptions}
              itemRender={renderListItem}
              elementAttr={{ class: "list" }}
              onOptionChanged={renderForm}
              noDataText="No se encontraron formularios"
            />
          )}

          <Toast
            visible={toastConfig.isVisible}
            message={toastConfig.message}
            type={toastConfig.type}
            onHiding={() =>
              setToastConfig({ ...toastConfig, isVisible: false })
            }
            displayTime={toastConfig.displayTime}
          />
        </Card>
      </div>
    </React.Fragment>
  );
}

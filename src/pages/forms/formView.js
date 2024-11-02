import * as DinamicQueries from "../../api/DinamicsQuery";
import { NumberBox } from "devextreme-react/number-box";
import ArrayStore from "devextreme/data/array_store";
import DataSource from "devextreme/data/data_source";
import SelectBox from "devextreme-react/select-box";
import { TextBox } from "devextreme-react/text-box";
import React, { useState, useEffect } from "react";
import TextArea from "devextreme-react/text-area";
import { Button } from "devextreme-react/button";
import ModalPhoto from "./modalPhoto/modalPhoto";
import DateBox from "devextreme-react/date-box";
import { useNavigate } from "react-router-dom";
import { Toast } from "devextreme-react/toast";
import List from "devextreme-react/list";
import Moment from "moment";

//Componentes Externos
import Card from "../../components/card/Card";
import LeftListForm from "./leftListForm/leftListForm";
import RightListForm from "./rightListForm/rightListForm";

//Popup
import { ExclamationDiamond } from "react-bootstrap-icons";
import { CheckLg } from "react-bootstrap-icons";
import { XLg } from "react-bootstrap-icons";

import ScrollView from "devextreme-react/scroll-view";
import { Popup, ToolbarItem } from "devextreme-react/popup";

//Services
import * as FormService from "../../api/forms";

//Firebase
import { storage } from "../../api/firebaseEnv";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import LoadPanel from "devextreme-react/load-panel";
import "./formView.scss";
import { fire } from "../../api/firebaseEnv";

export default function FormView() {
  const history = useNavigate(); // <-- useHistory
  const listAttrs = { class: "list" };
  const [state, setState] = useState({});
  const [formDate, setFormDate] = useState(); // Fecha de Carga
  const today = new Date();
  const [dataForm, setDataForm] = useState({}); // Data Final de FOrmulario
  const [disableSave, setDisable] = useState(true); // Deshabilita boton de guardar
  const [establecimientos, setEstablecimientos] = useState({
    selectedEstab: {},
    estabs: [],
  });

  const [selectedItemClassLeft, setSelectedItemClassLeft] = useState({
    classDisable: "",
    selectedItem: "",
  });

  const [cambioEstablecimiento, setCambioEstablecimiento] = useState(false);

  //Construcción de Formulario
  const [selectedItems] = useState([]);
  const [finalProducts, setFinalProducts] = useState([]);
  const [finalQuestionsCategory, setFinalQuestionsCategory] = useState([]);
  const [finalMarcas, setFinalMarcas] = useState([]);
  const [currentCategory, setCurrentCategory] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedQuestionsParent, setSelectedQuestionsParent] = useState([]);
  const [selectedQuestionsMarca, setSelectedQuestionsMarca] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState([]);
  const [dataSourceOptions, setDataSourceOptions] = useState({
    group: "categoria",
    searchExpr: ["categoria", "items"],
  });
  const [lengthCategory, setLengthCategory] = useState({
    length: 0,
    defaultValue: [],
  });
  const [defaultCategory, setDefaultCategory] = useState([]);
  const [defaultMarca, setDefaultMarca] = useState([]);

  //Modales y alertas
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupTasa, setShowPopupTasa] = useState(false);
  const [showPopupImages, setShowPopupImages] = useState(false);
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [showPhotoPopup, setShowPhotoPopup] = useState(false);
  const [toastConfig, setToastConfig] = React.useState(
    {
      isVisible: false,
      type: "success",
      message: "Guardado Exitosamente",
      displayTime: 2000,
    },
    []
  );

  //Tasa
  const [tasa, settasa] = useState();
  const [editingTasa, setEditingTasa] = useState(false);
  const [tempTasa, setTempTasa] = useState();
  const [loadingForm, setLoadingForm] = useState(false);
  const [Monedas, setMonedas] = useState(["$", "BS"]);
  const [ValueMoneda, setValueMoneda] = useState("$");

  //Fotos
  const [percent, setPercent] = useState(0);
  const [finalImages, setFinalImages] = useState([]);
  const [actualUpload, setActualUpload] = useState(0);
  const [formSelected, setformSelected] = useState("");
  const [hora_entrada, sethora_entrada] = useState("");
  const [hora_salida, sethora_salida] = useState("");
  const [observaciones, setobservaciones] = useState("");

  useEffect(() => {
    const form = JSON.parse(localStorage.getItem("SelectedForm"));
    let user = JSON.parse(localStorage.getItem("userData"));

    let dataFinalEstablecimientos = user.establecimientosNuevos;
    // .filter(
    //   (x) => x.nombre_cliente == form[0].cliente
    // );
    console.log(user.establecimientosNuevos);
    console.log(dataFinalEstablecimientos);
    console.log("FOrmulario ", form);
    setformSelected(form[0].nombre);
    console.log(formSelected);
    console.log(form[0]);
    console.log(form[0].preguntas);
    console.log(form[0].preguntas[3]);

    if(localStorage.getItem("Actualizar") != undefined) {
      console.log('Estoy editando')
      DinamicQueries.getDataWithParameters("getEstablecimientoNewCollection", "usuarios/", {
        uid: user.uid,
      }).then((EstablecimientosAsigandosColeccionNueva) => {
        setEstablecimientos({
          selectedEstab: {
            nombre_establecimiento: form[0].establecimiento,
            key: form[0].key_est,
          },
          estabs: EstablecimientosAsigandosColeccionNueva.data.data,
        });
        buildForm(form);
      })
    } else {
      console.log('No estoy editando, estoy creando')
      DinamicQueries.getDataWithParameters("getEstablecimientoNewCollection", "usuarios/", {
        uid: user.uid,
      }).then((EstablecimientosAsigandosColeccionNueva) => {
        setEstablecimientos({
          selectedEstab: {
            nombre_establecimiento: form[0].establecimiento.nombre_establecimiento,
            key: form[0].establecimiento.key,
          },
          estabs: EstablecimientosAsigandosColeccionNueva.data.data,
        });
        buildForm(form);
      })
    }


    // localStorage.removeItem("dataImages")
  }, []);

  const getBase64 = (form) => {
    form.forEach((x) => {
      convertirEnlaceABase64(x.foto, x.descripcion, x.tag);
    });
  };

  const convertirEnlaceABase64 = (enlace, descripcion, tag) => {
    return fetch(enlace)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const base64 = arrayBufferToBase64(buffer);
        // console.log(base64);
        convertirBase64AFile(
          base64,
          generarHexadecimalRandom,
          descripcion,
          tag
        );
        // return base64;
      });
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const generarHexadecimalRandom = () => {
    const caracteres = "0123456789ABCDEF";
    let hexadecimal = "";

    for (let i = 0; i < 6; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      hexadecimal += caracteres.charAt(indiceAleatorio);
    }

    return hexadecimal;
  };

  const convertirBase64AFile = (base64, nombreArchivo, descripcion, tag) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/octet-stream" });
    let fileNew = new File([blob], nombreArchivo);

    // console.log(file)
    let tipo = "";

    var data = base64.substring(0, 5);

    switch (data.toUpperCase()) {
      case "IVBOR":
        tipo = "png";
        break;
      case "/9J/4":
        tipo = "jpeg";
        break;
      case "JVBER":
        tipo = "pdf";
        break;
      case "UESDB":
        var data2 = base64.substring(0, 19);
        switch (data2.toUpperCase()) {
          case "UEsDBBQABgAIAAAAIQB":
            tipo = "xlsx";
            break;
          default:
            var data3 = base64.substring(0, 18);

            switch (data3.toUpperCase()) {
              case "UESDBBQABGAIAAAAIQ":
                tipo = "docx";
                break;
              default:
                tipo = "zip";
            }
        }
        break;
      case "UMFYI":
        tipo = "rar";
        break;
      case "U1PKC":
        tipo = "txt";
        break;
      default:
        console.log("aqui");
        break;
    }

    // console.log(tipo);
    let infoImage = {
      description: descripcion,
      file: fileNew,
      key: generarHexadecimalRandom(),
      name: generarHexadecimalRandom(),
      source: "data:image/" + tipo + ";base64," + base64,
      tag: tag,
    };
    setFinalImages((images) => [...images, infoImage]);
  };

  const buildForm = async (form) => {
    if (form) {
      if (form[0].fecha_Completado == undefined) {
        console.log("FORM ", form[0]);
        if (form[0].nombre != "ASISTENCIA") {
          setShowPopupTasa(true);
        }
      }

      setDataForm({ ...form[0] });

      if (form[0]?.fotos?.length > 0) {
        getBase64(form[0]?.fotos);
      }

      console.log(form);

      if (form[0].tasa != undefined) {
        settasa(form[0].tasa);
      } else {
        settasa(null);
      }

      if (form[0].tasa != undefined) {
        setValueMoneda(form[0].moneda);
      } else {
        setValueMoneda("$");
      }

      let i = 1;
      let finalArray = [];
      console.log("FINAL PRODUCTS ", finalProducts);
      let finalQuestions = [...finalProducts];
      let finalQuestionsMainCategory = [...finalQuestionsCategory];
      let finalQuestionsMarca = [...finalMarcas];
      await form[0].preguntas.map(async (niveles) => {
        niveles.Id = i++;
        niveles.key = niveles.categoria;
        niveles.items = [];

        console.log(niveles);
        if (niveles.hijos != undefined) {
          if (niveles.pregunta != undefined) {
            niveles.hijos[0].pregunta = niveles.pregunta;
          }

          await niveles.hijos.map(async (hijos) => {
            hijos.Id_parent = niveles.Id;
            // ***********************************  logica del value
            await hijos.marcas.forEach(async (marca) => {
              await marca.productos.forEach(async (producto) => {
                await producto.preguntas.forEach(async (pregunta) => {
                  let calculado = {};
                  if (pregunta.tipo === "Calculado") {
                    pregunta.campos.map((x) => {
                      calculado[x] = 0;
                    });
                  } else if (pregunta.tipo === "Emisión-Vencimiento") {
                    calculado = [
                      {
                        cantidad: 0,
                        motivo: null,
                        lote: "",
                        fecha_Emision: "",
                        fecha_Vencimiento: "",
                      },
                    ];
                  }

                  if (
                    finalProducts[producto.nombre + "_" + marca.nombre] ===
                    undefined
                  ) {
                    if (localStorage.getItem("Actualizar") != undefined) {
                      let respuesta;
                      if (pregunta.tipo === "Cantidad") {
                        if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                          respuesta = 0;
                        } else {
                          respuesta = pregunta.respuesta;
                        }
                      } else if (pregunta.tipo === "Precio") {
                        if (
                          isNaN(parseFloat(pregunta?.respuesta)) == true &&
                          typeof pregunta?.respuesta !== "object"
                        ) {
                          respuesta = {
                            dolares: 0,
                            bolivares: 0,
                          };
                        } else {
                          if (
                            pregunta.respuesta?.bolivares == undefined ||
                            pregunta.respuesta?.bolivares == null ||
                            pregunta.respuesta?.dolares == null ||
                            pregunta.respuesta?.dolares == undefined
                          ) {
                            respuesta = {
                              bolivares:
                                form[0].moneda == "BS"
                                  ? pregunta.respuesta
                                  : parseFloat(
                                      (
                                        pregunta.respuesta * form[0].tasa
                                      ).toFixed(2)
                                    ),
                              dolares:
                                form[0].moneda == "$"
                                  ? pregunta.respuesta
                                  : parseFloat(
                                      (
                                        pregunta.respuesta / form[0].tasa
                                      ).toFixed(2)
                                    ),
                            };
                          } else {
                            respuesta = {
                              bolivares:
                                isNaN(
                                  parseFloat(pregunta.respuesta?.bolivares)
                                ) == true
                                  ? 0
                                  : pregunta.respuesta.bolivares,
                              dolares:
                                isNaN(
                                  parseFloat(pregunta.respuesta?.dolares)
                                ) == true
                                  ? 0
                                  : pregunta.respuesta.dolares,
                            };
                          }
                        }
                      } else if (pregunta.tipo === "Simple") {
                        respuesta =
                          pregunta.respuesta === true ||
                          pregunta.respuesta === "Si"
                            ? "Si"
                            : "No";
                      } else if (pregunta.tipo === "Tamaño") {
                        if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                          respuesta = 0;
                        } else {
                          respuesta = pregunta.respuesta;
                        }
                      } else if (pregunta.tipo === "Fecha") {
                        if (!Moment(pregunta?.respuesta).isValid()) {
                          respuesta = "";
                        } else {
                          respuesta = pregunta.respuesta;
                        }
                      } else if (pregunta.tipo === "Calculado") {
                        respuesta = {};
                        if (typeof pregunta?.respuesta == "string") {
                          pregunta.campos.map((x) => {
                            respuesta[x] = 0;
                          });
                        } else {
                          pregunta.campos.map((x) => {
                            respuesta[x] = Number(pregunta?.respuesta[x]);
                          });
                        }
                      } else if (pregunta.tipo === "Emisión-Vencimiento") {
                        if (typeof pregunta?.respuesta == "string") {
                          respuesta = calculado;
                        } else {
                          respuesta = pregunta.respuesta.map((x) => {
                            let objFinal = {
                              cantidad:
                                x.cantidad == undefined
                                  ? 0
                                  : Number(x.cantidad),
                              motivo: x.motivo == undefined ? null : x.motivo,
                              lote: x.lote == undefined ? "" : x.lote,
                              fecha_Emision:
                                x.fecha_Emision == undefined
                                  ? ""
                                  : x.fecha_Emision,
                              fecha_Vencimiento:
                                x.fecha_Vencimiento == undefined
                                  ? ""
                                  : x.fecha_Vencimiento,
                            };
                            return objFinal;
                          });
                        }
                      } else {
                        respuesta = pregunta.respuesta;
                      }

                      finalQuestions[producto.nombre + "_" + marca.nombre] = {
                        ...finalQuestions[producto.nombre + "_" + marca.nombre],
                        [pregunta.pregunta]: respuesta,
                      };
                    } else {
                      finalQuestions[producto.nombre + "_" + marca.nombre] = {
                        ...finalQuestions[producto.nombre + "_" + marca.nombre],
                        [pregunta.pregunta]: setDefaultValueInput(
                          pregunta.tipo,
                          calculado
                        ),
                      };
                    }
                  }
                });
              });

              if (marca.preguntas) {
                await marca.preguntas.forEach(async (pregunta) => {
                  if (localStorage.getItem("Actualizar") != undefined) {
                    let respuesta;
                    if (pregunta.tipo === "Cantidad") {
                      if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                        respuesta = 0;
                      } else {
                        respuesta = pregunta.respuesta;
                      }
                    } else if (pregunta.tipo === "Precio") {
                      console.log(
                        "EVALUANDO PRECIOx2 ",
                        pregunta.respuesta + " / ",
                        isNaN(parseFloat(pregunta?.respuesta))
                      );
                      if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                        respuesta = {
                          dolares: 0,
                          bolivares: 0,
                        };
                      } else {
                        if (
                          pregunta.respuesta?.bolivares == undefined ||
                          pregunta.respuesta?.bolivares == null ||
                          pregunta.respuesta?.dolares == null ||
                          pregunta.respuesta?.dolares == undefined
                        ) {
                          respuesta = {
                            bolivares:
                              form[0].moneda == "BS"
                                ? pregunta.respuesta
                                : parseFloat(
                                    (pregunta.respuesta * form[0].tasa).toFixed(
                                      2
                                    )
                                  ),
                            dolares:
                              form[0].moneda == "$"
                                ? pregunta.respuesta
                                : parseFloat(
                                    (pregunta.respuesta / form[0].tasa).toFixed(
                                      2
                                    )
                                  ),
                          };
                        } else {
                          respuesta = {
                            bolivares:
                              isNaN(
                                parseFloat(pregunta?.respuesta?.bolivares)
                              ) == true
                                ? 0
                                : pregunta?.respuesta.bolivares,
                            dolares:
                              isNaN(parseFloat(pregunta?.respuesta?.dolares)) ==
                              true
                                ? 0
                                : pregunta?.respuesta.dolares,
                          };
                        }
                      }
                    } else if (pregunta.tipo === "Simple") {
                      respuesta =
                        pregunta.respuesta === true ||
                        pregunta.respuesta === "Si"
                          ? "Si"
                          : "No";
                    } else if (pregunta.tipo === "Tamaño") {
                      if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                        respuesta = 0;
                      } else {
                        respuesta = pregunta.respuesta;
                      }
                    } else if (pregunta.tipo === "Fecha") {
                      if (!Moment(pregunta?.respuesta).isValid()) {
                        respuesta = "";
                      } else {
                        respuesta = pregunta.respuesta;
                      }
                    } else {
                      respuesta = pregunta.respuesta;
                    }

                    finalQuestionsMarca[
                      niveles.categoria +
                        "_" +
                        hijos.subcategoria +
                        "_" +
                        marca.nombre
                    ] = {
                      ...finalQuestionsMarca[
                        niveles.categoria +
                          "_" +
                          hijos.subcategoria +
                          "_" +
                          marca.nombre
                      ],
                      [pregunta.pregunta]: respuesta,
                    };
                  } else {
                    finalQuestionsMarca[
                      niveles.categoria +
                        "_" +
                        hijos.subcategoria +
                        "_" +
                        marca.nombre
                    ] = {
                      ...finalQuestionsMarca[
                        niveles.categoria +
                          "_" +
                          hijos.subcategoria +
                          "_" +
                          marca.nombre
                      ],
                      [pregunta.pregunta]:
                        pregunta.tipo === "Precio" ||
                        pregunta.tipo === "Cantidad"
                          ? setDefaultValueInput(pregunta.tipo)
                          : "",
                    };
                  }
                });
              }
            });

            if (
              !hijos.preguntas &&
              niveles.preguntas != undefined &&
              form[0].cliente == "PUIG"
            ) {
              hijos.preguntas = niveles.preguntas;
            }

            if (hijos.preguntas) {
              await hijos.preguntas.forEach(async (pregunta) => {
                if (localStorage.getItem("Actualizar") != undefined) {
                  let respuesta;
                  if (pregunta.tipo === "Cantidad") {
                    if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                      respuesta = 0;
                    } else {
                      respuesta = pregunta.respuesta;
                    }
                  } else if (pregunta.tipo === "Precio") {
                    if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                      respuesta = {
                        dolares: 0,
                        bolivares: 0,
                      };
                    } else {
                      if (
                        pregunta.respuesta?.bolivares == undefined ||
                        pregunta.respuesta?.bolivares == null ||
                        pregunta.respuesta?.dolares == null ||
                        pregunta.respuesta?.dolares == undefined
                      ) {
                        respuesta = {
                          bolivares:
                            form[0].moneda == "BS"
                              ? pregunta.respuesta
                              : parseFloat(
                                  (pregunta.respuesta * form[0].tasa).toFixed(2)
                                ),
                          dolares:
                            form[0].moneda == "$"
                              ? pregunta.respuesta
                              : parseFloat(
                                  (pregunta.respuesta / form[0].tasa).toFixed(2)
                                ),
                        };
                      } else {
                        respuesta = {
                          bolivares:
                            isNaN(parseFloat(pregunta?.respuesta?.bolivares)) ==
                            true
                              ? 0
                              : pregunta?.respuesta.bolivares,
                          dolares:
                            isNaN(parseFloat(pregunta?.respuesta?.dolares)) ==
                            true
                              ? 0
                              : pregunta?.respuesta.dolares,
                        };
                      }
                    }
                  } else if (pregunta.tipo === "Simple") {
                    respuesta =
                      pregunta.respuesta === true || pregunta.respuesta === "Si"
                        ? "Si"
                        : "No";
                  } else if (pregunta.tipo === "Tamaño") {
                    if (isNaN(parseFloat(pregunta?.respuesta)) == true) {
                      respuesta = 0;
                    } else {
                      respuesta = pregunta.respuesta;
                    }
                  } else if (pregunta.tipo === "Fecha") {
                    if (!Moment(pregunta?.respuesta).isValid()) {
                      respuesta = "";
                    } else {
                      respuesta = pregunta.respuesta;
                    }
                  } else if (pregunta.tipo === "Texto") {
                    if (pregunta.tipo != undefined) {
                      respuesta = pregunta.respuesta;
                    } else {
                      respuesta = "";
                    }
                  }

                  finalQuestionsMainCategory[
                    niveles.categoria + "_" + hijos.subcategoria
                  ] = {
                    ...finalQuestionsMainCategory[
                      niveles.categoria + "_" + hijos.subcategoria
                    ],
                    [pregunta.pregunta]: respuesta,
                  };
                } else {
                  finalQuestionsMainCategory[
                    niveles.categoria + "_" + hijos.subcategoria
                  ] = {
                    ...finalQuestionsMainCategory[
                      niveles.categoria + "_" + hijos.subcategoria
                    ],
                    [pregunta.pregunta]:
                      pregunta.tipo === "Precio" || pregunta.tipo === "Cantidad"
                        ? setDefaultValueInput(pregunta.tipo)
                        : "",
                  };
                }
              });
            }

            hijos.categoria = niveles.categoria;
            // ***********************************
            niveles.items.push(hijos.subcategoria);
          });

          // console.log(niveles)
          finalArray.push(niveles);
        } else {
          if (localStorage.getItem("Actualizar") != undefined) {
            console.log("Aqui");
            sethora_entrada(niveles?.preguntas[0].respuesta);
            sethora_salida(niveles?.preguntas[1].respuesta);
            setobservaciones(niveles?.preguntas[2].respuesta);
          }
        }
      });

      console.log("FInal ", finalArray);
      console.log("Final QUESTIONS category ", finalQuestionsMainCategory);
      console.log("Final Products ", finalQuestions);
      console.log("FINAL MARCAS ", finalQuestionsMarca);
      setFinalProducts(finalQuestions);
      setFinalQuestionsCategory(finalQuestionsMainCategory);
      setFinalMarcas(finalQuestionsMarca);

      if (finalArray.length > 0) {
        setState({ currentLvl: finalArray[0], selectedItemKeys: [] });
        let newOptions = {
          ...dataSourceOptions,
          store: new ArrayStore({ data: finalArray, key: "Id" }),
        };
        setDataSourceOptions(newOptions);
        console.log("Options ", newOptions);
      }
    } else {
      console.log("Estoy en else ");
      setShowPopup(true);
    }
  };

  const setDefaultValueInput = (tipo, calculado) => {
    if (tipo === "Cantidad") {
      return 0;
    } else if (tipo === "Precio") {
      return {
        dolares: 0,
        bolivares: 0,
      };
    } else if (tipo == "Calculado" || tipo == "Emisión-Vencimiento") {
      return calculado;
    }
    return "";
  };

  let handleListSelectionChange = async (e) => {
    console.log("CATEGORIA SELECCIONADA???  ", e.addedItems);
    if (e.addedItems.length > 0) {
      setSelectedItemClassLeft({
        classDisable: "item-disable",
        selectedItem:
          e.addedItems[0].subcategoria + "_" + e.addedItems[0].Id_parent,
      });

      let finalCategory = [];
      let i = 0;
      console.log("Current Category ", e.addedItems[0].marcas);
      await e.addedItems[0].marcas.map(async (x, iterator) => {
        let marca = {
          ID: iterator.toString(),
          categoryId: -1,
          nombre: x.nombre,
          marca: e.addedItems[0].subcategoria,
          producto: x.nombre,
          preguntas: x.preguntas ? x.preguntas : false,
          titleMarca: true,
          expanded: false,
        };

        finalCategory.push(marca);

        if (x.preguntas) {
          let preguntas_marca = {
            ID: iterator + "_" + 0,
            categoryId: iterator.toString(),
            nombre: x.nombre,
            marca: e.addedItems[0].subcategoria,
            producto: x.nombre,
            preguntas: x.preguntas,
            titleMarcaItem: true,
          };
          finalCategory.push(preguntas_marca);
        }

        await x.productos.map((producto, j) => {
          let category = {
            ID: iterator + "_" + (j + 1),
            categoryId: iterator.toString(),
            nombre: x.nombre,
            marca: e.addedItems[0].subcategoria,
            producto: producto.nombre,
            preguntas: producto.preguntas,
          };

          finalCategory.push(category);
        });
      });

      console.log("FInal Category ", finalCategory);

      setLengthCategory({ length: finalCategory.length, defaultValue: [] });
      setSelectedQuestions([]);

      setCurrentCategory(finalCategory);

      setSelectedQuestionsMarca([]);
      setDefaultMarca([]);
      setDefaultCategory(e.addedItems[0].subcategoria);
      setSelectedMainCategory({
        categoria: e.addedItems[0].categoria,
        subcategoria: e.addedItems[0].subcategoria,
      });
      console.log(e.addedItems[0].preguntas);
      if (
        e.addedItems[0].preguntas != undefined &&
        e.addedItems[0].preguntas != null
      ) {
        setSelectedQuestionsParent(e.addedItems[0].preguntas);
      } else {
        setSelectedQuestionsParent([]);
      }
    }
  };

  const renderListCategory = (item) => {
    let key = item.subcategoria + "_" + item.Id_parent;
    return (
      <div
        key={key}
        className={`item-category left-form ${
          key !== selectedItemClassLeft.selectedItem
            ? selectedItemClassLeft.classDisable
            : "class_enable"
        }`}
      >
        <div className="item-name">
          <div className="name">{item.subcategoria}</div>
        </div>
        <div className="price-container">
          <div className="mr-2">{item.marcas.length}</div>
          <div>Categorias</div>
        </div>
      </div>
    );
  };

  const renderListItem = (item) => {
    console.log("🚀 ~ renderListItem ~ item:", item);
    return (
      <div>
        <List
          selectionMode="single"
          dataSource={item.hijos}
          grouped={false}
          collapsibleGroups={false}
          searchEnabled={false}
          selectedItemKeys={selectedItems}
          onSelectionChanged={handleListSelectionChange}
          itemRender={renderListCategory}
          elementAttr={listAttrs}
        />
      </div>
    );
  };

  const setFinalData = (e) => {
    let positionDefaultProduct =
      lengthCategory.defaultValue.producto +
      "_" +
      lengthCategory.defaultValue.nombre;
    let calculadoid = e.element.id.split("/=");
    let calculado_vencimiento = e.element.id.split("=/");
    let tipo_precio = e.element.id.split("cost/");

    if (calculadoid.length > 1) {
      finalProducts[positionDefaultProduct][calculadoid[0]][calculadoid[1]] =
        e.value;
      let caras = finalProducts[positionDefaultProduct][calculadoid[0]].Caras;
      let profundidad =
        finalProducts[positionDefaultProduct][calculadoid[0]].Profundidad;
      finalProducts[positionDefaultProduct][calculadoid[0]].Total =
        caras * profundidad;
    } else if (calculado_vencimiento.length > 1) {
      // Productos Retirados hidroponia
      finalProducts[positionDefaultProduct][calculado_vencimiento[0]][
        calculado_vencimiento[1]
      ][calculado_vencimiento[2]] = e.value;
    } else if (tipo_precio.length > 1) {
      let moneda = ValueMoneda == "$" ? "dolares" : "bolivares";
      let monedaContraria = ValueMoneda == "$" ? "bolivares" : "dolares";
      finalProducts[positionDefaultProduct][tipo_precio[1]][moneda] = e.value;

      let calculatedValue =
        ValueMoneda == "$"
          ? parseFloat((e.value * tasa).toFixed(2))
          : parseFloat((e.value / tasa).toFixed(2));
      finalProducts[positionDefaultProduct][tipo_precio[1]][monedaContraria] =
        calculatedValue;
    } else {
      finalProducts[positionDefaultProduct][e.element.id] = e.value;
    }

    console.log("FINAL PRODUCTS ", finalProducts);
    setFinalProducts(finalProducts);
  };

  const setDefaultDataExpiration = (question, i, action) => {
    let positionDefaultProduct =
      lengthCategory.defaultValue.producto +
      "_" +
      lengthCategory.defaultValue.nombre;

    if (action == "delete") {
      finalProducts[positionDefaultProduct][question].splice(i, 1);
    } else if (action == "add") {
      finalProducts[positionDefaultProduct][question].push({
        cantidad: 0,
        motivo: null,
        lote: "",
        fecha_Emision: "",
        fecha_Vencimiento: "",
      });
    }
    setFinalProducts(finalProducts);
  };

  const setFinalCategory = (e) => {
    // console.log("Category ", defaultCategory);
    // console.log("evento ", e);
    finalQuestionsCategory[
      selectedMainCategory?.categoria + "_" + defaultCategory
    ][e.element.id] = e.value;
    setFinalQuestionsCategory(finalQuestionsCategory);
  };

  const setFinalMarca = (e) => {
    // console.log("Marca ", defaultMarca);
    // console.log("evento ", e);
    let tipo_precio = e.element.id.split("cost/");

    if (tipo_precio.length > 1) {
      let moneda = ValueMoneda == "$" ? "dolares" : "bolivares";
      let monedaContraria = ValueMoneda == "$" ? "bolivares" : "dolares";
      finalMarcas[
        selectedMainCategory?.categoria +
          "_" +
          defaultMarca.marca +
          "_" +
          defaultMarca.nombre
      ][tipo_precio[1]][moneda] = e.value;

      let calculatedValue =
        ValueMoneda == "$"
          ? parseFloat((e.value * tasa).toFixed(2))
          : parseFloat((e.value / tasa).toFixed(2));
      finalMarcas[
        selectedMainCategory?.categoria +
          "_" +
          defaultMarca.marca +
          "_" +
          defaultMarca.nombre
      ][tipo_precio[1]][monedaContraria] = calculatedValue;
    } else {
      finalMarcas[
        selectedMainCategory?.categoria +
          "_" +
          defaultMarca.marca +
          "_" +
          defaultMarca.nombre
      ][e.element.id] = e.value;
    }

    console.log("Final ", finalMarcas);
    setFinalMarcas(finalMarcas);
  };

  const goBack = () => {
    history(-1);
  };

  const uploadImages = async (files, id) => {
    let uploadedImages = [];
    let date = Moment().format("YYYY-M");

    let cont = 0;
    console.log(files);
    console.log(id);

    files.forEach((file, i) => {
      setActualUpload(i);

      const byteCharacters = atob(file.source.split(",")[1]);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: "application/octet-stream" });
      let fileNew = new File([blob], "img_" + i);

      let name = "img_" + i;
      const storageRef = ref(
        storage,
        `/files/formularios/${date}/${id}/${name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, fileNew);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(percent);
          // update progress
          setPercent(percent);
        },
        (err) => {
          console.log(err);
          if (files.length === cont + 1) {
            toastError("Ha ocurrido un error en el guardado de imágenes.");
            localStorage.setItem(
              "SelectedForm",
              JSON.stringify({ completado: true })
            );
            history("/formularios");
          }
        },
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);

            uploadedImages.push({
              foto: url,
              descripcion: file.description,
              tag: file.tag,
            });

            console.log("index afuera ", cont);
            if (files.length === cont + 1) {
              console.log("index adentro", cont);
              console.log("Terminé ", uploadedImages);
              setShowPopupImages(false);

              FormService.updateForm(id, uploadedImages)
                .then((result) => {
                  console.log("RESULT ", result);

                  localStorage.setItem(
                    "SelectedForm",
                    JSON.stringify({ completado: true })
                  );
                  history("/formularios");
                })
                .catch((err) => {
                  console.log("Err ", err);

                  toastError(
                    "Ha ocurrido un error en el guardado de imágenes."
                  );
                  // localStorage.setItem('SelectedForm', JSON.stringify({completado: true}))
                  // history('/formularios');
                });
            }
            cont++;
          });
        }
      );
    });
  };

  const toastError = (message) => {
    console.log("MENSAJE ", message);
    setToastConfig({
      ...toastConfig,
      type: "error",
      message: message,
      isVisible: true,
    });
    console.log("TOAST ", toastConfig);
  };

  const saveData = async (save) => {
    console.log("Guardando", finalProducts);
    console.log("Guardando Category ", finalQuestionsCategory);
    // localStorage.removeItem("dataImages")
    let formulario = dataForm.preguntas.slice();
    console.log(localStorage.getItem("Actualizar"));

    console.log("FOrmData ", dataForm);
    console.log(finalImages);

    fire
      .collection("establecimientos")
      .doc(establecimientos.selectedEstab.key)
      .get()
      .then(async (dataEst) => {
        console.log("🚀 ~ fire.collection ~ dataEst:", dataEst.data());

        if (formSelected == "ASISTENCIA") {
          if (!save) {
            setShowAlertPopup(true);
          } else {
            console.log("Aqui");
            let userData = JSON.parse(localStorage.getItem("userData"));
            let establecimiento = dataEst.data(); //establecimientos.selectedEstab;
            if (localStorage.getItem("Actualizar") == undefined) {
              let finalForm = {
                nombre: dataForm.nombre,
                razon_social: establecimiento.razon_social,
                canal: establecimiento.nombre_canal,
                ciudad: establecimiento.nombre_ciudad,
                cod_est: establecimiento.ID,
                region: establecimiento.nombre_region,
                establecimiento: establecimiento.nombre_establecimiento,
                key_est: establecimiento.key,
                version: dataForm.version,
                cliente: dataForm.cliente,
                estatus: "Completo",
                fecha_Creado: Moment().format("YYYY-MM-DD HH:mm:ss"),
                fecha_Formulario: Moment().format("YYYY-MM-DD HH:mm:ss"),
                fecha_Reporte: Moment(formDate).format("YYYY-MM-DD"),
                fecha_Sincronizado: Moment().format("YYYY-MM-DD HH:mm:ss"),
                preguntas: [
                  {
                    preguntas: [
                      {
                        pregunta: "HORA DE ENTRADA",
                        respuesta:
                          hora_entrada.slice(0, 2) +
                          ":" +
                          hora_entrada.slice(2),
                        tipo: "Hora",
                      },
                      {
                        pregunta: "HORA DE SALIDA",
                        respuesta:
                          hora_salida.slice(0, 2) + ":" + hora_salida.slice(2),
                        tipo: "Hora",
                      },
                      {
                        pregunta: "OBSERVACIONES",
                        respuesta: observaciones,
                        tipo: "Texto",
                      },
                    ],
                  },
                ],
                promotor: userData.nombre + " " + userData.apellido,
                uid_promotor: userData.uid,
                fotos: [],
                plataforma: "Web",
                moneda: ValueMoneda,
                tasa: tasa,
                actualizadoEn: "Web",
              };

              console.log("Final FOrm ", finalForm);
              console.log("Images ", finalImages);

              FormService.addFrom(finalForm)
                .then((result) => {
                  console.log("Guardé Formularop ", result);

                  finishUploadForm(result);
                })
                .catch((err) => {
                  toastError(
                    "Ha ocurrido un error durante el guardado del formulario"
                  );
                });
            } else {
              const form = JSON.parse(localStorage.getItem("SelectedForm"));
              console.log(form);
              let finalForm = {
                nombre: dataForm.nombre,
                razon_social: establecimiento.razon_social,
                canal: establecimiento.nombre_canal,
                ciudad: establecimiento.nombre_ciudad,
                cod_est: establecimiento.ID,
                region: establecimiento.nombre_region,
                establecimiento: establecimiento.nombre_establecimiento,
                version: dataForm.version,
                cliente: dataForm.cliente,
                estatus: "Completo",

                fecha_Creado: form[0].fecha_Creado,
                fecha_Formulario: form[0].fecha_Formulario,
                fecha_Reporte: form[0].fecha_Reporte,
                fecha_Sincronizado: form[0].fecha_Sincronizado,
                promotor: form[0].promotor,
                uid_promotor: form[0].uid_promotor,
                preguntas: [
                  {
                    preguntas: [
                      {
                        pregunta: "HORA DE ENTRADA",
                        respuesta:
                          hora_entrada.slice(0, 2) +
                          ":" +
                          hora_entrada.slice(2),
                        tipo: "Hora",
                      },
                      {
                        pregunta: "HORA DE SALIDA",
                        respuesta:
                          hora_salida.slice(0, 2) + ":" + hora_salida.slice(2),
                        tipo: "Hora",
                      },
                      {
                        pregunta: "OBSERVACIONES",
                        respuesta: observaciones,
                        tipo: "Texto",
                      },
                    ],
                  },
                ],
                key: dataForm.key,
                fotos: [],
                plataforma: dataForm.plataforma,
                actualizadoEn: "Web",

                moneda: ValueMoneda,
                tasa: tasa,
              };

              console.log("Final FOrm UPDATE ", finalForm);
              console.log("Images ", finalImages);

              FormService.updateDataForm(finalForm)
                .then((result) => {
                  finishUploadForm(result);
                })
                .catch((err) => {
                  toastError(
                    "Ha ocurrido un error durante el guardado del formulario"
                  );
                });
            }
          }
        } else {
          if (ValueMoneda == undefined || ValueMoneda == "") {
            toastError("Debe seleccionar el tipo de moneda");
            return false;
          }

          if (tasa == undefined || tasa == 0 || tasa == "") {
            toastError("Debe agregar la tasa del dia");
            return false;
          }

          if (!save) {
            setShowAlertPopup(true);
          } else {
            let finalRespuestas = [];
            console.log(establecimientos);
            await formulario.forEach(async (categoria) => {
              let newCategoria = [];
              await categoria.hijos.forEach(async (subcategoria) => {
                let newSubcategoria = [];
                await subcategoria.marcas.forEach(async (marca) => {
                  let newProductos = [];
                  await marca.productos.forEach(async (producto) => {
                    let newPregunta = [];
                    await producto.preguntas.forEach((pregunta) => {
                      if (finalProducts[producto.nombre + "_" + marca.nombre]) {
                        pregunta.respuesta =
                          finalProducts[producto.nombre + "_" + marca.nombre][
                            pregunta.pregunta
                          ];
                      }
                      newPregunta.push(pregunta);
                    });

                    producto.preguntas = newPregunta;
                    newProductos.push(producto);
                  });

                  if (marca.preguntas) {
                    let newPreguntasMarca = [];
                    await marca.preguntas.forEach(async (pregunta) => {
                      if (
                        finalMarcas[
                          categoria.categoria +
                            "_" +
                            subcategoria.subcategoria +
                            "_" +
                            marca.nombre
                        ][pregunta.pregunta] !== undefined
                      ) {
                        pregunta.respuesta =
                          finalMarcas[
                            categoria.categoria +
                              "_" +
                              subcategoria.subcategoria +
                              "_" +
                              marca.nombre
                          ][pregunta.pregunta];
                      }
                      newPreguntasMarca.push(pregunta);
                    });
                    marca.preguntas = newPreguntasMarca;
                  }

                  marca.productos = newProductos;
                  newSubcategoria.push(marca);
                });

                if (subcategoria.preguntas) {
                  let newPreguntasCategory = [];
                  await subcategoria.preguntas.forEach(async (pregunta) => {
                    if (
                      finalQuestionsCategory[
                        subcategoria.categoria + "_" + subcategoria.subcategoria
                      ][pregunta.pregunta] !== undefined
                    ) {
                      pregunta.respuesta =
                        finalQuestionsCategory[
                          subcategoria.categoria +
                            "_" +
                            subcategoria.subcategoria
                        ][pregunta.pregunta];
                    }
                    newPreguntasCategory.push(pregunta);
                  });
                  subcategoria.preguntas = newPreguntasCategory;
                }

                subcategoria.marcas = newSubcategoria;
                newCategoria.push(subcategoria);
              });

              let obj = {
                categoria: categoria.categoria,
                hijos: newCategoria,
              };

              finalRespuestas.push(obj);
            });

            console.log("Final Respuesta ", finalRespuestas);

            if (finalRespuestas.length > 0) {
              let userData = JSON.parse(localStorage.getItem("userData"));
              let establecimiento = dataEst.data();
              console.log(
                "🚀 ~ fire.collection ~ establecimiento:",
                establecimiento
              );
              if (userData) {
                if (localStorage.getItem("Actualizar") == undefined) {
                  let finalForm = {
                    nombre: dataForm.nombre,
                    razon_social: establecimiento.razon_social,
                    canal: establecimiento.nombre_canal,
                    ciudad: establecimiento.nombre_ciudad,
                    cod_est: establecimiento.ID,
                    region: establecimiento.nombre_region,
                    establecimiento: establecimiento.nombre_establecimiento,
                    key_est: establecimiento.key,
                    version: dataForm.version,
                    cliente: dataForm.cliente,
                    estatus: "Completo",
                    fecha_Creado: Moment().format("YYYY-MM-DD HH:mm:ss"),
                    fecha_Formulario: Moment().format("YYYY-MM-DD HH:mm:ss"),
                    fecha_Reporte: Moment(formDate).format("YYYY-MM-DD"),
                    fecha_Sincronizado: Moment().format("YYYY-MM-DD HH:mm:ss"),
                    preguntas: finalRespuestas,
                    promotor: userData.nombre + " " + userData.apellido,
                    uid_promotor: userData.uid,
                    fotos: [],
                    plataforma: "Web",
                    moneda: ValueMoneda,
                    tasa: tasa,
                    actualizadoEn: "Web",
                  };

                  console.log("Final FOrm ", finalForm);
                  console.log("Images ", finalImages);

                  FormService.addFrom(finalForm)
                    .then((result) => {
                      console.log("Guardé Formularop ", result);

                      finishUploadForm(result);
                    })
                    .catch((err) => {
                      toastError(
                        "Ha ocurrido un error durante el guardado del formulario"
                      );
                    });
                } else {
                  const form = JSON.parse(localStorage.getItem("SelectedForm"));
                  console.log(form);
                  let finalForm = {
                    nombre: dataForm.nombre,
                    razon_social: establecimiento.razon_social,
                    canal: establecimiento.nombre_canal,
                    ciudad: establecimiento.nombre_ciudad,
                    cod_est: establecimiento.ID,
                    region: establecimiento.nombre_region,
                    establecimiento: establecimiento.nombre_establecimiento,
                    key_est: establecimiento.key,
                    version: dataForm.version,
                    cliente: dataForm.cliente,
                    estatus: "Completo",

                    fecha_Creado: form[0].fecha_Creado,
                    fecha_Formulario: form[0].fecha_Formulario,
                    fecha_Reporte: form[0].fecha_Reporte,
                    fecha_Sincronizado: form[0].fecha_Sincronizado,
                    promotor: form[0].promotor,
                    uid_promotor: form[0].uid_promotor,

                    preguntas: finalRespuestas,
                    key: dataForm.key,
                    fotos: [],
                    plataforma: dataForm.plataforma,
                    actualizadoEn: "Web",
                    fechaActualizado: Moment().format("YYYY-MM-DD HH:mm:ss"),
                    actualizadoPor:
                      userData.nombre +
                      " " +
                      userData.apellido +
                      " - " +
                      userData.email,
                    actualizadoId: userData.uid,
                    moneda: ValueMoneda,
                    tasa: tasa,
                  };

                  console.log("Final FOrm UPDATE ", finalForm);
                  console.log("Images ", finalImages);

                  FormService.updateDataForm(finalForm)
                    .then((result) => {
                      if (cambioEstablecimiento) {
                        updateChangeEstab(
                          form[0],
                          form[0].key_est,
                          establecimiento
                        );
                      } else {
                        finishUploadForm(result);
                      }
                    })
                    .catch((err) => {
                      toastError(
                        "Ha ocurrido un error durante el guardado del formulario"
                      );
                    });
                }
              } else {
                toastError("Ha ocurrido un error con el usuario.");
              }
            }
          }
        }
      });
  };

  const finishUploadForm = (result, save) => {
    localStorage.removeItem("Actualizar");
    if (result.status === 200 || save == true) {
      setShowPopupImages(true);
      if (finalImages.length > 0) {
        uploadImages(finalImages, dataForm.key);
      } else {
        localStorage.setItem(
          "SelectedForm",
          JSON.stringify({ completado: true })
        );
        // history('/formularios');
        history(-1);
      }
    } else {
      toastError("Error en guardado de formulario");
    }
  };

  const updateChangeEstab = (form, old_estab, establecimiento) => {
    let foundForm = {
      fecha_creado: form.fecha_Creado,
      uid_promotor: form.uid_promotor,
      fecha_completado: form.fecha_Completado,
      key_est: old_estab,
      establecimiento: establecimiento,
    };

    FormService.foundForms(foundForm)
      .then((result) => {
        if (result.data.length > 0) {
          toastError(
            "A algunos formularios no se le ha actualizado el establecimiento"
          );
        }

        finishUploadForm(result);
      })
      .catch((err) => {
        console.log("🚀 ~ updateChangeEstab ~ err:", err);
        toastError(
          "Ha ocurrido un error durante la actualización de establecimiento de los formularios"
        );

        finishUploadForm(null, true);
      });
  };

  const changeDate = (e) => {
    console.log(e);
    setDisable(false);
    setFormDate(e.value);
  };

  const saveButtonPhotoOptions = {
    text: "Guardar",
    onClick: () => {
      setShowPhotoPopup(false);
    },
  };
  const cancelButtonPhotoOptions = {
    text: "Cancelar",
    icon: "close",
    onClick: () => {
      setShowPhotoPopup(false);
    },
  };

  const saveButtonOptions = {
    icon: "check",
    text: "Guardar",
    onClick: () => {
      saveData(true);
    },
  };

  const cancelButtonOptions = {
    icon: "close",
    text: "Cancelar",
    onClick: () => {
      setShowAlertPopup(false);
    },
  };

  const calculateSymbolChange = async () => {
    let moneda = ValueMoneda == "$" ? "dolares" : "bolivares";
    let monedaContraria = ValueMoneda == "$" ? "bolivares" : "dolares";

    const finalProductUpdated = finalProducts;

    if (tasa != null && tasa != "") {
      let formulario = dataForm.preguntas.slice();

      await formulario.forEach(async (categoria) => {
        await categoria.hijos.forEach(async (subcategoria) => {
          await subcategoria.marcas.forEach(async (marca) => {
            await marca.productos.forEach(async (producto) => {
              await producto.preguntas.forEach((pregunta) => {
                if (pregunta.tipo == "Precio") {
                  let valueInput =
                    finalProductUpdated[producto.nombre + "_" + marca.nombre][
                      pregunta.pregunta
                    ];

                  if (
                    valueInput[moneda] !== 0 ||
                    valueInput[monedaContraria] !== 0
                  ) {
                    let calculatedValue = parseFloat(
                      (valueInput["dolares"] * tempTasa).toFixed(2)
                    );
                    valueInput["bolivares"] = calculatedValue;

                    console.log("HICE UN CAMBIO ", valueInput);

                    finalProductUpdated[producto.nombre + "_" + marca.nombre][
                      pregunta.pregunta
                    ] = valueInput;
                  }
                }
              });
            });
          });
        });
      });
      console.log("CAMBIADO ", finalProductUpdated);
      setFinalProducts(finalProductUpdated);
    } else {
      toastError("Por favor ingrese una tasa válida");
    }
    setLoadingForm(false);
  };

  const editTasa = async (updateOrDelete) => {
    console.log("TASA ", tasa, " TEMP TASA: ", tempTasa);
    if (updateOrDelete === "Delete") {
      setTempTasa(null);
    } else {
      setLoadingForm(true);
      settasa(tempTasa);
      await calculateSymbolChange();
    }

    setEditingTasa(false);
  };

  const reloadForm = function () {
    const form = JSON.parse(localStorage.getItem("SelectedForm"));
    buildForm(form);
  };

  return (
    <React.Fragment>
      <div className="containerForm">
        <div className="d-flex">
          <div className="header-grid-title">
            <h2 className="content-block header-form">
              {dataForm.nombre} v.{dataForm.version}
            </h2>
            {localStorage.getItem("Actualizar") != undefined && (
              <h2
                className="content-block header-form-small"
                style={{ marginLeft: "7px" }}
              >
                {dataForm.establecimiento}{" "}
              </h2>
            )}
          </div>
          {localStorage.getItem("Actualizar") == undefined && (
            <div className="header-grid-center">
              <div>
                <small>Fecha de Carga</small>
                <DateBox
                  className="mb-4 mr-2"
                  pickerType="calendar"
                  onValueChanged={changeDate}
                  max={today}
                  type="date"
                />
              </div>
            </div>
          )}
          <div className="header-grid-center">
            {
              <div>
                <small>Moneda</small>
                <SelectBox
                  className="mb-4 mr-2"
                  dataSource={Monedas}
                  value={ValueMoneda}
                  searchEnabled={false}
                  placeholder="Moneda"
                  onSelectionChanged={(e) => {
                    setValueMoneda(e.selectedItem);
                    // calculateSymbolChange(e.selectedItem);
                  }}
                />
              </div>
            }
          </div>
          <div className="header-grid-center">
            {
              <div>
                <small>Tasa</small>
                <div className="d-flex">
                  <div className="bs-tasa">
                    <p style={{ margin: 20 }}>Bs</p>
                  </div>
                  <NumberBox
                    placeholder="0.00"
                    className="box-tasa"
                    onValueChanged={(e) => setTempTasa(e.value)}
                    onFocusIn={(e) => {
                      setEditingTasa(true);
                    }}
                    // onFocusOut={()=> {setEditingTasa(false); console.log("FOCUS OUT ")}}
                    value={tasa}
                  />
                  {editingTasa && (
                    <div
                      className="d-flex"
                      style={{
                        padding: "8px",
                        alignSelf: "center",
                        cursor: "pointer",
                      }}
                    >
                      <CheckLg
                        onClick={() => editTasa("Update")}
                        style={{
                          fontSize: "18px",
                          color: "green",
                          marginRight: "4px",
                        }}
                      />
                      <XLg
                        onClick={() => editTasa("Delete")}
                        style={{ fontSize: "16px", color: "red" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            }
          </div>
          <div className="header-grid-right mt-4" style={{ width: "60%" }}>
            <Button className="btn btn-light mr-2" onClick={goBack}>
              Atrás
            </Button>
            {
              // localStorage.getItem("Actualizar") == undefined && (
              <Button
                className="btn btn-primary mr-2"
                onClick={() => setShowPhotoPopup(true)}
              >
                Cargar Fotos
              </Button>
              // )
            }
            {localStorage.getItem("Actualizar") == undefined ? (
              <>
                {formSelected == "ASISTENCIA" ? (
                  <span>
                    <Button
                      className="btn btn-primary"
                      onClick={() => saveData(false)}
                      disabled={disableSave}
                    >
                      Guardar
                    </Button>
                  </span>
                ) : (
                  <span>
                    <Button
                      className="btn btn-primary"
                      onClick={() => saveData(false)}
                      disabled={
                        tasa == 0 ||
                        tasa == "" ||
                        tasa == undefined ||
                        disableSave
                      }
                    >
                      Guardar
                    </Button>
                  </span>
                )}
              </>
            ) : (
              <>
                {formSelected == "ASISTENCIA" ? (
                  <span>
                    <Button
                      className="btn btn-primary"
                      onClick={() => saveData(false)}
                    >
                      Actualizar
                    </Button>
                  </span>
                ) : (
                  <span>
                    <Button
                      className="btn btn-primary"
                      onClick={() => saveData(false)}
                      disabled={tasa == 0 || tasa == "" || tasa == undefined}
                    >
                      Actualizar
                    </Button>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {formSelected == "ASISTENCIA" ? (
          <div id="container">
            <Card className="h-80">
              <div
                className="dx-fieldset-header"
                style={{
                  fontSize: 13,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                Hora de entrada
              </div>
              <div
                className="dx-field"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <TextBox
                  width="50%"
                  id="hora_entrada"
                  defaultValue={hora_entrada} // Si quieres establecer un valor predeterminado, puedes usar esta prop
                  value={hora_entrada}
                  mask="00:00"
                  onValueChanged={(e) => {
                    console.log(e);
                    sethora_entrada(e.value);
                  }}
                />
              </div>
              <div
                className="dx-fieldset-header"
                style={{
                  fontSize: 13,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                Hora de salida
              </div>
              <div
                className="dx-field"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <TextBox
                  width="50%"
                  id="hora_salida"
                  mask="00:00"
                  defaultValue={hora_salida} // Si quieres establecer un valor predeterminado, puedes usar esta prop
                  value={hora_salida}
                  onValueChanged={(e) => {
                    console.log(e);
                    sethora_salida(e.value);
                  }}
                />
              </div>

              <div
                className="dx-fieldset-header"
                style={{
                  fontSize: 13,
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                Observaciones
              </div>
              <div
                className="dx-field"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <TextArea
                  value={observaciones}
                  height={200}
                  width={800}
                  onValueChanged={(e) => setobservaciones(e.value)}
                  placeholder="Observaciones"
                />
              </div>
            </Card>
          </div>
        ) : (
          <>
            <LeftListForm
              itemRender={renderListItem}
              dataSource={dataSourceOptions}
            />

            <LoadPanel visible={loadingForm} />

            {lengthCategory.length > 0 && (
              <RightListForm
                selectedQuestionsParent={selectedQuestionsParent}
                finalQuestionsCategory={finalQuestionsCategory}
                defaultCategory={defaultCategory}
                setFinalCategory={setFinalCategory}
                currentData={currentCategory}
                setModifyCurrentData={setCurrentCategory}
                itemRender={renderListItem}
                setLengthCategory={setLengthCategory}
                selectedQuestionsMarca={selectedQuestionsMarca}
                setSelectedQuestionsMarca={setSelectedQuestionsMarca}
                setDefaultMarca={setDefaultMarca}
                finalMarcas={finalMarcas}
                setFinalMarca={setFinalMarca}
                defaultMarca={defaultMarca}
                defaultValue={lengthCategory.defaultValue}
                setSelectedQuestions={setSelectedQuestions}
                selectedQuestions={selectedQuestions}
                setFinalData={setFinalData}
                finalProducts={finalProducts}
                selectedMainCategory={selectedMainCategory}
                setDefaultDataExpiration={setDefaultDataExpiration}
                defaultMoney={ValueMoneda}
              />
            )}
          </>
        )}
      </div>

      <Popup
        width={"50%"}
        height={"50%"}
        visible={showPopup}
        onHiding={() => {
          setShowPopup(false);
        }}
        showTitle={true}
        title="Error recuperando el formulario"
        showCloseButton={true}
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>No se ha podido encontrar data de este formulario</h5>
            <p>
              Verifique su conexión a internet o comuníquese con soporte técnico
            </p>
            <Button
              onClick={() => {
                setShowPopup(false);
              }}
              className="btn btn-outline-primary"
            >
              Aceptar
            </Button>
          </div>
        </ScrollView>
      </Popup>

      <Popup
        width={"50%"}
        height={"50%"}
        visible={showPopupTasa}
        onHiding={() => {
          setShowPopupTasa(false);
        }}
        showCloseButton={false}
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center ">
            <ExclamationDiamond className="warning_icon" />
            <h5 className="mb-4">Por favor ingrese la tasa del día</h5>
            <div className="d-flex text-center justify-content-center m-8 mt-4 mb-4">
              <div>
                <small>Tasa</small>
                <div className="d-flex mt-2">
                  <div className="mb-4 bs-tasa">
                    <p style={{ margin: 20 }}>Bs</p>
                  </div>
                  <NumberBox
                    placeholder="0.00"
                    className="mb-4 box-tasa"
                    onValueChanged={(e) => settasa(e.value)}
                    value={tasa}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                if (
                  tasa == undefined ||
                  tasa == 0 ||
                  tasa == "" ||
                  tasa == null
                ) {
                  toastError("Debe agregar la tasa del dia");
                  return false;
                }

                setShowPopupTasa(false);
              }}
              className="btn btn-outline-primary"
              disabled={tasa == null ? true : false}
            >
              Aceptar
            </Button>
          </div>
        </ScrollView>
      </Popup>

      <Popup
        width={"50%"}
        height={"50%"}
        visible={showPopupImages}
        onHiding={() => {
          setShowPopupImages(false);
        }}
        showTitle={true}
        title="Subiendo Imágenes..."
        showCloseButton={true}
      >
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <h5>
              Imagen {actualUpload} de {finalImages.length}
            </h5>
            <p>{percent} % avance</p>
            {/* <Button onClick={() => {setShowPopupImages(false)}} className="btn btn-outline-primary">Aceptar</Button> */}
          </div>
        </ScrollView>
      </Popup>

      <Popup
        width={"50%"}
        height={"75%"}
        visible={showAlertPopup}
        onHiding={() => {
          setShowAlertPopup(false);
        }}
        showTitle={true}
        title="Guardando Formulario..."
        showCloseButton={false}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={cancelButtonOptions}
        />

        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          options={saveButtonOptions}
        />
        <ScrollView width="100%" height="100%">
          <div className="form-container text-center">
            <ExclamationDiamond className="warning_icon" />
            <h5>¿Seguro que desea guardar el formulario?</h5>
            <div className="saving-form d-flex w-100">
              <div>
                <b>Formulario:</b>{" "}
                <p>
                  {dataForm.nombre} v.{dataForm.version}
                </p>
              </div>
              <div>
                <b>Cliente:</b> <p>{dataForm.cliente}</p>
              </div>
              <div>
                <b>Establecimiento:</b>{" "}
                <p>{establecimientos.selectedEstab.nombre_establecimiento}</p>
              </div>
            </div>
            <p>
              <b>Tasa:</b> {tasa} BS{" "}
            </p>
            <p>Cambiar Establecimiento: </p>
            <SelectBox
              dataSource={establecimientos.estabs}
              onValueChanged={(e) => {
                setEstablecimientos({
                  ...establecimientos,
                  selectedEstab: e.value,
                });
                setCambioEstablecimiento(true);
              }}
              defaultValue={establecimientos.selectedEstab}
              searchExpr="nombre_establecimiento"
              displayExpr="nombre_establecimiento"
              placeholder="Buscar Establecimiento..."
              searchEnabled
            />
            <br></br>
            <br></br>
            {/* <p>Estos datos no podrán editarse</p> */}
            <Button
              onClick={() => {
                setShowAlertPopup(false);
              }}
              className="btn btn-outline-secondary mr-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                saveData(true);
              }}
              className="btn btn-outline-success ml-2"
            >
              Aceptar
            </Button>
          </div>
        </ScrollView>
      </Popup>

      <Popup
        fullScreen={true}
        visible={showPhotoPopup}
        onHiding={() => {
          setShowPhotoPopup(false);
        }}
        showTitle={true}
        title="Carga de Fotos..."
        showCloseButton={false}
      >
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          cssClass="save-toolbar-button"
          options={saveButtonPhotoOptions}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="top"
          location="after"
          cssClass="cancel-toolbar-button"
          options={cancelButtonPhotoOptions}
        />
        <ScrollView width="100%" height="100%">
          <div className="text-center">
            <ModalPhoto
              setFinalImages={setFinalImages}
              finalImages={finalImages}
            ></ModalPhoto>
          </div>
        </ScrollView>
      </Popup>
    </React.Fragment>
  );
}

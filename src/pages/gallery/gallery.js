import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import DropDownButton from 'devextreme-react/drop-down-button';
import React, { useEffect, useState, useRef } from "react";
import * as DinamicQueries from '../../api/DinamicsQuery';
import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { DateBox } from 'devextreme-react/date-box';
import LoadPanel from 'devextreme-react/load-panel';
import { Button } from "devextreme-react/button";
import { saveAs } from 'file-saver';
import pptxgen from "pptxgenjs";
import Moment from "moment";
import jsPDF from 'jspdf';
import JSZip, { filter } from 'jszip';


export default function Gallery() {
    const [Establecimito, setEstablecimito] = useState([]);
    const [Formularios, setFormularios] = useState([]);
    const [tags, setTags] = useState([]);
    const [cadenas, setCadenas] = useState([]);
    const [Clientes, setClientes] = useState([]);
    const [Regiones, setRegiones] = useState([]);
    const [usuario, setUsuario] = useState([]);
    const [ImagesSelected, setImagesSelected] = useState([]);
    const [resgistros, setRegistros] = useState([]);
    const [LoadPanelBoolean, setLoadPanelBoolean] = useState(false);
    const [selectedAll, setselectedAll] = useState(false);
    const [fechaInicial, setfechaInicial] = useState(
        new Date(new Date().setDate(new Date().getDate() - 7))
    );

    const [FechaFinal, setFechaFinal] = useState(new Date());
    const now = new Date();

    const InitialStateFilters = {
        cliente: '',
        formulario: '',
        region: '',
        fechaInicial: new Date(new Date().setDate(new Date().getDate() - 7)),
        fechaFinal: new Date(),
        usuarios: '',
        Establecimientos: '',
        cadenas: 'TODAS',
        tag: "TODOS"
    };
    const [filters, setFilters] = useState(InitialStateFilters);
    const [infoSelected, setinfoSelected] = useState(false);

    const [toastConfig, setToastConfig] = React.useState(
        {
            isVisible: false,
            type: "success",
            message: "Busqueda Exitosa",
            displayTime: 2000,
        },
        []
    );

    const options = ["Zip", "PDF"];
    // "Power Point"


    const styleContador = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '17px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#f49f3c',
        padding: '5px',
        borderRadius: '5px',
        height: "30px"
    };


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userData"));
        setClientes(user.cliente);
        setRegiones(user.region);
        setFilters({ ...filters, region: user.region[0] })
        SearchTag()
        searchCadena()
        localStorage.removeItem("photosSelected")
    }, [])

    const SearchTag = () => {
        DinamicQueries.getData('getTag', 'formularios/').then((resp) => {
            console.log(resp.data.data[0].tags)
            resp.data.data[0].tags.unshift("TODOS")
            setTags(resp.data.data[0].tags);
        });
    }

    const searchCadena = () => {
        DinamicQueries.getData('getCadenas', 'EstablecimientosNuevos/').then((resp)=>{
            resp.data.unshift({nombre_cadena: "TODAS"})
            setCadenas(resp.data)
        });
    };

    const searchFormulario = (e) => {
        console.log(e)
        if (e.value != "") {
            setFilters({ ...filters, cliente: e.value });
            DinamicQueries.getDataWithParameters('getFormsWeb', 'formularios/', { cliente: e.value }).then((resp) => {
                setFormularios(resp.data.data);
            });
        }
    };

    const clearFilters = () => {
        setFilters(InitialStateFilters);
        localStorage.removeItem("photosSelected")
        setRegistros([])
    };

    const serachPictures = () => {

        const fechaInicialFormat = Moment(filters.fechaInicial).format(
            "YYYY-MM-DD"
        );
        const fechaFinalFormat = Moment(filters.fechaFinal).format(
            "YYYY-MM-DD"
        );
        setRegistros([])
        localStorage.removeItem("photosSelected")
        DinamicQueries.getDataWithParameters('getImages', 'galeria/', { cliente: filters.cliente, nombre: filters.formulario, region: filters.region, fechaInicio: fechaInicialFormat, fechaFin: fechaFinalFormat, promotor: filters.usuarios, establecimiento: filters.Establecimientos, cadena: filters.cadenas }).then((resp) => {
            let registrosConFotos = [];
            console.log(resp)
            if (resp !== undefined) {
                resp.data.forEach(element => {
                    let fotosTemporales = []
                    if (element.fotos !== undefined) {
                        if (filters.tag !== "TODOS") {
                            element.fotos.forEach(x => {
                                x.selected = false

                                if (x.tag === filters.tag) {
                                    fotosTemporales.push(x)
                                }
                            })
                            element.fotos = fotosTemporales
                            registrosConFotos.push(element)
                        }
                        else {
                            element.fotos.forEach(x => {
                                x.selected = false
                            })
                            registrosConFotos.push(element)
                        }
                    }
                });
            }
            registrosConFotos.sort((a, b) => {
                if (a.establecimiento < b.establecimiento) {
                    return -1;
                }
                if (a.establecimiento > b.establecimiento) {
                    return 1;
                }
                return 0;
            });
            console.log(registrosConFotos)
            setRegistros(registrosConFotos)
            setImagesSelected([])
        });
    };

    const searchUsersAndStablishment = (e) => {
        let Establecimientos = [];
        let Usuarios = [];
        if (e.element.innerText === 'Region') {
            if (e.value != "") {
                setFilters({ ...filters, region: e.value })
                DinamicQueries.getDataWithParameters('getEstablecimientosFilter', "galeria/", { cliente: filters.cliente, region: e.value })
                    .then(establecimientos => {
                        Establecimientos = [{
                            nombre_establecimiento: 'TODOS LOS ESTABLECIMIENTOS',
                        }, ...establecimientos.data]
                        setEstablecimito(Establecimientos)
                    })

                DinamicQueries.getDataWithParameters('getUserClientAndRegion', "usuarios/", { cliente: filters.cliente, region: e.value })
                    .then(usuarios => {
                        Usuarios = [{ nombre: "TODOS LOS USUARIOS", uid: "TODOS LOS USUARIOS" }, ...usuarios.data]
                        setUsuario(Usuarios)
                    })
            }
        } else if (e.element.innerText === 'Cliente') {
            if (e.value != "") {
                setFilters({ ...filters, cliente: e.value });
                DinamicQueries.getDataWithParameters('getEstablecimientosFilter', "galeria/", { cliente: e.value, region: filters.region })
                    .then(establecimientos => {
                        Establecimientos = [{
                            nombre_establecimiento: 'TODOS LOS ESTABLECIMIENTOS',
                        }, ...establecimientos.data]
                        setEstablecimito(Establecimientos)
                    })

                DinamicQueries.getDataWithParameters('getUserClientAndRegion', "usuarios/", { cliente: e.value, region: filters.region })
                    .then(usuarios => {
                        Usuarios = [{ nombre: "TODOS LOS USUARIOS", uid: "TODOS LOS USUARIOS" }, ...usuarios.data]
                        setUsuario(Usuarios)
                    })
            }
        }
    };


    const handleClick = async (url, registro) => {
        console.log(url)
        const data = await fetch(url.foto);
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                console.log(base64data)
                // resolve(base64data);
                var a = document.createElement("a"); //Create <a>
                // a.href = "data:image/png;base64," + ImageBase64; //Image Base64 Goes here
                a.href = base64data //Image Base64 Goes here

                let tipo = ""

                var data = base64data.substring(0, 5);

                switch (data.toUpperCase()) {
                    case "IVBOR": tipo = "png";
                        break
                    case "/9J/4": tipo = "jpeg";
                        break
                    case "JVBER": tipo = "pdf";
                        break
                    case "UESDB":
                        var data2 = base64data.substring(0, 19);
                        switch (data2.toUpperCase()) {
                            case "UEsDBBQABgAIAAAAIQB": tipo = "xlsx";
                                break
                            default:
                                var data3 = base64data.substring(0, 18);

                                switch (data3.toUpperCase()) {
                                    case "UESDBBQABGAIAAAAIQ": tipo = "docx";
                                        break
                                    default: tipo = "zip";
                                }
                        }
                        break
                    case "UMFYI": tipo = "rar";
                        break
                    case "U1PKC": tipo = "txt";
                        break
                    default:
                        console.log("")
                        break
                }
                // registro.establecimiento +"-"+  url.tag + "-" + url.descripcion
                a.download = url.descripcion + "." + tipo //File name Here
                a.click(); //Downloaded file
            }
        });
    }

    const savePhoto = (photo) => {
        console.log(photo)
        if (localStorage.getItem('photosSelected') != undefined) {
            let photos = localStorage.getItem('photosSelected').split(',');
            console.log(photos)
            const found = photos.findIndex(element => element === photo.foto);
            if (found >= 0) { // existe, hay que eliminarlo
                photos.splice(found, 1)
            } else {
                photos.push(photo.foto)
            }

            localStorage.setItem('photosSelected', photos.toString())

        } else {
            let data = [photo.foto]
            localStorage.setItem('photosSelected', data.toString())
        }

        let info = localStorage.getItem('photosSelected').split(',')

        console.log(localStorage.getItem('photosSelected').split(','))
        let data = localStorage.getItem('photosSelected').split(',').filter(x => x !== '')
        setImagesSelected(data)

        if (info[0] === '' && info.length === 1) {
            setinfoSelected(false)
        } else {
            setinfoSelected(true)
        }
    }

    const DescargarSelectedZip = async () => {
        let photos = localStorage.getItem('photosSelected').split(',');
        console.log(photos)

        let images = []
        resgistros.forEach(x => {
            if (x.fotos.length > 0) {
                x.fotos.forEach(cadaFoto => {
                    photos.forEach(y => {
                        if (y == cadaFoto.foto) {
                            images.push({ url: cadaFoto.foto, name: x.establecimiento + "-" + cadaFoto.tag + "-" + cadaFoto.descripcion })
                        }
                    })
                })
            }
        })

        // console.log(images)
        let dataFinal = images.filter(x => x.url !== '')
        // console.log(dataFinal)
        const zip = new JSZip();

        let contador = 0
        dataFinal.forEach((url, index) => {
            // Carga la imagen como un blob
            fetch(url.url)
                .then(res => res.blob())
                .then(blob => {
                    // Agrega la imagen al archivo ZIP
                    // zip.file(`image${index}.jpg`, blob);
                    contador++
                    zip.file(contador + "- " + `${url.name}.jpg`, blob);
                    if (contador === dataFinal.length) {
                        // Cuando se hayan agregado todas las imágenes, genera el archivo ZIP
                        zip.generateAsync({ type: 'blob' }).then(content => {
                            // Descarga el archivo ZIP
                            console.log("Aquiiii")
                            console.log(content)
                            setLoadPanelBoolean(false)
                            saveAs(content, 'RegistroFotografico.zip');
                        });
                    }
                });
        });
    }

    const DescargarAllZip = () => {

        let images = []
        resgistros.forEach(x => {
            if (x.fotos.length > 0) {
                x.fotos.forEach(cadaFoto => {
                    images.push({ url: cadaFoto.foto, name: x.establecimiento + "-" + cadaFoto.tag + "-" + cadaFoto.descripcion })
                })
            }
        })
        const zip = new JSZip();
        let contador = 0
        images.forEach((url, index) => {
            // Carga la imagen como un blob
            fetch(url.url)
                .then(res => res.blob())
                .then(blob => {
                    // Agrega la imagen al archivo ZIP
                    contador++
                    zip.file(contador + "- " + `${url.name}.jpg`, blob);
                    if (contador === images.length) {
                        // Cuando se hayan agregado todas las imágenes, genera el archivo ZIP
                        zip.generateAsync({ type: 'blob' }).then(content => {
                            // Descarga el archivo ZIP
                            setLoadPanelBoolean(false)
                            saveAs(content, 'RegistroFotografico.zip');
                        });
                    }
                });
        });
    }

    const DescargarInfo = (e) => {
        console.log(e)
        setLoadPanelBoolean(true)
        if (ImagesSelected.length == 0) {
            if (e.itemData === "Zip") {
                DescargarAllZip()
            } else if (e.itemData === "Power Point") {
                DescargarAllPowerPoint()
            } else if (e.itemData === "PDF") {
                DescargarAllPdf()
            }
        } else {
            if (e.itemData === "Zip") {
                DescargarSelectedZip()
            } else if (e.itemData === "Power Point") {
                DescargarSelectedPowerPoint()
            } else if (e.itemData === "PDF") {
                DescargarSelectedPdf()
            }
        }
    }

    const DescargarAllPdf = () => {

        let images = []
        resgistros.forEach(x => {
            if (x.fotos.length > 0) {
                x.fotos.forEach(cadaFoto => {
                    images.push({ url: cadaFoto.foto, name: x.establecimiento + "-" + cadaFoto.tag + "-" + cadaFoto.descripcion })
                })
            }
        })
        console.log(images)
        const doc = new jsPDF();
        let contador = 0
        images.forEach((url, index) => {
            // Carga la imagen como un objeto Image de HTML
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Agrega la imagen al PDF

                contador++
                const width = doc.internal.pageSize.getWidth();
                const height = (img.height * width) / img.width;
                doc.addImage(img, 'JPEG', 0, 20, width, height);
                if (contador === images.length) {
                    // Cuando se hayan agregado todas las imágenes, guarda el PDF
                    console.log("Aquiiii")
                    setLoadPanelBoolean(false)
                    doc.save('RegistroFotografico.pdf');
                } else {
                    // Agrega una nueva página antes de agregar la siguiente imagen
                    console.log("Aquiiii")
                    // doc.addFont(url.descripcion)
                    // doc.setTextColor("black")
                    // doc.text(url.descripcion, 10, 200);
                    doc.text(url.name === "" || url.name === undefined || url.name === null ? "Image" : url.name, 10, 10);

                    // Agregar el nuevo texto encima del texto original
                    doc.setFontSize(12);
                    doc.addPage();
                }
            };
            img.src = url.url;
        });
    }

    const DescargarSelectedPdf = async () => {
        let photos = localStorage.getItem('photosSelected').split(',');
        console.log(photos)



        let images = []
        resgistros.forEach(x => {
            if (x.fotos.length > 0) {
                x.fotos.forEach(cadaFoto => {
                    photos.forEach(y => {
                        if (y == cadaFoto.foto) {
                            images.push({ url: cadaFoto.foto, name: x.establecimiento + "-" + cadaFoto.tag + "-" + cadaFoto.descripcion })
                        }
                    })
                })
            }
        })

        console.log(images)

        let dataFinal = images.filter(x => x !== '')
        console.log(dataFinal)

        const doc = new jsPDF();
        let contador = 0
        dataFinal.forEach((url, index) => {
            // Carga la imagen como un objeto Image de HTML
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Agrega la imagen al PDF
                const width = doc.internal.pageSize.getWidth();
                const height = (img.height * width) / img.width;
                doc.text(url.name === "" || url.name === undefined || url.name === null ? "Image" : url.name, 10, 10);
                doc.setFontSize(12);
                doc.addImage(img, 'JPEG', 0, 20, width, height);
                contador++
                console.log(contador)
                if (contador === images.length) {
                    console.log("Aquiiii")
                    setLoadPanelBoolean(false)
                    doc.save('RegistroFotografico.pdf');
                } else {
                    console.log("Aquiiii")
                    // doc.text(url.name === "" || url.name === undefined || url.name === null ? "Image" : url.name, 10, 10);
                    // doc.setFontSize(12);
                    doc.addPage();
                }
            };
            img.src = url.url;
        });
    }


    const DescargarAllPowerPoint = () => {

        let images = []
        resgistros.forEach(x => {
            if (x.fotos.length > 0) {
                x.fotos.forEach(cadaFoto => {
                    images.push(cadaFoto.foto)
                })
            }
        })
        // console.log(images)
        const pptx = new pptxgen();

        images.forEach((image) => {
            // Carga la imagen como un objeto Image de HTML
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = image;
            img.onload = () => {
                // Agrega una diapositiva a la presentación
                const slide = pptx.addSlide();

                // Agrega la imagen a la diapositiva
                slide.addImage({ data: img.src, x: 1, y: 2, w: 5, h: 3 });

                // Descarga la presentación de PowerPoint una vez que se hayan agregado todas las imágenes
                console.log(pptx.slides.length, "===", images.length)
                if (pptx.slides.length === images.length - 1) {
                    console.log("Aqui")
                    setLoadPanelBoolean(false)
                    pptx.writeFile('images.pptx');
                }
            };
        });
    }

    const DescargarSelectedPowerPoint = async () => {
        let photos = localStorage.getItem('photosSelected').split(',');
        console.log(photos)
        // photos.forEach(async x => {
        //     if (x != '') {

        let dataFinal = photos.filter(x => x !== '')
        console.log(dataFinal)

        const pptx = new pptxgen();

        dataFinal.forEach((image) => {
            // Carga la imagen como un objeto Image de HTML
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = image;
            img.onload = () => {
                // Agrega una diapositiva a la presentación
                const slide = pptx.addSlide();

                console.log(img)
                // Agrega la imagen a la diapositiva
                slide.addImage({ data: img.src, x: 1, y: 2, w: 5, h: 3 });
                console.log(pptx.slides)
                console.log(dataFinal.length)

                // Descarga la presentación de PowerPoint una vez que se hayan agregado todas las imágenes
                console.log(pptx.slides.length, "===", dataFinal.length)
                if (pptx.slides.length === dataFinal.length) {
                    console.log("Aqui")
                    setLoadPanelBoolean(false)
                    pptx.writeFile('images.pptx');
                }
            };
        });
    }

    const selectAll = () => {
        const newData = [...resgistros];
        newData.forEach(element => {
            if (element.fotos !== undefined) {
                element.fotos.forEach(x => {
                    // if (x.foto == fotos.foto){
                    x.selected = true
                    // }
                })
            }
        });
        setRegistros(newData)
        setselectedAll(true)
    }

    const DeselectAll = () => {
        const newData = [...resgistros];
        newData.forEach(element => {
            if (element.fotos !== undefined) {
                element.fotos.forEach(x => {
                    // if (x.foto == fotos.foto){
                    x.selected = false
                    // }
                })
            }
        });
        setRegistros(newData)
        setselectedAll(false)
    }

    const buttonDropDownOptions = { width: 300 };

    return (
        <div height="100%">
            <div className="d-md-flex justify-content-between pruebaBoton">
                <h5 className={"content-block titleCliente"}>Registro Fotografico</h5>
                <div style={{ display: "flex", width: "45%" }}>
                    <Button className="btn btn-light mt-4 mr-2" onClick={clearFilters}>Limpiar Filtros</Button>
                    {/* <Button className="btn btn-primary mt-4 mr-2" onClick={DescargarSelected} disabled={!infoSelected}>Descargar seleccionados</Button>
                        <Button className="btn btn-primary mt-4 mr-2" onClick={DescargarAll} disabled={resgistros.length < 0}>Descargar todos</Button> */}
                    <DropDownButton
                        className="btn mt-3 mr-2"
                        style={{ height: "50px" }}
                        text="Descargar"
                        icon="donwload"
                        dropDownOptions={buttonDropDownOptions}
                        items={options}
                        onItemClick={(e) => {
                            DescargarInfo(e)
                        }}
                        disabled={resgistros.length == 0}
                    />

                    {/* <SelectBox
                            style={{height:"50px", margin:"15px", height:"50px"}}
                            searchEnabled
                            label='Descargar'
                            onValueChanged={(e) => { DescargarInfo(e);}}
                            dataSource={options}
                        /> */}

                    {selectedAll == true ? (
                        <Button className="btn btn-primary mt-4 mr-2" onClick={DeselectAll} disabled={resgistros.length == 0}>Deseleccionar</Button>
                    ) : (
                        <Button className="btn btn-primary mt-4 mr-2" onClick={selectAll} disabled={resgistros.length == 0}>Seleccionar todos</Button>
                    )}

                    <Button className="btn btn-primary mt-4 mr-2" onClick={serachPictures}>Buscar</Button>
                </div>

            </div>

            <div className="row">
                <div className="col-md-4 mt-4">
                    <SelectBox
                        searchEnabled
                        label='Cliente'
                        onValueChanged={(e) => { searchFormulario(e); searchUsersAndStablishment(e) }}
                        dataSource={Clientes}
                        defaultValue={filters.cliente}
                        value={filters.cliente}
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <SelectBox
                        searchEnabled
                        label='Formularios'
                        dataSource={Formularios}
                        valueExpr="nombre"
                        displayExpr="nombre"
                        defaultValue={filters.formulario}
                        value={filters.formulario}
                        onValueChanged={(e) => {
                            setFilters({
                                ...filters,
                                formulario: e.value,
                            })
                        }
                        }
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <DateBox
                        label='Desde'
                        onValueChanged={(e) =>
                            setFilters({
                                ...filters,
                                fechaInicial: e.value,
                            })
                        }
                        defaultValue={fechaInicial}
                        value={fechaInicial}
                        max={now}
                        type='date'
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <DateBox
                        label='Hasta'
                        onValueChanged={(e) =>
                            setFilters({
                                ...filters,
                                fechaFinal: e.value,
                            })
                        }
                        defaultValue={FechaFinal}
                        value={FechaFinal}
                        max={now}
                        type='date'
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <SelectBox
                        searchEnabled
                        label='Region'
                        dataSource={Regiones}
                        defaultValue={filters.region}
                        value={filters.region}
                        onValueChanged={(e) => { searchUsersAndStablishment(e) }}
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <SelectBox
                        label='Usuarios'
                        dataSource={usuario}
                        defaultValue={filters.usuarios}
                        value={filters.usuarios}
                        valueExpr="uid"
                        displayExpr="nombre"
                        onValueChange={(e) => {
                            setFilters({
                                ...filters,
                                usuarios: e,
                            })
                        }}
                        searchEnabled={true}
                        disabled={filters.region !== '' && filters.cliente !== '' ? false : true}
                    />
                </div>

                <div className="col-md-4 mt-4">
                    <SelectBox
                        label='Establecimientos'
                        dataSource={Establecimito}
                        defaultValue={filters.Establecimientos}
                        value={filters.Establecimientos}
                        valueExpr="nombre_establecimiento"
                        displayExpr="nombre_establecimiento"
                        onValueChanged={(e) => {
                            setFilters({
                                ...filters,
                                Establecimientos: e.value,
                            })
                        }
                        }
                        searchEnabled={true}
                        disabled={filters.region !== '' && filters.cliente !== '' ? false : true}
                    />
                </div>

                <div className="col-md-4 mt-4">
                    <SelectBox
                        label='Cadena'
                        dataSource={cadenas}
                        defaultValue={filters.cadenas}
                        value={filters.cadenas}
                        valueExpr="nombre_cadena"
                        displayExpr="nombre_cadena"
                        onValueChanged={(e) => {
                            setFilters({
                                ...filters,
                                cadenas: e.value,
                            })
                        }}
                        searchEnabled={true}
                        disabled={filters.region !== '' && filters.cliente !== '' ? false : true}
                    />
                </div>

                <div className="col-md-4 mt-4">
                    <SelectBox
                        label='Etiquetas'
                        dataSource={tags}
                        defaultValue={filters.tag}
                        value={filters.tag}
                        onValueChanged={(e) => {
                            setFilters({
                                ...filters,
                                tag: e.value,
                            })
                        }
                        }
                        searchEnabled={true}
                    />
                </div>

                <div className="col-md-12 mt-4">
                    {ImagesSelected.length === 0 ? (
                        resgistros.length > 0 && (
                            <div style={styleContador}>Se descargaran todas las imagenes</div>
                        )
                    ) : (
                        <div style={styleContador} >Se descargaran {ImagesSelected.length} imagenes</div>
                    )}
                </div>
            </div>

            <div className="row">
                {
                    resgistros.map((cadaRegistro) => {
                        return (
                            cadaRegistro.length != 0 ? (
                                cadaRegistro.fotos.map((fotos) => {
                                    return (
                                        <div className="col-md-3 mt-5" key={fotos.foto}>
                                            <div className='mb-4'>
                                                <div className={'dx-card p-4'}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>

                                                        <div style={{ float: 'right', paddingBottom: '10px', cursor: "pointer" }}>
                                                            {/* onValueChanged={(e) => savePhoto(fotos)} value={fotos.selected} */}
                                                            <CheckBox
                                                                value={fotos.selected} onValueChanged={(e) => {
                                                                    const newData = [...resgistros];
                                                                    newData.forEach(element => {
                                                                        if (element.fotos !== undefined) {
                                                                            element.fotos.forEach(x => {
                                                                                if (x.foto == fotos.foto) {
                                                                                    x.selected = e.value
                                                                                }
                                                                            })
                                                                        }
                                                                    });
                                                                    setRegistros(newData)
                                                                    savePhoto(fotos)
                                                                    // setDataRoles({...resgistros,  superAdmin:e.value})

                                                                }

                                                                }
                                                            />
                                                        </div>

                                                        <div>
                                                            {/* buttonDescargar */}
                                                            <FontAwesomeIcon className="icon-status" style={{ cursor: "pointer" }} icon={faDownload} onClick={() => {
                                                                handleClick(fotos, cadaRegistro)
                                                            }} />
                                                        </div>



                                                    </div>

                                                    <div className="">
                                                        <img src={fotos.foto} alt="image-form" width='100%' height='300px' />
                                                    </div>
                                                    <div className="">
                                                        <h6 className='mt-3' style={{ fontSize: "2vh", fontWeight: "bolder", textAlign: "center" }}>{cadaRegistro.establecimiento}</h6>
                                                        <p className='mt-3' style={{ textAlign: 'center' }}>{cadaRegistro.promotor}</p>
                                                        <p className='mt-3' style={{ textAlign: 'center' }}>{cadaRegistro.fecha_Sincronizado}</p>
                                                        {fotos.descripcion == null ? (
                                                            <div style={{ height: "3vh" }}></div>
                                                        ) : (
                                                            <p className='mt-3' style={{ textAlign: 'center', height: '90%', fontSize: "2vh" }}>{fotos.descripcion}</p>
                                                        )}
                                                        <p className='mt-3' style={{ textAlign: 'center', height: '90%' }}>{fotos.tag}</p>

                                                        <p className='mt-3' style={{ textAlign: 'center' }}>Coordenadas: {cadaRegistro.coordenadas}</p>

                                                        <div className="App">
                                                        </div>
                                                    </div>
                                                    {/* <FontAwesomeIcon icon={faCircleCheck} className="icon-status" ></FontAwesomeIcon> */}

                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : ''
                        )
                    })
                }
            </div>
            <LoadPanel visible={LoadPanelBoolean} />
        </div>
    );
}

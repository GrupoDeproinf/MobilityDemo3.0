import React, { useEffect, useState } from "react";
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import RadioGroup from 'devextreme-react/radio-group';
import DateBox from "devextreme-react/date-box";
import SelectBox from 'devextreme-react/select-box';
import Moment from 'moment';
import Repeater  from '../repeater/repeater';
import { Button } from "devextreme-react/button";
import { XLg } from 'react-bootstrap-icons';

const ItemInput = (props) => {
  useEffect(() => {
    setInventoryValue({});
  }, [props.keyData])

  const simpleRadio = ['Si', 'No'];
  const [inventoryValue, setInventoryValue] = useState({});
  const [precioValue, setPrecioValue] = useState({});
  const [precioMarcaValue, setMarcaValue] = useState({});
  const [count, setCount] = useState({});
  const [defaultMoney, setDefaultMoney] = useState({});

  const calculateInventory = (item, event) => {
    inventoryValue[item] = event.value;
    inventoryValue.Total = inventoryValue.Caras * inventoryValue.Profundidad;
    setInventoryValue(
      {
        "Caras": inventoryValue.Caras,
        "Profundidad": inventoryValue.Profundidad,
        "Total": inventoryValue.Total
      }
    );
  }

  const setFinalDateData = (e) => {
    console.log("SETEANDO DATA?? ", e);
    let elementValue = e;
    elementValue.value = Moment(e.value).format('DD-MM-YYYY');
    props.setFinalData(elementValue);
  }

  const defaultDateInput = (date) => {
    console.log("DATE? ", date, " // ", isNaN(Moment(date, "DD/MM/YYYY").format('DD-MM-YYYY')));
    return !isNaN(Moment(date, "DD/MM/YYYY").format('DD-MM-YYYY')) ? Moment(date, "DD/MM/YYYY").format('DD-MM-YYYY') : '';
  }

  const buildFiled = (question, i) => {
    if (props.defaultValue) {
      if(props.finalProducts[props.defaultValue.producto + '_' + props.defaultValue.nombre] !== undefined ) {

        let defaultValueInput = props.finalProducts[props.defaultValue.producto + '_' + props.defaultValue.nombre][question.pregunta];
       
        let key = props.defaultValue.producto + '_' + question.pregunta + '_' + props.defaultValue.nombre;
         
        if (question.tipo === "Cantidad") {
          return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={props.setFinalData} defaultValue={defaultValueInput} format="#0" />
        } else if (question.tipo === "Precio") {
         
          defaultValueInput =  props.defaultMoney === "$" ? defaultValueInput['dolares'] :  defaultValueInput['bolivares'];
          
          if(defaultMoney[key] !== props.defaultMoney || precioValue[key] === undefined){
            let precioTemporal = {...precioValue, [key] : defaultValueInput};
            setPrecioValue(precioTemporal);
            setDefaultMoney({...precioValue, [key]: props.defaultMoney}); 
          }
  
          return <NumberBox width={'100%'} id={"cost/"+question.pregunta} key={key} 
            onValueChanged={(e) => { 
              
                let currentValue = e.value;
  
                let precioTemporal = {...precioValue, [key] : currentValue};
                console.log("Cambiando precio ", precioTemporal);
                setPrecioValue(precioTemporal);
              
              props.setFinalData(e); 
            }} 
            value={precioValue[key]} format="#,##0.##" 
          />
        } else if (question.tipo === "Simple") {
          return <RadioGroup items={simpleRadio} id={question.pregunta} key={key} onValueChanged={props.setFinalData} defaultValue={defaultValueInput} layout="horizontal" />
        } else if (question.tipo === "Tamaño") {
          return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={props.setFinalData} defaultValue={defaultValueInput} format="#,##0.###" />
        } else if (question.tipo === "Texto") {
          return <TextBox width={'100%'} id={question.pregunta} key={key} onValueChanged={props.setFinalData} defaultValue={defaultValueInput} />
        } else if (question.tipo === "Calculado") {
          if (Object.keys(inventoryValue).length === 0) {
            setInventoryValue(defaultValueInput);
          }
  
          return (<div style={{ display: "flex" }}>
            {question.campos.map((x, i) => {
              return (
                <React.Fragment>
                  <div key={x + '_' + key + i} className="dx-fieldset inventario">
                    <div className="dx-fieldset-header" style={{ fontSize: 13 }}>{x}</div>
                    <div className="dx-field">
  
                      {x === 'Total' ?
                        <NumberBox width={'100%'} id={question.pregunta + '/=' + x} key={key + '_' + x} readOnly={true} value={inventoryValue.Total} format="#,##0.###" />
                        :
                        <NumberBox width={'100%'} id={question.pregunta + '/=' + x} key={key + '_' + x} onValueChanged={(e) => {
                          props.setFinalData(e);
                          calculateInventory(x, e);
                        }} defaultValue={defaultValueInput[x]} format="#,##0.###" />
                      }
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>)
        } else if (question.tipo === "Emisión-Vencimiento") {
          // console.log("KEY? ", key);
          // console.log("DEFAULT VALUE VENCIMIENTO ", defaultValueInput);
          if(count[key] === null || count[key] === undefined){
            var tempCount = {...count};
            tempCount[key] = 1;
            setCount(tempCount);
          }
          // console.log("COUNT?? ", count);
          return (
            <div style={{ width: "100%" }} className="container-box-repeater">
              <Repeater count={count[key] ?? 1}>
                {i => {
                  const Tag = i === 0 ? 'div' : 'div'
                  console.log("default value ", defaultValueInput[i]);
                  return (
                    <Tag key={i} style={{ width: "100%" }} className="box-item-repeater">
                        {
                          (i === count[key] - 1 && i !== 0)  &&
                            <div className="text-align-right">
                              <Button className="btn-delete-item mr-2 mb-3" onClick={()=>{
                                let tempCount = {...count};
                                tempCount[key] = tempCount[key] - 1;
                                setCount(tempCount); 
                                props.setDefaultDataExpiration(question.pregunta, i, "delete");
                              }}>
                                <XLg />
                              </Button>
                            </div>
                        }

                        <div style={{ display: "flex" }}>
                          <div className="dx-fieldset inventario">
                            <div className="dx-fieldset-header" style={{ fontSize: 13 }}>Lote</div>
                            <div className="dx-field">
                              <TextBox width={'100%'} id={question.pregunta + '=/'+ i + '=/lote'} defaultValue={defaultValueInput[i]?.lote} onValueChanged={props.setFinalData} key={key} />
                            </div>
                          </div>
                          <div className="dx-fieldset">
                            <div className="dx-fieldset-header" style={{ fontSize: 13 }}>Cantidad</div>
                            <div className="dx-field">
                              <NumberBox width={'100%'} id={question.pregunta + '=/'+ i + '=/cantidad'} key={key} defaultValue={defaultValueInput[i]?.cantidad} onValueChanged={props.setFinalData} format="#,##0.###" />
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", width: "100%" }}>
                          <div className="dx-fieldset inventario">
                            <div className="dx-fieldset-header" style={{ fontSize: 13 }}>Fecha Emisión</div>
                            <div className="dx-field">
                              <DateBox width={'100%'} id={question.pregunta + '=/'+ i + '=/fecha_Emision'} key={key + '=/'+ i + '=/fecha_Emision'} defaultValue={defaultDateInput(defaultValueInput[i]?.fecha_Emision)} onValueChanged={setFinalDateData} pickerType="calendar" type="date" />
                            </div>
                          </div>
                          <div className="dx-fieldset">
                            <div className="dx-fieldset-header" style={{ fontSize: 13 }}>Fecha Vencimiento</div>
                            <div className="dx-field">
                              <DateBox width={'100%'} id={question.pregunta + '=/'+ i + '=/fecha_Vencimiento'} defaultValue={defaultDateInput(defaultValueInput[i]?.fecha_Vencimiento)}  key={key + '=/'+ i + '=/fecha_Vencimiento'} onValueChanged={setFinalDateData} pickerType="calendar" type="date" />
                            </div>
                          </div>
                        </div>
                        <div className="dx-fieldset inventario">
                          <div className="dx-fieldset-header" style={{ fontSize: 13 }}>Motivo</div>
                          <div className="dx-field">
                            <SelectBox
                              id={question.pregunta + '=/'+ i + '=/motivo'}
                              width={'100%'}
                              key={key + '=/'+ i + '=/motivo'}
                              onValueChanged={props.setFinalData}
                              dataSource={question.opciones}
                              defaultValue={defaultValueInput[i]?.motivo}
                              searchEnabled={false}
                              placeholder="Motivo"
                            />
                          </div>
                        </div>
                    </Tag>
                  )
                }}
              </Repeater>
              <div className='mt-1 row'>
                <div sm='12' className='col-md-12 m-4 text-center'>
                  <Button className="btn btn-primary" onClick={() => {
                      let tempCount = {...count};
                      tempCount[key] = tempCount[key] + 1;
                      setCount(tempCount);
                      props.setDefaultDataExpiration(question.pregunta, i, "add");
                    }}>
                    <span className='align-middle'>Añadir</span>
                  </Button>
                </div>
              </div>
            </div>
          )
        } else if (question.tipo === "Fecha"){
          return <DateBox width={'100%'} id={question.pregunta} defaultValue={defaultValueInput} onValueChanged={props.setFinalData} pickerType="calendar" type="date" />
        }
      }
    }
  }

  const buildFiledMarcas = (question) => {
    console.log('Final Marcas ', props.finalMarcas);
    // console.log('Default Marca ', props.defaultMarca);
    let defaultValueInput = props.finalMarcas[props.defaultMainCategory + '_' + props.defaultMarca.marca + '_' + props.defaultMarca.nombre][question.pregunta];
    
    let key = props.defaultMarca.marca + '_' + props.defaultMarca.nombre + '_' + question.pregunta;



    if (question.tipo === "Cantidad") {
      return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={props.setFinalMarca} defaultValue={defaultValueInput} format="#0" />
    } else if (question.tipo === "Precio") {
      defaultValueInput =  props.defaultMoney === "$" ? defaultValueInput['dolares'] :  defaultValueInput['bolivares'];
          console.log("🚀 ~ file: itemInput.js:55 ~ buildFiled ~ defaultValueInput:", defaultValueInput)
          
          if(defaultMoney !== props.defaultMoney || precioMarcaValue[key] === undefined){
            console.log("soy diferente ", precioMarcaValue[key]);
            let precioTemporal = {...precioMarcaValue, [key] : defaultValueInput};
            setMarcaValue(precioTemporal);
            setDefaultMoney(props.defaultMoney);
          }
  
          return <NumberBox width={'100%'} id={"cost/"+question.pregunta} key={key} 
            onValueChanged={(e) => { 
              props.setFinalMarca(e); 
              console.log("PRECIO VALUE ACTUAL ", precioMarcaValue);
              if(precioMarcaValue[key] ?? false !== defaultValueInput){
                let currentValue = e.value;
  
                let precioTemporal = {...precioMarcaValue, [key] : currentValue};
                console.log("Cambiando precio ", precioTemporal);
                setMarcaValue(precioTemporal);
              }
            }} 
            defaultValue={defaultValueInput} value={precioMarcaValue[key]} format="#,##0.##" 
          />
    } else if (question.tipo === "Simple") {
      return <RadioGroup items={simpleRadio} id={question.pregunta} key={key} onValueChanged={props.setFinalMarca} defaultValue={defaultValueInput} layout="horizontal" />
    } else if (question.tipo === "Tamaño") {
      return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={props.setFinalMarca} defaultValue={defaultValueInput} format="#,##0.###" />
    } else if (question.tipo === "Texto") {
      return <TextBox width={'100%'} id={question.pregunta} key={key} onValueChanged={props.setFinalMarca} defaultValue={defaultValueInput} />
    }
  }

  return (
    <div className='rightPopupForm'>
      {
        props.selectedQuestions.length > 0 &&
        props.selectedQuestions.map((question, i) => {
          return (
            <div key={i} className="dx-fieldset">
              <div className="dx-fieldset-header">{question.pregunta}</div>
              <div className="dx-field">
                {buildFiled(question, i)}
              </div>
            </div>
          )
        })
      }
      {
        props.selectedQuestionsMarca.length > 0 &&
        props.selectedQuestionsMarca.map((question, i) => {
          return (
            <div key={i} className="dx-fieldset">
              <div className="dx-fieldset-header">{question.pregunta}</div>
              <div className="dx-field">
                {buildFiledMarcas(question)}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ItemInput;
import React, { useState, useEffect } from "react";

//Componentes Externos
import ItemInput from "./itemInput";
import RightCategoryForm from '../rightCategoryForm/rightCategoryForm';

//DevExpress Components
import List from 'devextreme-react/list';
import { Button } from "devextreme-react/button";
import ScrollView from 'devextreme-react/scroll-view';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

//Iconos
import { CheckCircleFill } from 'react-bootstrap-icons';
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {TreeList, Column, Scrolling, FilterRow} from 'devextreme-react/tree-list';

const RightListForm = (props) =>{
    const [questionProductPopup, setQuestionProductPopup] = useState(false);
    const [showCategoryQuestions, setShowCategoryQuestions] = useState(false);
    const [questionsPopup, setQuestionsPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const listAttrs = { class: 'list' };

    useEffect(()=>{
        
        if( Array.isArray(props.selectedQuestionsParent) && props.selectedQuestionsParent.length > 0) {
            setShowCategoryQuestions(true);
        }else{
            setShowCategoryQuestions(false);
        }
        
        // console.log("🚀 ~ useEffect ~ props.currentData:", props.currentData)
        console.log(props.selectedQuestionsParent);
    }, [props.selectedQuestionsParent])

    const setPopupQuestionsProduct = (e) => {
        
        let item = e;
        if(item.titleMarcaItem || item.titleMarca){
            props.setSelectedQuestionsMarca(item.preguntas);
            props.setDefaultMarca(item);
            props.setSelectedQuestions([]);
        }else{
            if(item.preguntas.length) props.setSelectedQuestions(item.preguntas);
            props.setSelectedQuestionsMarca([]);
            props.setDefaultMarca([]);
        }
        setSelectedProduct(item);
        setSelectedItems([]);
        if(Array.isArray(item.preguntas)) setQuestionProductPopup(true); 
        
        props.setLengthCategory(category => { return {...category, defaultValue: item} })
    }

    const setPopupTitleCategory = () => {
        console.log(props.selectedQuestionsParent);
        console.log("CATEGORY QUESTIONS ", showCategoryQuestions);
        if(showCategoryQuestions) {
            setQuestionsPopup(true)
        };
    }

    const itemRenderRightList = (event) => {
        if(event?.data?.data == null || event?.data?.data == undefined){
            return <span></span>
        }

        let item = event.data.data;
        
        return (
            <div key={item.ID} className={`
                item-category right-form ${item.titleMarca? 'title-right' : (item.titleMarcaItem ? 'title-marca' : 'title-right-form')} 
                ${Array.isArray(item.preguntas) ? 'title-question' : 'normal-title'}
            `} onClick={() => { return Array.isArray(item.preguntas) ? setPopupQuestionsProduct(item) : null}}>
              <div className="item-name d-flex ">
                <div className="name w-80">{item.producto} 
                {
                        item.titleMarcaItem &&
                            <FontAwesomeIcon 
                                icon={faEye} 
                                className="icon-eye-marca">
                            </FontAwesomeIcon>
                    }
                </div>
                { item.editado && <CheckCircleFill className="icon-completed" /> }
              </div>
            </div>
        )
    }

    const saveQuestionProduct = (defaultData) => {
        let found = props.currentData.findIndex(x=> x.ID === defaultData.ID);
        if(found !== -1){
            let newCategory = [...props.currentData];
            newCategory[found].editado = true;
            props.setModifyCurrentData(newCategory);
        }
        setQuestionProductPopup(false);
    }

    const closeButtonOptions = {
        icon: 'fas fa-xmark',
        className: "popup-toolbar",
        onClick: () => {setQuestionsPopup(false); setQuestionProductPopup(false)},
    };

    return (
            <div className="rightListForm">
                <h5 className='mb-5 title'>Selecciona el producto </h5>
                <h6 className='mb-5 titleCategory' onClick={setPopupTitleCategory}>{props.defaultCategory} 
                    {
                        showCategoryQuestions &&
                            <FontAwesomeIcon 
                                icon={faEye} 
                                className="icon-eye-category">
                            </FontAwesomeIcon>
                    }
                </h6>

                <TreeList
                    id="simple-treeview"
                    dataSource={props.currentData}
                    displayExpr="producto"
                    parentIdExpr="categoryId"
                    keyExpr="ID"
                    rootValue={-1}
                    showRowLines={false}
                    showBorders={false}
                    filterMode='fullBranch'
                    
                    // onItemClick={selectItem}
                >
                    <FilterRow visible={true} />
                    <Scrolling mode="Virtual" />
                    <Column
                        cellComponent={itemRenderRightList}
                        dataField="producto"
                        caption="Marca" />
                </TreeList>
                
                {/* <List
                    selectionMode="single"
                    dataSource={props.currentData}
                    searchEnabled={true}
                    searchMode='contains'
                    searchExpr="producto"
                    itemRender={itemRenderRightList}
                    className="formList"
                    elementAttr={listAttrs}
                    selectedItemKeys={selectedItems}
                    nextButtonText="Ver Más"
                    noDataText="No se encontró data"
                    searchEditorOptions={{placeholder: 'Buscar'}}
                    onSelectionChanged={setPopupQuestionsProduct}
                /> */}
                {
                    questionsPopup === true &&
                    <Popup
                        width={'45%'}
                        height="auto"
                        visible={questionsPopup}
                        onHiding={() => {setQuestionsPopup(false)}}
                        showTitle={false}
                        showCloseButton={true}
                        
                        className="popup-form">
                        <ToolbarItem
                            widget="dxButton"
                            toolbar="top"
                            location="after"
                            options={closeButtonOptions}
                        />
                        <ScrollView width='100%' height='100%'>
                            <h6 className='mb-4 titleCategory popupForm'  >{props.defaultCategory}</h6>
                            {console.log("SELECTED QUESTIONS?? ", props.selectedQuestionsParent, " SHOW?? ", showCategoryQuestions)}
                            { props.selectedQuestionsParent.length > 0  &&
                                <RightCategoryForm 
                                    selectedQuestions = {props.selectedQuestionsParent}
                                    finalCategory = {props.finalQuestionsCategory}
                                    defaultValue = {props.defaultCategory}
                                    setFinalData = {props.setFinalCategory}
                                    defaultMainCategory = {props.selectedMainCategory}
                                />
                            }
                            <div className="button-container">
                                <div className="float-left-button">
                                    {/* <Button className="btn btn-light mr-2" onClick={clearFormCategory}><CartXFill  className="iconCart"/>Limpiar</Button> */}
                                </div>
                                <div className="float-right-button">
                                    <Button className="btn btn-light cancel mr-2" onClick={()=> setQuestionsPopup(false)}>Cancelar</Button>
                                    <Button className="btn btn-lg btn-primary save-button" onClick={()=> setQuestionsPopup(false)}>Guardar</Button>
                                </div>
                            </div>
                        </ScrollView>
                    </Popup>
                }
                {
                    questionProductPopup == true && 
                    <Popup
                        width={'45%'}
                        height={'90%'}
                        visible={questionProductPopup}
                        onHiding={() => {setQuestionProductPopup(false)}}
                        showTitle={false}
                        showCloseButton={true}
                        
                        className="popup-form">
                        <ToolbarItem
                            widget="dxButton"
                            toolbar="top"
                            location="after"
                            options={closeButtonOptions}
                        />
                        <ScrollView width='100%' height='100%'>
                            <h6 className='mb-4 titleCategory popupForm'  >{selectedProduct.marca}</h6>
                            <h6 className='mb-4 titleProduct popupForm'  >{selectedProduct.producto}</h6>

                            <ItemInput 
                                selectedQuestionsMarca = {props.selectedQuestionsMarca}
                                setSelectedQuestionsMarca = {props.setSelectedQuestionsMarca}
                                setDefaultMarca = {props.setDefaultMarca}
                                finalMarcas = {props.finalMarcas}
                                setFinalMarca = {props.setFinalMarca}
                                defaultMarca = {props.defaultMarca}
                                
                                defaultMainCategory = {props.selectedMainCategory.categoria}
                                keyData = {questionProductPopup}
                                setDefaultDataExpiration = {props.setDefaultDataExpiration}
                                defaultValue = {props.defaultValue}
                                setSelectedQuestions = {props.setSelectedQuestions}
                                selectedQuestions = {props.selectedQuestions}
                                setFinalData = {props.setFinalData}
                                finalProducts = {props.finalProducts}
                                defaultMoney={props.defaultMoney}
                            />

                            <div className="button-container">
                                <div className="float-left-button">
                                    {/* <Button className="btn btn-light mr-2" onClick={clearForm}><CartXFill  className="iconCart"/>Limpiar</Button> */}
                                </div>
                                <div className="float-right-button">
                                    <Button className="btn btn-light cancel mr-2" onClick={()=> setQuestionProductPopup(false)}>Cancelar</Button>
                                    <Button className="btn btn-lg btn-primary save-button" onClick={()=> saveQuestionProduct(props.defaultValue)}>Guardar</Button>
                                </div>
                            </div>
                        </ScrollView>
                    </Popup>
                }
            </div>
    );
}

export default RightListForm;
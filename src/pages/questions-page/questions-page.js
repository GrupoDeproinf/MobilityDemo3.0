// import { SelectBox } from "devextreme-react/select-box";
import React, { useState } from "react"
import { DropDownBox } from 'devextreme-react'
import { TreeView } from 'devextreme-react';
import  products from './question-json'
import './questions-page.scss'


export default function QuestionsPage() {

    

    const [selectedNode, setSelectedNode] = useState(products[0]);
    const selectProduct = (e) => {
        setSelectedNode(e.itemData);
    }

    const itemTemplate = (item) => {
        if (item.video) {
            return <iframe src={item.video}/>
        } else {
            return `${item.name}`;
        }
    }

    return (
        <div>
            <h5 className="mt-4 title-questions">Videos Tutoriales</h5>
            <TreeView 
                 dataSource={products}
                 dataStructure="plain"
                 keyExpr="ID"
                 displayExpr="name"
                 parentIdExpr="categoryId"
                selectionMode="single"
                selectByClick={true}
                onItemSelectionChanged={selectProduct}
                itemRender={itemTemplate}
            />
            {
                selectedNode.price &&
                <div id="product-details">
                    <img src={selectedNode.image}/>
                    <div className="name">{selectedNode.name}</div>
                    <div className="price">{`$${ selectedNode.price}`}</div>
                </div>
            }
        </div>
    
    );
    
}

import React from "react";

//Iconos
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CellRenderIconsGrids (data, editFunction, deleteFunction, disableButton) {

    let user = localStorage.getItem('user');
    
    return (
        <React.Fragment>
            <div className='d-flex icons_grid'>
                <FontAwesomeIcon icon={faPencil} className="icon"  onClick={()=>{
                    if(disableButton == false || disableButton == null || disableButton == undefined){
                        editFunction(data.data)
                    }
                }}></FontAwesomeIcon>
                {
                    deleteFunction !== null && 
                        <FontAwesomeIcon icon={faTrashCan} className="icon" onClick={() => {
                            if(disableButton == false || disableButton == null || disableButton == undefined){
                                deleteFunction(data.data)
                            }
                                
                        }
                        }></FontAwesomeIcon>
                }
            </div>
        </React.Fragment>
    )
}
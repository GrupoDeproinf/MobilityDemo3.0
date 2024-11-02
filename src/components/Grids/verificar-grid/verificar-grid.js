import React from "react";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CellRenderVerifica (data) {
    let status = data.data.revisado;
    if(status == true){
        return (
            <>
            <FontAwesomeIcon icon={faCircleCheck} className="icon-status"></FontAwesomeIcon>
            </>
        )
    }else{
        return <FontAwesomeIcon icon={faCircleXmark} className="icon-status-inactivo"></FontAwesomeIcon>
    }
}
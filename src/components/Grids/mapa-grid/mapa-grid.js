import React from "react";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//export default function CellRenderMapa (data, editFunction, deleteFunction, disableButton) {
export default function CellRenderMapa(data) {
    // console.log(data)
    const iconColor = data.data.coordenadas !== "" ? 'green' : 'default';

    return (
        <div className='d-flex icons_grid'>
            <FontAwesomeIcon
                icon={faCrosshairs}
                className="icon"
                style={{ color: iconColor }}
                onClick={() => {
                    if (data.data.revisado && data.data.coordenadas) {
                        var mapaurl = 'https://www.google.com/maps/search/' + data.data.coordenadas.lat + ', ' + data.data.coordenadas.lng + '/';
                        window.open(mapaurl, '_blank');
                    }
                }}
            ></FontAwesomeIcon>
            {/* <FontAwesomeIcon icon={faTrashCan} className="icon" onClick={()=>deleteFunction(data.data.id)}></FontAwesomeIcon> */}
        </div>
    );
}
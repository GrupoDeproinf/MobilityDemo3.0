import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import L from "leaflet";

const createRoutineMachineLayer = (props) => {
    
    const { Coordenadas } = props
    console.log(Coordenadas)
    const instance = L.Routing.control({
        waypoints: Coordenadas,
        language: 'es',
		formatter:  new L.Routing.Formatter({
			language: 'es' 
		}),

        // routeWhileDragging: false,
        // show: false,
        // waypointMode: 'snap',
        // autoRoute: true,
        // showAlternatives: false,
        // waypoints: [
        //     {lat: 7.8014703, lng: -72.2265196},
        // //   L.latLng(10.509403884636095, -66.84724398618309),
        // //   L.latLng(10.473029277881658, -66.81411333962498)
        // ],
        lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }]
        },
        // router:""
        // show: true,
        // addWaypoints: true,
        // routeWhileDragging: true,
        // draggableWaypoints: true,
        // fitSelectedRoutes: true,
        // showAlternatives: true,
    });
    return instance;
    };

    const RoutingMachine = createControlComponent(createRoutineMachineLayer);

    export default RoutingMachine;

import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const ActivationsMap = ({ coordenadas }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const center = coordenadas[0]?.coords;

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  return (
    <div style={{ height: '650px', width: '100%' }}>
      <GoogleMap
        center={center}
        zoom={12}
        mapContainerStyle={{ height: '650px', width: '100%', marginTop: '10px' }}
      >
      {coordenadas.map((coordinate, index) => (
        <Marker
          key={index}
          position={coordinate.coords}
          onClick={() => handleMarkerClick(coordinate)}
        >
          {selectedMarker === coordinate && (
            <InfoWindow onCloseClick={handleCloseInfoWindow}>
              <div className='p-2'>
                <p style={{fontWeight: 'bold'}}>{coordinate.mensaje}</p>
                <p>Hora: {coordinate.hora}</p>
                <p>Latitud: {coordinate.coords.lat}</p>
                <p>Longitud: {coordinate.coords.lng}</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
      </GoogleMap>
    </div>
  )
}

export default ActivationsMap
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng, geocodeByLatLng } from 'react-google-places-autocomplete';

const MapGoogle = (props) => {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [center] = useState({ lat: 10.47915, lng: -66.90618 });
    const [zoom] = useState(10)

    const { direccionEST, Editing, DireccionEstablecimiento } = props;

    const handleMapClick = async (e) => {
        const latLng = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        const results = await geocodeByLatLng(latLng);
        setSelectedPlace({ description: results[0].formatted_address, latLng, zoom: 17 });
        direccionEST(results[0].formatted_address, results[0].place_id, latLng)
    };

    const handleSelect = async (e) => {
        try {
            const results = await geocodeByAddress(e.value.description);
            const latLng = await getLatLng(results[0]);
            setSelectedPlace({ description: e.value.description, latLng, zoom: 17 });
            direccionEST(e.value.description, results[0].place_id, latLng)
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        if (Editing !== "0") {
            const getAddressLatLng = async () => {
                if (DireccionEstablecimiento !== '') {
                    const results = await geocodeByAddress(DireccionEstablecimiento);
                    const latLng = await getLatLng(results[0]);
                    setSelectedPlace({ description: DireccionEstablecimiento, latLng, zoom: 17 });
                }
            };
            getAddressLatLng();
        }
    }, [Editing, DireccionEstablecimiento]);


    return (
        <div style={{ height: '450px', width: '100%' }}>
            <GooglePlacesAutocomplete
                selectProps={{
                    onChange: (e) => { handleSelect(e) },
                    placeholder: 'Buscar establecimiento...',
                }}

            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Buscar dirección...',
                                className: 'location-search-input'
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                                const style = suggestion.active ? { backgroundColor: '#fafafa', cursor: 'pointer' } : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div {...getSuggestionItemProps(suggestion, { style })}>
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </GooglePlacesAutocomplete>
            <GoogleMap
                center={selectedPlace ? selectedPlace.latLng : center}
                zoom={selectedPlace ? selectedPlace.zoom : zoom}
                mapContainerStyle={{ height: '400px', width: '100%', marginTop: '10px' }}
                onClick={handleMapClick}
            >
                {selectedPlace && <Marker position={selectedPlace.latLng} />}
            </GoogleMap>
        </div>
    );
}

export default MapGoogle
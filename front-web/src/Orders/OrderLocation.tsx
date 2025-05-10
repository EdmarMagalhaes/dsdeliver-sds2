import { useState, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete
} from '@react-google-maps/api';
import { toast } from 'react-toastify';
import { OrderLocationData } from './types';

const libraries: ("places")[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '350px'
};

const defaultPosition = {
  lat: -11.6272441,
  lng: -46.8201549
};

type Props = {
  onChangeLocation: (location: OrderLocationData) => void;
};

function OrderLocation({ onChangeLocation }: Props) {
  const [position, setPosition] = useState(defaultPosition);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // ✅ Mostra a chave no console (apenas para debug local)
  console.log('🔑 CHAVE CRA:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);


  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  const handlePlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();

    if (!place || !place.geometry || !place.formatted_address) {
      toast.warning('⚠️ Endereço inválido. Selecione uma opção da lista.');
      return;
    }

    const lat = place.geometry.location?.lat()!;
    const lng = place.geometry.location?.lng()!;
    const formatted = place.formatted_address;

    setPosition({ lat, lng });

    onChangeLocation({
      latitude: lat,
      longitude: lng,
      address: formatted
    });
  };

  return isLoaded ? (
    <div className="order-location-container">
      <div className="order-location-content">
        <h3 className="order-location-title">Selecione onde o pedido deve ser entregue:</h3>
        <div className="filter-container">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="Digite um endereço"
              className="filter"
              style={{ width: '100%', height: '40px', padding: '0 10px' }}
            />
          </Autocomplete>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={position}
          zoom={15}
        >
          <Marker position={position} />
        </GoogleMap>
      </div>
    </div>
  ) : (
    <p>Carregando mapa...</p>
  );
}

export default OrderLocation;

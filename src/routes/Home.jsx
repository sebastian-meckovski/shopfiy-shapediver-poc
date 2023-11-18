import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./Home.scss";

export default function Home() {
  const key = process.env.REACT_APP_GOOGLE_MAPS;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key,
  });

  const [marker, setMarker] = useState();
  const [center, setCenter] = useState();

  const handleMapClick = (event) => {
    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarker(newMarker);
  };

  useEffect(() => {
    setCenter({ lat: 55, lng: 23 });
  }, []);

  const getCurrentPosition = () => {
    try {
      console.log("getting current pos...");
      console.log(navigator);
      console.log(navigator.geolocation);
      navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos.coords?.latitude);
        console.log(pos.coords?.longitude);

        setMarker({ lat: pos.coords?.latitude, lng: pos.coords?.longitude });
        setCenter({ lat: pos.coords?.latitude, lng: pos.coords?.longitude });
      });
    } catch (e) {
      console.log('didnt work...')
    }
  };
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <GoogleMap
        zoom={6}
        center={center}
        mapContainerClassName="GoogleMap"
        options={{
          mapId: "b910d6f6fef88c00",
          disableDefaultUI: true,
          zoomControl: true,
        }}
        onClick={handleMapClick}
      >
        <Marker key={marker} position={marker} />
      </GoogleMap>
      <br />
      <button onClick={getCurrentPosition}> GET CURRENT POSITION</button>
      {marker && (
        <>
          <p>the marker: </p>
          <p>
            lat: {marker.lat} long: {marker.lng}
          </p>
        </>
      )}
    </>
  );
}

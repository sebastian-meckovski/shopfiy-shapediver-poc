import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import "./Home.scss";
import { MarkerClusterer } from "@react-google-maps/api";
import { listPullUpBarsCoords } from "../customQueries";
import { API } from "aws-amplify";

export default function Home() {
  const key = process.env.REACT_APP_GOOGLE_MAPS;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key,
  });

  const [marker, setMarker] = useState();
  const [center, setCenter] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [pullUpBars, setPullupBars] = useState([]);

  async function getAllPullUpBars() {
    try {
      const response = await API.graphql({
        query: listPullUpBarsCoords,
      });

      setPullupBars(response.data?.listPullUpBars?.items);
    } catch (error) {
      // Handle errors here
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllPullUpBars();
  }, []);

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
    setIsLoading(true);
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        setMarker({ lat: pos.coords?.latitude, lng: pos.coords?.longitude });
        setCenter({ lat: pos.coords?.latitude, lng: pos.coords?.longitude });
        resolve();
      });
    })
      .catch((error) => {
        console.log("Error fetching position:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
        {pullUpBars.length > 0 && (
          <MarkerClusterer>
            {(clusterer) =>
              pullUpBars.map((item) => (
                <Marker
                  key={item.id}
                  position={{ lat: item.location.lat, lng: item.location.lon }}
                  clusterer={clusterer}
                />
              ))
            }
          </MarkerClusterer>
        )}
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

      {isLoading && (
        <div className="spinner-container">
          <div className={"loading-spinner"}></div>
        </div>
      )}
    </>
  );
}

import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import "./Home.scss";

export default function Home() {
  const key = process.env.REACT_APP_GOOGLE_MAPS;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: key,
  });

  if (!isLoaded) return <div>loading...</div>;

  return (
    <GoogleMap
      zoom={6}
      center={{ lat: 55, lng: 23 }}
      mapContainerClassName="GoogleMap"
      options={{ mapId: "b910d6f6fef88c00" }}
    ></GoogleMap>
  );
}

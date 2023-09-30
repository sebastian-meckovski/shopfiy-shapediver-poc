import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import "./Home.scss";

export default function Home() {
  console.log(process.env);
  const key =
    process.env.REACT_APP_SECRETS !== undefined
      ? JSON.parse(process.env.REACT_APP_SECRETS).googleMapsApiKey
      : null;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: key,
  });

  console.log('process.env.TEST_VARIABLE')
  console.log(process.env.TEST_VARIABLE)
  
  console.log('process.env.REACT_APP_SECRETS')
  console.log(process.env.REACT_APP_SECRETS)

  console.log('process.env');
  console.log(process.env);

  console.log('key:');
  console.log(key);

  if (!isLoaded) return <div>loading...</div>;

  return (
    <GoogleMap
      zoom={6}
      center={{ lat: 55, lng: 23 }}
      mapContainerClassName="GoogleMap"
    ></GoogleMap>
  );
}

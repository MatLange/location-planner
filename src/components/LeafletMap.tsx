import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer));

const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer));

interface LeafletMapProps {
  children?: React.ReactNode;

};

const LeafletMap: React.FC = () => {
    return (
      <>
          <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              noWrap={true}
            />
          </MapContainer>     
      </>
    );
  };
  
  export default LeafletMap;

//  children?: React.ReactNode;

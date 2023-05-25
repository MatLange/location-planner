import React from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './LMap.css';

/**
 * Primary UI component for user interaction
 */
export const LMap = ({ primary, backgroundColor, size, label, ...props }) => {
  const mode = primary ? 'storybook-LMap--primary' : 'storybook-LMap--secondary';
  return (
      <MapContainer center={[45.4, -75.7]} zoom={12}scrollWheelZoom={false}>
        <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>  );
};

LMap.propTypes = {
};

LMap.defaultProps = {
};

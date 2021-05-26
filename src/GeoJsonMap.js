// @flow
import { useState } from 'react';
import { MapContainer } from 'react-leaflet';

import ApnFinder from './ApnFinder';
import ApnMap from './ApnMap';
import initParcelInfo from './assets/emptymap.js';


function Main () {

  const [mapCenter, setMapCenter] = useState({lat: 37.975438, lng: -121.274070});
  const [mapZoom, setMapZoom] = useState(12);
  const [parcelInfo, setParcelInfo] = useState({...initParcelInfo});

  const updateParcel = function (data) {
    const coords = parsePolygon(data.geometry);
    setMapCenter({
      lat: coords[0][1],
      lng: coords[0][0]
    });
    setMapZoom(17);

    setParcelInfo(parcelInfo => {
      const features = [{
        type: 'Feature',
        properties: data,
        geometry: {
          type: 'Polygon',
          coordinates: [coords]
        }
      }];

      return {...parcelInfo, features};
    });

  };

  const parsePolygon = function (geometryStr) {
    if (geometryStr.indexOf('POLYGON((') === 0) {
      geometryStr = geometryStr.slice('POLYGON(('.length);
    }
    if (geometryStr.indexOf('))') === (geometryStr.length - 2)) {
      geometryStr = geometryStr.slice(0, -2);
    }

    return geometryStr.split(',').map(coordSet => coordSet.split(' ').map(val => Number(val.trim())));
  };

  const position = [37.975438, -121.274070];
  return (
    <div style={{width: '100%'}}>
      <MapContainer center={position} zoom={12} style={{minHeight: '44rem'}}>
        <ApnMap mapCenter={mapCenter} mapZoom={mapZoom} parcelInfo={parcelInfo} />
      </MapContainer>
      <ApnFinder apnFound={updateParcel} />
    </div>
  );

};

export default function GeoJsonMap(props) {
  return (
    <Main {...props} />
  );
};

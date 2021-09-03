// @flow
import { useState } from 'react';
import { MapContainer } from 'react-leaflet';

import ApnFinder from './ApnFinder';
import MapRefresh from './MapRefresh';
import ApnMap from './ApnMap';
import initParcelInfo from './assets/emptymap.js';


function Main (props) {

  const [mapCenter, setMapCenter] = useState({lat: 37.975438, lng: -121.274070});
  const [mapZoom, setMapZoom] = useState(12);
  const [mapBounds, setMapBounds] = useState([[37.995438, -121.174070], [37.905438, -121.294070]]);
  const [parcelInfo, setParcelInfo] = useState({...initParcelInfo});
  const [apnList, setApnList] = useState([]);

  const updateParcel = function (data) {
    const coords = data ? parsePolygon(data.geometry) : [[-121.274070, 37.975438]];
    setMapCenter({
      lat: coords[0][1],
      lng: coords[0][0]
    });

    let maxLat = -1 * Number.MAX_VALUE;
    let minLat = Number.MAX_VALUE
    let maxLon = -1 * Number.MAX_VALUE;
    let minLon = Number.MAX_VALUE;
    for (let i = 0; i < coords.length; i++) {
      const lon = coords[i][0];
      const lat = coords[i][1];

      if (lon > maxLon) maxLon = lon;
      if (lon < minLon) minLon = lon;
      if (lat > maxLat) maxLat = lat;
      if (lat < minLat) minLat = lat;
    }
    setMapBounds([[maxLat, maxLon], [minLat, minLon]])

    setParcelInfo(parcelInfo => {
      const features = data ? [{
        type: 'Feature',
        properties: data,
        geometry: {
          type: 'Polygon',
          coordinates: [coords]
        }
      }] : [];

      return {...parcelInfo, features};
    });

  };

  const refreshApnList = function (data) {
    //console.log(JSON.stringify(data, null, 4));
    const features = [];
    let maxLat = -1 * Number.MAX_VALUE;
    let minLat = Number.MAX_VALUE
    let maxLon = -1 * Number.MAX_VALUE;
    let minLon = Number.MAX_VALUE;

    for (let i = 0; i < data.length; i++) {
      const claim = data[i];
      const coords = parsePolygon(claim.geometry);
      for (let j = 0; j < coords.length; j++) {
        const lon = coords[j][0];
        const lat = coords[j][1];

        if (lon > maxLon) maxLon = lon;
        if (lon < minLon) minLon = lon;
        if (lat > maxLat) maxLat = lat;
        if (lat < minLat) minLat = lat;
      }

      features.push({
        type: 'Feature',
        properties: claim,
        geometry: {
          type: 'Polygon',
          coordinates: [coords]
        }
      });
    }

    setMapBounds([[maxLat, maxLon], [minLat, minLon]]);

    setParcelInfo(parcelInfo => {
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
      <MapRefresh apnListFound={refreshApnList} apnList={apnList} accountAddress={props.accountAddress} />
      <MapContainer center={position} zoom={12} style={{minHeight: '44rem'}}>
        <ApnMap mapCenter={mapCenter} mapZoom={mapZoom} mapBounds={mapBounds} parcelInfo={parcelInfo} />
      </MapContainer>
      <ApnFinder apnFound={ updateParcel } {...props} />
    </div>
  );

};

export default function GeoJsonMap(props) {
  return (
    <Main {...props} />
  );
};

import { useState, useEffect } from 'react';
import { TileLayer, GeoJSON, useMap } from 'react-leaflet';


function Main({ mapCenter, mapZoom, mapBounds, parcelInfo }) {
  const map = useMap();

  const [triggerGeoReRender, setTriggerGeoReRender] = useState(1);

  useEffect(function () {
    map.setView(mapCenter, mapZoom);
  }, [mapCenter, mapZoom]);
  useEffect(function () {
    map.fitBounds(mapBounds);
  }, [mapBounds]);
  useEffect(function () {
    console.log(parcelInfo);
    setTriggerGeoReRender(triggerGeoReRender + 1);
  }, [parcelInfo]);

  function geoJSONStyle(feature) {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: feature.properties && feature.properties.owner ? '#2450ff' : '#999999',
    };
  }

  function onEachFeature(feature: Object, layer: Object) {
    const popupContent = `
    <div style="width:1000px;overflow-wrap:auto;white-space: nowrap;">
    <b>Basin Logix Plot Information</b>
    <pre><b>APN</b>: <br />${feature.properties.apn}</pre>
    <pre><b>Crop</b>: <br />${feature.properties.crop2016}</pre>
    <pre><b>GSA</b>: <br />${feature.properties.agency_name}</pre>
    <pre><b>County</b>: <br />${feature.properties.county}</pre>
    <pre><b>Area Acres</b>: <br />${feature.properties.acres}</pre>
    <pre><b>Geometric Area</b>: <br />${feature.properties.shape_area}</pre>`
    layer.bindPopup(popupContent);
  }

  return (
    <div>
      <TileLayer
        attribution='2021 Google Maps'
        url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
      />
      <GeoJSON
        key={triggerGeoReRender}
        data={parcelInfo}
        style={geoJSONStyle}
        onEachFeature={onEachFeature}
      />
    </div>
  );
};

export default function ApnMap(props) {
  return (
    <Main {...props} />
  );
};

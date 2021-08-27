import { useState, useEffect } from 'react';
import { TileLayer, GeoJSON, useMap } from 'react-leaflet';


function Main({ mapCenter, mapZoom, parcelInfo }) {
  const map = useMap();

  const [triggerGeoReRender, setTriggerGeoReRender] = useState(1);

  useEffect(function () {
    map.setView(mapCenter, mapZoom);
  }, [mapCenter, mapZoom]);
  useEffect(function () {
    console.log(parcelInfo);
    setTriggerGeoReRender(triggerGeoReRender + 1);
  }, [parcelInfo]);

  function geoJSONStyle() {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.8,
      fillColor: '#ff0000',
    };
  }

  function onEachFeature(feature: Object, layer: Object) {
    const popupContent = `<p>ApnToken Information</p>
    <pre>Assessor's Parcel Number: <br />${feature.properties.apn}</pre>
    <pre>Shape Area: <br />${feature.properties.shape_area}</pre>
    <pre>Agency Name: <br />${feature.properties.agency_name}</pre>
    <pre>Agency Unique ID: <br />${feature.properties.agency_unique_id}</pre>
    <pre>County: <br />${feature.properties.county}</pre>
    <pre>Acres: <br />${feature.properties.acres}</pre>
    <pre>Crop 2016: <br />${feature.properties.crop2016}</pre>`
    layer.bindPopup(popupContent);
  }

  return (
    <div>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

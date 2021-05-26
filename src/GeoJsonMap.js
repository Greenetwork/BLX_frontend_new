// @flow

import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { MapContainer as Map, TileLayer, GeoJSON } from 'react-leaflet';

import ApnFinder from './ApnFinder';
import parcel_info from './assets/18102019.json';


export default class geoJSON extends Component<{}, State> {
  state = {
    lat: 37.975438, 
    lng: -121.274070,
    zoom: 12,
  }

  geoJSONStyle() {
    return {
      color: '#1f2021',
      weight: 1,
      fillOpacity: 0.5,
      fillColor: '#fff2af',
    }
  }

  onEachFeature(feature: Object, layer: Object) {
    const popupContent = ` <Popup><p>ApnToken Information</p><pre>Assessor's Parcel Number: <br />${feature.properties.apn}</pre>
    <pre>Parcel Area: <br />${feature.properties.shape_area}</pre>
    <pre>Parcel Area: <br />${feature.properties.agencyname}</pre>
    <pre>Parcel Area: <br />${feature.properties.agencyuniqueid}</pre>
    <pre>Parcel Area: <br />${feature.properties.county}</pre>
    <pre>Parcel Area: <br />${feature.properties.acres}</pre>
    <pre>Parcel Area: <br />${feature.properties.crop2016}</pre></Popup>`
    layer.bindPopup(popupContent)
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <div style={{width: '100%'}}>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={parcel_info}
            style={this.geoJSONStyle}
            onEachFeature={this.onEachFeature}
          />
        </Map>
        <Grid.Row>
          <ApnFinder />
        </Grid.Row>
      </div>
    )
  }
};

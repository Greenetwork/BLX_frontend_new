import React from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

const LeafletMap = () => {
    const mapPositions = [11.123, 78.65];

    return(
        <Map 
            className = 'map'
            center= {[mapPositions[0], mapPositions[1]]}
            zoom= {5}
        >
            <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </Map>
    );
};

export default LeafletMap;

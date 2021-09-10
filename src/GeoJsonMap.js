// @flow
import { useState } from 'react';
import { MapContainer } from 'react-leaflet';
import { Grid, Radio } from 'semantic-ui-react';

import ApnFinder from './ApnFinder';
import ApnTable from './ApnTable';
import MapRefresh from './MapRefresh';
import ApnMap from './ApnMap';
import AllocationDistributor from './AllocationDistributor';
import initParcelInfo from './assets/emptymap.js';
import { useSubstrate } from './substrate-lib';


function Main (props) {
  const { api } = useSubstrate();

  const [mapCenter, setMapCenter] = useState({lat: 37.975438, lng: -121.274070});
  const [mapZoom, setMapZoom] = useState(12);
  const [mapBounds, setMapBounds] = useState([[37.995438, -121.174070], [37.905438, -121.294070]]);
  const [parcelInfo, setParcelInfo] = useState({...initParcelInfo});
  const [apnList, setApnList] = useState([]);
  const [apnStatusList, setApnStatusList] = useState([]);
  const [isRegulator, setIsRegulator] = useState(false);

  const regulatorViewChange = function (e, args) {
    setIsRegulator(!isRegulator);
  };

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

  const refreshApnList = async function (data) {
    //console.log(JSON.stringify(data, null, 4));

    // TODO: Not sure is we need this in state
    setApnList(data);

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

    const bounds = (maxLat < -180 || maxLon < -360 || minLat > 180 || minLon > 360) ?
    [
      [37.907506579631, -121.223565024536],
      [37.9296422893884, -121.038149460093]
    ] :
    [
      [maxLat, maxLon],
      [minLat, minLon]
    ];

    setMapBounds(bounds);

    setParcelInfo(parcelInfo => {
      return {...parcelInfo, features};
    });

    const uniqueApns = data.reduce((unique, datum) => {
      if (!datum.owner) return unique;

      const exists = unique.find(apn => apn.owner.apn === datum.owner.apn);
      if (exists) return unique;

      datum.coords = parsePolygon(datum.geometry);
      unique.push(datum);
      return unique;
    }, []);
    let statusList = [];
    try {
      for (let i = 0; i < uniqueApns.length; i++) {
        const datum = uniqueApns[i];
        if (!datum.owner) continue;
        const status = await api.query.allocator.balances(0, datum.owner.proxy);
        statusList.push({
          alloc: status.toHuman(),
          apn: datum.owner.apn,
          coords: datum.coords
        });
      }
    } catch (err) {
      console.log(err);
    }

    setApnStatusList(statusList)
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
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column floated='left'>
            <MapRefresh
              apnListFound={refreshApnList}
              accountAddress={props.accountAddress}
              isRegulator={isRegulator}
            />
          </Grid.Column>
          <Grid.Column floated='right'>
          {
            isRegulator ?
            <AllocationDistributor apnList={apnList} {...props}></AllocationDistributor> :
            ''
          }
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Grid>
        <Grid.Column width={12}>
          <MapContainer center={position} zoom={12} style={{minHeight: '44rem', width: '100%'}}>
            <ApnMap mapCenter={mapCenter} mapZoom={mapZoom} mapBounds={mapBounds} parcelInfo={parcelInfo} />
          </MapContainer>
        </Grid.Column>
        <Grid.Column width={4}>
          <Radio
            toggle
            label='Regulator View'
            checked={ isRegulator }
            onChange={ regulatorViewChange }
          />
          <ApnTable
            apnStatusList={apnStatusList}
            isRegulator={isRegulator}
            setMapBounds={setMapBounds}
            {...props}
          ></ApnTable>
        </Grid.Column>
      </Grid>
      <ApnFinder apnFound={ updateParcel } {...props} />
    </div>
  );

};

export default function GeoJsonMap(props) {
  return (
    <Main {...props} />
  );
};

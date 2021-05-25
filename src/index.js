import React from 'react';
import ReactDOM from 'react-dom';

import 'leaflet/dist/leaflet.css'
import LeafletMap from './LeafletMap.js'

import App from './App';

ReactDOM.render(
  <App>
    <LeafletMap />
  </App>,
  document.getElementById('root')
);

// ReactDOM.render(<App />,
//   document.getElementById('root')
// );

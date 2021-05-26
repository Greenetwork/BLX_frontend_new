import { useState } from 'react';
import { Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { base64ToArray } from './helpers.js';


function Main (props) {
  const apnData = props.apnData;
  const [status, setStatus] = useState(null);

  const formatResults = function (apnData) {
    if (apnData === void 0) apnData = null;

    return JSON.stringify(apnData, null, 2);
  };

  return (
    <Grid.Column width={4}>
      <h1>APN Results</h1>
      { apnData
        ? <TxButton
          label='Claim This APN'
          type='SIGNED-TX'
          color='blue'
          interxType='EXTRINSIC'
          setStatus={setStatus}
          attrs={{
            palletRpc: 'claimer',
            callable: 'createApnAccount',
            inputParams: [
              {type: 'ProxyType', value: 'Any'},
              {type: 'BlockNumber', value: '0'},
              {type: 'u16', value: '0'},
              {type: '[u8;32]', value: base64ToArray(apnData.apn)}
            ],
            paramFields: [
              {name: 'proxy_type', type: 'ProxyType', optional: false},
              {name: 'delay', type: 'BlockNumber', optional: false},
              {name: 'index', type: 'u16', optional: false},
              {name: 'apn_value', type: '[u8;32]', optional: false}
            ]
          }}
          {...props}
        />
        : null
      }
      <div key={ apnData }>
        <pre>
          { formatResults(apnData) }
        </pre>
      </div>
    </Grid.Column>
  );
}

export default function ApnConfirmer (props) {
  return (
    <Main {...props} />
  );
};

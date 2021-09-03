import { useState, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { encodeApn } from './helpers.js';

const initInputParams = [
  {type: 'ProxyType', value: 'Any'},
  {type: 'BlockNumber', value: '0'},
  {type: 'u16', value: '0'},
  {type: '[u8;32]', value: ''}
];

function Main (props) {
  const apnData = props.apnData;
  const [status, setStatus] = useState(null);

  const [inputParams, setInputParams] = useState([...initInputParams]);

  useEffect(function () {
    if (!apnData) return;

    const inputParams = [...initInputParams];
    const val = apnData.apn && apnData.apn.toString();
    inputParams[3].value = val && encodeApn(val);
    setInputParams(inputParams);
  }, [apnData]);

  const formatResults = function (apnData) {
    if (apnData === void 0) apnData = null;

    return JSON.stringify(apnData, null, 2);
  };

  return (
    <Grid.Column width={4}>
      <h1>APN Results</h1>
      { (apnData && apnData.apn)
      ? <TxButton
        label='Claim This APN'
        type='SIGNED-TX'
        color='blue'
        setStatus={setStatus}
        attrs={{
          palletRpc: 'claimer',
          callable: 'createApnAccount',
          inputParams: inputParams,
          interxType: 'EXTRINSIC',
          paramFields: [
            {name: 'proxy_type', type: 'ProxyType', optional: false},
            {name: 'delay', type: 'BlockNumber', optional: false},
            {name: 'index', type: 'u8', optional: false},
            {name: 'apn_value', type: '[u8;32]', optional: false}
          ]
        }}
        {...props}
      />
      : null }
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

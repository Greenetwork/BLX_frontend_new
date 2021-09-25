import { useState } from 'react';
import { Grid, Form, Button } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { useSubstrate } from './substrate-lib';
import { encodeApn } from './helpers.js';

function Main (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);

  const proxies = props.apnList.reduce((unique, datum) => {
    if (!datum.owner) return unique;

    const exists = unique.find(apn => apn.owner.apn === datum.owner.apn);
    if (exists) return unique;

    unique.push(datum);
    return unique;
  }, []).map(apn => {
    return apn.owner && apn.owner.proxy;
  }).filter(p => p);

  return (
    <Grid.Row width={8}>
      <Grid.Column width={4}>
        <TxButton
          label='Distribute Allocation'
          type='SIGNED-TX'
          color='blue'
          style={{
          position: 'absolute',
          right: 1,
          top: 1,
          }}
          setStatus={setStatus}
          attrs={{
            palletRpc: 'allocator',
            callable: 'issueTokenAirdrop',
            inputParams: [
              {type: 'Vec<AccountId>', value: proxies.join(',')},
              {type: 'Balance1', value: '100'}
            ],
            interxType: 'EXTRINSIC',
            paramFields: [
              {type: 'Vec<AccountId>', name: 'apn', optional: false},
              {type: 'Balance1', name: 'atokens', optional: false}
            ]
          }}
          {...props}
        />
      </Grid.Column>
    </Grid.Row>
  );
}

export default function MapRefresh (props) {
  return (
    <Main {...props}/>
  );
}

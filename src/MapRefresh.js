import { useState } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import ApnConfirmer from './ApnConfirmer';
import { useSubstrate } from './substrate-lib';
import { codec } from '@polkadot/types';
import { u8aToHex, u8aToString } from '@polkadot/util';

function Main (props) {
  const [apnList, setApnList] = useState('');
  const { api } = useSubstrate();

  const hex_to_string = function (metadata) {
    return metadata.match(/.{1,2}/g).map(function(v){
      return String.fromCharCode(parseInt(v, 16));
    }).join('');
  };

  const handleSubmit = async function () {

    const prefix = '0x2df95c7f7f0d67daa549602785d7beae891ad457bf4da54990fa84a2acb148a2';
    const lookupRes = await api.rpc.state.getKeysPaged(prefix, 1000);

    console.log('Calling RPC with `getKeys(0)`, got response: ');
    console.log(lookupRes.map(val => {
      val = val.toHex();

      const account = val.slice(prefix.length, val.length - 64);
      const apn = val.slice(-64);

      const address = keyring.decodeAddress(`0x${account}`);

      const decoded = account.match(/.{1,2}/g).map(function(v){
        return String.fromCharCode(parseInt(v, 16));
      }).join('');

      return {apn, account, address, decoded};
    }));
    // TODO: use `props.accountAddress` to find the apnList we want to query
    console.log(props.accountAddress);

    const res = await fetch('/apn/list/' + props.apnList.join(','));

    if (res.ok) {
      const data = await res.json();

      if (typeof props.apnListFound === 'function') {
        // props.apnListFound(data);
      }
    } else {
      alert('could not find APN list');
    }
  };

  return (
    <Grid.Row width={8}>
      <Grid.Column width={4}>
        <Form onSubmit={handleSubmit}>
          <Button type='submit'>Refresh</Button>
        </Form>
      </Grid.Column>
    </Grid.Row>
  );
}

export default function MapRefresh (props) {
  return (
    <Main {...props}/>
  );
}

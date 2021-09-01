import { useState } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import ApnConfirmer from './ApnConfirmer';
import { useSubstrate } from './substrate-lib';
import { codec } from '@polkadot/types';
import { u8aToHex, u8aToString } from '@polkadot/util';

function Main (props) {
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
    console.log(await Promise.all(lookupRes.map(async val => {
      val = val.toHex();

      //const account = val.slice(prefix.length, val.length - 64); // this is the blake2 128 hash of the apn_account (cant unhash, useless to us AFAIK)

      // Need to feed the chain a new version of apn (without 3s and with values of interest at the end) https://basin-logix.atlassian.net/browse/BL2-65?focusedCommentId=10040 
      const apn = val.slice(-64); // apn is also the MultiAddress:Address32 variant of the apn_account 

      // ----------pseduo code start ---------------
      // const apn_account = claimer.lookup(`0x${apn}`); https://basin-logix.atlassian.net/browse/BL2-65?focusedCommentId=10036
      // apn_number = apn with leading 0s removed. 
      // ----------pseduo code end ---------------
      const account = await api.query.claimer.lookup(`0x${apn}`);

      //const address = keyring.decodeAddress(`0x${account}`); // this will disappear

      /*const decoded = account.match(/.{1,2}/g).map(function(v){ // this will disappear
        return String.fromCharCode(parseInt(v, 16));
      }).join('');*/

      return {apn, account: account.toHuman()};
    })));
    // TODO: use `props.accountAddress` to find the apnList we want to query
    console.log(props.accountAddress);

    const res = await fetch('/apn/list/' + props.apnList.join(','));

    if (res.ok) {
      const data = await res.json();

      if (typeof props.apnListFound === 'function') {
        props.apnListFound(data);
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

import { useState, useEffect } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import ApnConfirmer from './ApnConfirmer';
import { useSubstrate } from './substrate-lib';
import { codec } from '@polkadot/types';
import { u8aToHex, u8aToString } from '@polkadot/util';
import { decodeApn } from './helpers.js';

function Main (props) {
  const { api } = useSubstrate();

  useEffect(() => {
    handleSubmit()
  }, [props.isRegulator, props.accountAddress]);

  const handleSubmit = async function () {

    const prefix = '0x2df95c7f7f0d67daa549602785d7beae891ad457bf4da54990fa84a2acb148a2';
    const lookupRes = await api.rpc.state.getKeysPaged(prefix, 1000);
    //const lookupRes = await api.query.claimer.proxies('0x');

    console.log('Calling RPC with `getKeys(0)`, got response: ');
    const ownerMap = await Promise.all(lookupRes.map(async val => {
      val = val.toHex();

      // Need to feed the chain a new version of apn (without 3s and with values of interest at the end) https://basin-logix.atlassian.net/browse/BL2-65?focusedCommentId=10040 
      // TODO: values are at the end, but the 3s are still present
      const apn = val.slice(-64); // apn is also the MultiAddress:Address32 variant of the apn_account

      const proxyId = await api.query.claimer.lookup(`0x${apn}`);
      const accountInfo = await api.query.claimer.proxies(proxyId.toHuman());

      const delegateInfo = accountInfo[0] && accountInfo[0].toHuman();
      const delegateId = delegateInfo && delegateInfo[0] && delegateInfo[0].delegate;

      return {apn: decodeApn(apn), owner: delegateId, proxy: proxyId.toHuman()};
    }));

    const apnList = ownerMap.map(ownership => ownership.apn);

    if (!(apnList && apnList.length)) return;
    const res = await fetch('/apn/list/' + apnList.join(','));

    if (res.ok) {
      const data = await res.json();

      if (typeof props.apnListFound === 'function') {
        props.apnListFound(data.map(dbData => {
          const owner = ownerMap.find(owner => {
            // use `props.accountAddress` to find the apnList we want to query, unless we are using regulator view
            return (props.isRegulator || owner.owner === props.accountAddress) && owner.apn === dbData.apn_chr;
          });
          if (owner) dbData.owner = owner;

          return dbData;
        }));
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Button type='submit'>Refresh</Button>
    </Form>
  );
}

export default function MapRefresh (props) {
  return (
    <Main {...props}/>
  );
}

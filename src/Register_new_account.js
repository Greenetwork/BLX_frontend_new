import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Label, Icon } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { encodeApn, base64ToArray } from './helpers.js';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ addressFrom: null, addressTo: null, amount: 0 });
  const { accountPair } = props;
  // const { setAccountAddress } = props;


  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
    setAddressFromEncoded(encodeApn(addressFrom, true));
    setAddressToEncoded(addressTo);
  };

  const { apiState, keyring, keyringState, apiError } = useSubstrate();

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';


  const accountPair1 =
  initialAddress &&
  keyringState === 'READY' &&
  keyring.getPair(initialAddress);

  // useEffect(() => {
  //   setAccountAddress(initialAddress);
  //   setAccountSelected(initialAddress);
  // }, [setAccountAddress, initialAddress]);

  if(!accountPair) return null;
  return (
    <Grid.Column width={8}>
      <h1>Register New Account</h1>
      <Form>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair1}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'balances',
              callable: 'transfer',
              inputParams: [
                accountPair.address,  // issue here with accountPair being null on init. it doesnt like this. 
                1000000000000000
              ],
              interxType: 'EXTRINSIC',
              paramFields: [
                true, true
              ]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

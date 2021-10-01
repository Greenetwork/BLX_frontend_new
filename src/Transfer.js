import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Label, Icon } from 'semantic-ui-react';
import { TxButton } from './substrate-lib/components';
import { encodeApn } from './helpers.js';


export default function Main (props) {
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ addressTo: null, amount: 0 });
  const { accountPair } = props;

  const onChange = (_, data) => {
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
    setAddressFromEncoded(encodeApn(addressFrom));
    setAddressToEncoded(encodeApn(addressTo));
  };

  const [addressFromEncoded, setAddressFromEncoded] = useState('');
  const [addressToEncoded, setAddressToEncoded] = useState('');

  const { addressFrom, addressTo, amount } = formState;

  return (
    <Grid.Column width={8}>
      <h1>Water Transfer</h1>
      <Form>
        <Form.Field>
          <Input
            fluid
            label='From'
            type='text'
            placeholder='address'
            state='addressFrom'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='To'
            type='text'
            placeholder='address'
            state='addressTo'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Amount'
            type='number'
            state='amount'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'allocator',
              callable: 'tradeTokens',
              inputParams: ['0', addressFromEncoded, addressToEncoded, amount],
              paramFields: [true, true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

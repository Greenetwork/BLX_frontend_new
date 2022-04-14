import React, { useState, useEffect } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  Menu,
  Button,
  Dropdown,
  Container,
  Icon,
  Image,
  Label
} from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user'
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);


  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  return (
    <Menu
      attached='top'
      tabular
      style={{
        backgroundColor: '#fdf7f2',
        borderColor: '#000000',
        paddingTop: '0.5em',
        paddingBottom: '0.5em'
      }}
    >
      <Container>
        <Menu.Menu>
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://basinlogix.com'
          >
            {/* <Image src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`} size='mini' /> */}
            <Image src={`${process.env.PUBLIC_URL}/assets/basinlogix_full_logo_transparent1.png`} size='medium' />
          </a>

        </Menu.Menu>
        <Menu.Menu position='right' style={{ alignItems: 'center' }}>
          { !accountSelected
            ? <span>
              Add your account with the{' '}
              <a
                target='_blank'
                rel='noopener noreferrer'
                href='https://github.com/polkadot-js/extension'
              >
                Polkadot JS Extension
              </a>
            </span>
            : null }
          <CopyToClipboard text={accountSelected}>
            <Button
              basic
              circular
              size='large'
              icon='user'
              color={accountSelected ? 'green' : 'red'}
            />
          </CopyToClipboard>
          <Dropdown
            search
            selection
            clearable
            placeholder='Select an account'
            options={keyringOptions}
            onChange={(_, dropdown) => {
              onChange(dropdown.value);
            }}
            value={accountSelected}
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

function BalanceAnnotation (props) {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState(0);

  // When account address changes, update subscriptions
  useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected &&
      api.query.system.account(accountSelected, balance => {
        setAccountBalance(balance.data.free.toHuman());
      })
        .then(unsub => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountSelected]);

  return accountSelected
    ? <Label pointing='left'>
        <Icon name='tint' color='blue' />
        {/* // maybe switch to asset balance */}
        {accountBalance} 
      </Label>
    : null;
}

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}

import React, { useState, createRef } from 'react';
import { Container, Dimmer, Divider, Loader, Grid, Sticky, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import AccountSelector from './AccountSelector';
import Balances from './Balances';
import BlockNumber from './BlockNumber';
import Events from './Events';
import Interactor from './Interactor';
import Metadata from './Metadata';
import NodeInfo from './NodeInfo';
import TemplateModule from './TemplateModule';
import Transfer from './Transfer';
//import Upgrade from './Upgrade';
import { ApnTokenInfo } from './ApnTokenInfo';
import LeafletMap from './LeafletMap';
import GeoJsonMap from './GeoJsonMap';

import Register_new_account from './Register_new_account';


function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${err}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();
  //const position = [this.state.lat, this.state.lng]
  const position = [51.505, -0.09]

document.body.style = 'background: #fdf7f2;';


  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <AccountSelector setAccountAddress={setAccountAddress} />
      </Sticky>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row>
            <GeoJsonMap accountPair={accountPair} accountAddress={accountAddress} />
          </Grid.Row>
          <div style={{width: '100%', minHeight: '10rem', marginTop: '2rem'}}>
            <Grid.Row>
              <Events />
            </Grid.Row>
          </div>
          {/* <div style={{width: '100%'}}>
            <Grid.Row>
              <Interactor accountPair={accountPair} />
            </Grid.Row>
          </div>
          <Grid.Row>
            <TemplateModule accountPair={accountPair} />
          </Grid.Row> */}
          <Grid.Row>
            <Register_new_account accountPair={accountPair} />
          </Grid.Row>
          {/* <Grid.Row stretched> */}
          {/* <Grid.Row>
            <Balances accountPair={accountPair} />
          </Grid.Row> */}
        </Grid>
      </Container>
      <Divider />
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
        </Grid>
      </Container>

      <DeveloperConsole />
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}

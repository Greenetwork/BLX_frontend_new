import { useState } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import ApnConfirmer from './ApnConfirmer';
import { encodeApnHuman, encodeApn } from './helpers.js';

function Main (props) {
    const { api } = useSubstrate();
    const [apn, setApn] = useState('');
    const [apnData, setApnData] = useState({});

    const handleSubmit = async function () {

      //check the single apn search to return null to fire error
      const res1 = await fetch('/apn/' + apn);
      const data1 = await res1.json();

      const res = await fetch('/apn/list/' + apn);
      const data = await res.json();

      if (res.ok && data
         && res1.ok && data1 //check the single apn search to return null to fire error

         ) {
        const apnEnc = '0x' + encodeApnHuman(data[0].apn);

        let delegateId;
        try {
          const proxyId = await api.query.claimer.lookup(apnEnc);
          console.log(proxyId.toHuman());
          const accountInfo = await api.query.claimer.proxies(proxyId.toHuman());
          const delegateInfo = accountInfo[0] && accountInfo[0].toHuman();
          delegateId = delegateInfo && delegateInfo[0] && delegateInfo[0].delegate;
        } catch (err) {
          // if we get here the proxy lookup failed, which usually means the apn hasn't been claimed
          // this isn't an issue so we catch the error and move on
          console.log(err);
        }

        if (delegateId === props.accountAddress) data.owner = true;

        setApnData(data[0]);

        if (typeof props.apnFound === 'function') {
          props.apnFound(data);
        }
      } else {
        alert('could not find APN');
      }
    };

    const apnChange = function (ev, data) {
      setApn(data.value);
    };

    return (
      <Grid.Row width={8}>
        <Grid.Column width={4}>
          <h1>APN Search</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                placeholder='Assessor Parcel Number (APN)'
                fluid
                type='text'
                style={{paddingBottom: '10px'}}
                state={ apn }
                value={ apn }
                onChange={ apnChange }
              />
              <Grid>
                <Grid.Column floated='left' width={8}>
                  <Button type='submit' style={{width: '100%'}}>Search</Button>
                </Grid.Column>
                <Grid.Column floated='right' width={8}>
                  <ApnConfirmer style={{width: '100%'}} key={ apn } apnData={ apnData } {...props} />
                </Grid.Column>
              </Grid>
            </Form.Field>
          </Form>
        </Grid.Column>
      </Grid.Row>
    );
}

export default function ApnFinder (props) {
  return (
    <Main {...props}/>
  );
}

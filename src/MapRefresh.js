import { useState } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import ApnConfirmer from './ApnConfirmer';
import { useSubstrate } from './substrate-lib';


function Main (props) {
    const [apnList, setApnList] = useState('');
    const { api } = useSubstrate();

    const handleSubmit = async function () {
      const claimerLookupRes = await api.query['claimer']['lookup']([]);

      console.log('Calling Query Pallet `claimer.lookup` with no params, got response: ' + claimerLookupRes.toString());
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

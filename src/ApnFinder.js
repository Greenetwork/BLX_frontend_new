import { useState } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import ApnConfirmer from './ApnConfirmer';

function Main (props) {
    const [apn, setApn] = useState('');
    const [apnData, setApnData] = useState('');

    const handleSubmit = async function () {
      const res = await fetch('/apn/' + apn);

      if (res.ok) {
        const data = await res.json();

        setApnData(data);
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
          <h1>Search for APN</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Input
                placeholder='APN Value'
                fluid
                type='text'
                state={ apn }
                value={ apn }
                onChange={ apnChange }
              />
            </Form.Field>
            <Button type='submit'>Search</Button>
          </Form>
        </Grid.Column>
        <Grid.Column width={4}>
          <ApnConfirmer apnData={ apnData } {...props} />
        </Grid.Column>
      </Grid.Row>
    );
}

export default function ApnFinder (props) {
  return (
    <Main {...props}/>
  );
}

import { useState } from 'react';
import { Grid, Form, Input, Button } from 'semantic-ui-react';
import ApnConfirmer from './ApnConfirmer';

function Main (props) {
    const [apnList, setApnList] = useState('');

    const handleSubmit = async function () {

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

export default function ApnFinder (props) {
  return (
    <Main {...props}/>
  );
}

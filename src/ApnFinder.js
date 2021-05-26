import { useState } from 'react';
import { Grid, Form, Dropdown, Input, Label } from 'semantic-ui-react';

function Main (props) {
    const [apn, setApn] = useState('');

    const handleSubmit = async function () {
      console.log(apn);

      const res = await fetch('/apn/' + apn);

      if (res.ok) {
        const data = await res.json();
        console.log(data);
      }
    };

    const apnChange = function (ev, data) {
      setApn(data.value);
    };

    return (
      <Grid.Column width={8}>
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
            <Label
              basic
              pointing
              color='teal'
              content = 'APN'
            />
          </Form.Field>
        </Form>
      </Grid.Column>
    );
}

export default function ApnFinder () {
  return (
    <Main />
  );
}

import React, { useEffect, useState } from 'react';
import { Grid, Modal, Button, Card } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  const [metadata, setMetadata] = useState({ data: null, version: null });

  useEffect(() => {
    const getMetadata = async () => {
      try {
        const data = await api.rpc.state.getMetadata();
        setMetadata({ data, version: data.version });
      } catch (e) {
        console.error(e);
      }
    };
    getMetadata();
  }, [api.rpc.state]);

  return (
    <Grid.Column>
      <div style={{display: 'inline'}}>
        <b>Metadata: </b>{'v' + metadata.version + ' '}
        <Modal trigger={<Button compact  circular icon='settings' size='mini' />}>
          <Modal.Header>Runtime Metadata</Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              <pre>
                <code>{JSON.stringify(metadata.data, null, 2)}</code>
              </pre>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    </Grid.Column>
  );
}

export default function Metadata (props) {
  const { api } = useSubstrate();
  return api.rpc && api.rpc.state && api.rpc.state.getMetadata
    ? <Main {...props} />
    : null;
}

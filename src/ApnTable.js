import { useState, useEffect } from 'react';
import { Table, Image } from 'semantic-ui-react';


function Main(props) {
  const rows = props.apnStatusList.map(status => {
    return (
      <Table.Row key={status.apn}>
        <Table.Cell>
          { status.apn }
        </Table.Cell>
        <Table.Cell>
          {
            !props.isRegulator ? status.alloc :
            status.alloc < 10 ? 
              <Image src={`${process.env.PUBLIC_URL}/assets/red-cross-mark.png`} height="19" /> :
              <Image src={`${process.env.PUBLIC_URL}/assets/white-green-check.svg`} height="19" />
          }
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>APN</Table.HeaderCell>
          <Table.HeaderCell>{ props.isRegulator ? 'Compliant' : 'Allocation (ACFT)'}</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        { rows }
      </Table.Body>
    </Table>
  );
};

export default function ApnTable(props) {
  return (
    <Main {...props} />
  );
};

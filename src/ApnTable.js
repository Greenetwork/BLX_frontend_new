import { useState, useEffect } from 'react';
import { Table } from 'semantic-ui-react';


function Main(props) {

  const rows = props.apnStatusList.map(status => {
    return (
      <Table.Row key={status.apn}>
        <Table.Cell>
          { status.apn }
        </Table.Cell>
        <Table.Cell>
          { status.alloc }
        </Table.Cell>
      </Table.Row>
    );
  });

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>APN</Table.HeaderCell>
          <Table.HeaderCell>Allocation (ACFT)</Table.HeaderCell>
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

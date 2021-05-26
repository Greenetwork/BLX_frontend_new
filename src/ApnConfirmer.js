import { Grid } from 'semantic-ui-react';

function Main ({ apnData }) {

    const formatResults = function (apnData) {
      if (apnData === void 0) apnData = null;

      return JSON.stringify(apnData, null, 2);
    };

    return (
      <Grid.Column width={4}>
        <h1>APN Results</h1>
        <div key={ apnData }>
          <pre>
            { formatResults(apnData) }
          </pre>
        </div>
      </Grid.Column>
    );
}

export default function ApnConfirmer (props) {
  return (
    <Main {...props} />
  );
};

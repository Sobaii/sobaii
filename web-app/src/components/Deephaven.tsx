import React, { useState } from 'react';
import { Grid, MockGridModel } from '@deephaven/grid';

const GridQuadrillionExample = () => {
  const [model] = useState(
    () =>
      new MockGridModel({
        rowCount: Number.MAX_SAFE_INTEGER,
        columnCount: Number.MAX_SAFE_INTEGER,
        isEditable: true,
      })
  );

  return <Grid model={model} />;
};

export default GridQuadrillionExample;
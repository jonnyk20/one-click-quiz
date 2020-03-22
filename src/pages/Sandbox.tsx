import React from 'react';
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }: any) => <div style={style}>Row {index}</div>;

const Example = () => (
  <List height={150} itemCount={1000} itemSize={35} width={300}>
    {Row}
  </List>
);

const Sandbox = () => {
  return (
    <div className="sandbox container">
      <Example />
    </div>
  );
};

export default Sandbox;

import React from 'react';
import { Virtual } from "../dist/react-virtual-list.pro.esm";

const App = () => {
  return (
    <div>
      <p>react-virtual-list example</p>
      <Virtual dataSource={[{value: 'example1'}, {value: 'example2'}]} />
    </div>
  );
};

export default App;

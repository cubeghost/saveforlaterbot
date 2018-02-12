import React from 'react';
import Header from 'src/header';

const App = ({ children }) => {
  return (<div className="appRoot">
    <Header />
    {children}
  </div>)
};

export default App;

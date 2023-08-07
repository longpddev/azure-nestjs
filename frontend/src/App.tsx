import React from 'react';
import MainInput from './components/MainInput';
import BodyContent from './components/BodyContent';
import Overlay from './components/Overlay';


const App: React.FC = () => {
  return (
    <>
      <MainInput />
      <BodyContent />
      <Overlay />
    </>
  );
};

export default App;
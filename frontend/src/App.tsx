import React from 'react';
import MainInput from './components/MainInput';
import BodyContent from './components/BodyContent';
import Overlay from './components/Overlay';


const App: React.FC = () => {
  return (
    <>
      <h1 className='text-center text-4xl font-semibold mt-4'>AI extract docs</h1>
      <MainInput />
      <BodyContent />
      <Overlay />
    </>
  );
};

export default App;
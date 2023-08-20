import BodyContent from '../components/BodyContent';
import MainInput from '../components/MainInput';
import ModalAsk from '../components/ModalAsk';
import Overlay from '../components/Overlay';

const HomePage = () => {
  return (
    <>
      <h1 className="text-center text-4xl font-semibold mt-4">
        AI extract docs
      </h1>
      <MainInput />
      <BodyContent />
      <Overlay />
      <ModalAsk />
    </>
  );
};

export default HomePage;

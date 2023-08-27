import { LoadingOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Input } from 'antd';
import { useEnglishSentenceStore } from './store';

interface IAnswerCardProps {
  fetchAdvise: (question: string, answer: string) => Promise<string>;
}

const AnswerCard: React.FC<IAnswerCardProps> = ({ fetchAdvise }) => {
  const answer = useEnglishSentenceStore((state) => state.answer);
  const question = useEnglishSentenceStore((state) => state.question);
  const setEvaluate = useEnglishSentenceStore((state) => state.setEvaluate);
  const setAnswer = useEnglishSentenceStore((state) => state.setAnswer);
  const reset = useEnglishSentenceStore((state) => state.reset);
  const progress = useEnglishSentenceStore((state) => state.progress);
  const setProgress = useEnglishSentenceStore((state) => state.setProgress);
  const handleLoad = async () => {
    if (!question) return;
    reset(['evaluate']);
    setProgress({ evaluate: 'loading' });
    try {
      setEvaluate(await fetchAdvise(question.question, answer));
      setProgress({ evaluate: 'loaded' });
    } catch (e) {
      setProgress({ evaluate: 'error' });
      console.error(e);
      throw e;
    }
  };
  return (
    <AnswerCardView
      disabled={progress.question !== 'loaded'}
      value={answer}
      setValue={setAnswer}
      loading={progress.evaluate === 'loading'}
      load={handleLoad}
    />
  );
};

interface IAnswerCardViewProps {
  value: string;
  setValue: (s: string) => void;
  loading: boolean;
  load: () => void | Promise<void>;
  disabled: boolean;
}

const AnswerCardView: React.FC<IAnswerCardViewProps> = ({
  value,
  setValue,
  load,
  loading,
  disabled,
}) => {
  const Send = () => (
    <Button
      shape="circle"
      className="flex items-center justify-center ml-auto mr-4"
      onClick={load}
      disabled={disabled || loading || value.trim().length === 0}
    >
      {loading ? (
        <LoadingOutlined></LoadingOutlined>
      ) : (
        <SendOutlined></SendOutlined>
      )}
    </Button>
  );
  return (
    <Card title="Answer" actions={[<Send />]} bodyStyle={{ padding: 16 }}>
      <Input.TextArea
        autoSize={{ minRows: 3, maxRows: 10 }}
        disabled={loading || disabled}
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
      />
    </Card>
  );
};

export default AnswerCard;

import { Button, Card } from 'antd';
import Markdown from '../../components/Markdown/Markdown';
import { DoubleRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEnglishSentenceStore } from './store';
import { WritingQuestionAnswer } from '../../interfaces';

interface IAdviseCardProps {
  submit: (data: WritingQuestionAnswer) => Promise<unknown>;
}

const AdviseCard: React.FC<IAdviseCardProps> = ({ submit }) => {
  const evaluate = useEnglishSentenceStore((state) => state.evaluate);
  const answer = useEnglishSentenceStore((state) => state.answer);
  const question = useEnglishSentenceStore((state) => state.question);
  const progress = useEnglishSentenceStore((state) => state.progress);
  const reset = useEnglishSentenceStore((state) => state.reset);
  const setProgress = useEnglishSentenceStore((state) => state.setProgress);
  const handleSubmit = async () => {
    if (!question) return;
    if (answer.trim().length === 0) return;
    if (progress.evaluate !== 'loaded') return;
    setProgress({ answer: 'submit' });
    try {
      await submit({
        question: question.question,
        answer,
        words: question.words.map((item) => item.id),
        tense: question.tense,
      });
      reset(['answer', 'evaluate', 'question']);
    } catch (e) {
      console.error(e);
      setProgress({ answer: 'error' });
      throw e;
    }
  };
  return (
    <AdviseCardView
      submit={handleSubmit}
      loading={progress.answer === 'submit'}
      disabled={progress.question !== 'loaded' || answer.trim().length === 0}
    >
      {evaluate}
    </AdviseCardView>
  );
};

interface IAdviseCardViewProps {
  children: string;
  submit: () => void | Promise<void>;
  loading: boolean;
  disabled: boolean;
}

const AdviseCardView: React.FC<IAdviseCardViewProps> = ({
  children,
  submit,
  loading,
  disabled,
}) => {
  const Submit = () => (
    <Button
      shape="circle"
      onClick={submit}
      disabled={loading || disabled}
      className="flex justify-center items-center ml-auto mr-4"
    >
      {loading ? <LoadingOutlined /> : <DoubleRightOutlined />}
    </Button>
  );
  return (
    <Card title="Advise" actions={[<Submit />]}>
      <Markdown>{children}</Markdown>
    </Card>
  );
};

export default AdviseCard;

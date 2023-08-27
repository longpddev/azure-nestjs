import { Button, Card } from 'antd';
import Markdown from '../../components/Markdown/Markdown';
import { LoadingOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEnglishSentenceStore } from './store';
import {WritingQuestion} from '../../interfaces';


interface IQuestionCardProps {
  fetchQuestion: () => Promise<WritingQuestion>;
}

const QuestionCard: React.FC<IQuestionCardProps> = ({ fetchQuestion }) => {
  const question = useEnglishSentenceStore((state) => state.question);
  const setQuestion = useEnglishSentenceStore((state) => state.setQuestion);
  const reset = useEnglishSentenceStore((state) => state.reset);
  const status = useEnglishSentenceStore((state) => state.progress.question);
  const setProgress = useEnglishSentenceStore((state) => state.setProgress);
  
  const handleLoad = async () => {
    if(status === 'loading') return;
    reset(['question', 'answer', 'evaluate'])
    setProgress({question: 'loading'})
    try {
      setQuestion(await fetchQuestion())
      setProgress({question: 'loaded'})
    } catch (e) {
      setProgress({question: 'error'})
      console.error(e)
      throw e
    }
  }
  return <QuestionCardView load={handleLoad} loading={status === 'loading'}>{question?.question ?? ''}</QuestionCardView>;
};

interface IQuestionCardViewProps {
  children: string;
  loading: boolean;
  load: () => void | Promise<void>;
}

const QuestionCardView: React.FC<IQuestionCardViewProps> = ({
  children,
  loading,
  load,
}) => {
  const Control = () => (
    <Button
      onClick={load}
      shape="circle"
      className="flex justify-center items-center"
    >
      {loading ? (
        <LoadingOutlined></LoadingOutlined>
      ) : (
        <ReloadOutlined></ReloadOutlined>
      )}
    </Button>
  );
  return (
    <Card title="Question" extra={<Control />}>
      <Markdown>{children}</Markdown>
    </Card>
  );
};

export default QuestionCard;

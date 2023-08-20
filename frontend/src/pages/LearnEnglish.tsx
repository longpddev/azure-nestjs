import {
  LoadingOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Row, Input } from 'antd';
import { create } from 'zustand';
import { AppStatus } from '../constants';
import { englishCheck, englishExercise } from '../api';
import Markdown from '../components/Markdown';
import { persist } from 'zustand/middleware'


interface LearnEnglishStatus {
  question: AppStatus;
  answer: 'typing' | AppStatus;
  evaluate: AppStatus;
}

interface LearnEnglishStore {
  question: string;
  progress: LearnEnglishStatus;
  evaluate: string;
  loadQuestion: () => Promise<void>;
  setQuestion: (q: string) => void;
  answer: string;
  setAnswer: (str: string) => void;
  checkAnswer: () => Promise<void>;
  setProgress: (status: Partial<LearnEnglishStatus>) => void;
}
const useLearnEnglish = create(persist<LearnEnglishStore>((set, get) => ({
  question: '',
  progress: {
    question: 'initialized',
    evaluate: 'initialized',
    answer: 'initialized',
  },
  answer: '',
  evaluate: '',
  setProgress(status) {
    set({
      progress: {
        ...get().progress,
        ...status,
      },
    });
  },
  setAnswer(str) {
    set({ answer: str, progress: { ...get().progress, answer: 'typing' } });
  },
  loadQuestion: async () => {
    const { setProgress, ...state } = get();
    if (state.progress.question === 'loading') return;
    setProgress({ question: 'loading' });
    try {
      const result = await englishExercise();
      setProgress({ question: 'loaded', answer: 'typing' });
      set({ question: result });
    } catch (e) {
      console.error(e);
      setProgress({ question: 'error' });
    }
  },
  setQuestion(q) {
    set({ question: q });
  },
  checkAnswer: async () => {
    const { setProgress, ...state } = get();
    setProgress({ evaluate: 'loading', answer: 'loaded' });
    try {
      const result = await englishCheck(state.question, state.answer);
      setProgress({ evaluate: 'loaded' });
      set({ evaluate: result });
    } catch (e) {
      setProgress({ evaluate: 'error' });
    }
  },
}), {
  name: 'learn-english'
}));

const Control = () => {
  const progress = useLearnEnglish(state => state.progress);
  const loadQuestion = useLearnEnglish(state => state.loadQuestion);

  return (
    <>
      <Button
        onClick={() => {
          if (progress.question === 'loading') return;
          if (progress.answer === 'loading') return;
          loadQuestion();
        }}
        shape="circle"
        className="flex items-center justify-center"
      >
        {progress.question === 'loading' ? (
          <LoadingOutlined />
        ) : (
          <ReloadOutlined />
        )}
      </Button>
    </>
  );
};

const LearnEnglishTyping = () => {
  const checkAnswer = useLearnEnglish(state => state.checkAnswer)
  const progress = useLearnEnglish(state => state.progress)
  const answer = useLearnEnglish(state => state.answer)
  const setAnswer = useLearnEnglish(state => state.setAnswer)
  return <Col span={20} offset={2}>
  <Card
    title="Your answer"
    bodyStyle={{ padding: 4 }}
    actions={[
      <Button
        shape="circle"
        onClick={checkAnswer}
        className="ml-auto mr-4 flex items-center justify-center"
        disabled={
          answer.trim().length == 0 || progress.evaluate === 'loading'
        }
      >
        {progress.evaluate === 'loading' ? (
          <LoadingOutlined />
        ) : (
          <SendOutlined />
        )}
      </Button>,
    ]}
  >
    <Input.TextArea
      autoFocus
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      autoSize={{ minRows: 3, maxRows: 20 }}
    />
  </Card>
</Col>
}

const LearnEnglish = () => {
  const { progress, question, evaluate } =
    useLearnEnglish();
  return (
    <Row className="mt-6 mb-10" gutter={[16, 16]}>
      <Col span={20} offset={2}>
        <Card title="Question" extra={<Control></Control>}>
          <Markdown>{question}</Markdown>
        </Card>
      </Col>

      {progress.question === 'loaded' ? (
        <LearnEnglishTyping />
      ) : null}

      {progress.answer !== 'typing' && progress.question === 'loaded' ? (
        <Col span={20} offset={2}>
          <Card title="Advise">
            <Markdown>{evaluate}</Markdown>
          </Card>
        </Col>
      ) : null}
    </Row>
  );
};

export default LearnEnglish;

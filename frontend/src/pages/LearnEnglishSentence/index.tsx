import { Col, Row } from 'antd';
import AdviseCard from './AdviseCard';
import AnswerCard from './AnswerCard';
import QuestionCard from './QuestionCard';
import { englishCheck, englishSentenceWriting, englishSentenceWritingAnswer } from '../../api';

const LearnEnglishSentence = () => {
  return (
    <Row className="mt-6 mb-10" gutter={[16, 16]}>
      <Col span={20} offset={2}>
        <QuestionCard fetchQuestion={englishSentenceWriting}></QuestionCard>
      </Col>
      <Col span={20} offset={2}>
        <AnswerCard fetchAdvise={englishCheck}></AnswerCard>
      </Col>
      <Col span={20} offset={2}>
        <AdviseCard submit={englishSentenceWritingAnswer}></AdviseCard>
      </Col>
    </Row>
  );
};

export default LearnEnglishSentence;

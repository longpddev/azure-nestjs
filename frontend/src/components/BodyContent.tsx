import {useStore} from '../stores'
import {Card, Col, Row, Tag} from 'antd'
import Markdown from './Markdown'

const BodyContent = () => {
  const extracted = useStore(state => state.docExtract)
  if(!extracted) return null
  return (
    <Row gutter={[16, 16]} className='p-6 '>
    <Col>
      <Card title="Summarize">
        <Markdown>
          {extracted.summarize}
        </Markdown>
      </Card>
    </Col>
    <Col>
      <Card title="Explain">
        <Markdown>
          {extracted.explain}
        </Markdown>
      </Card>
    </Col>
    <Col >
      <Card title="General Takeaways">
        <Markdown>
          {extracted.generalTakeaways}
        </Markdown>
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Keywords" className=''>
        <div className='flex gap-y-1 flex-wrap'>{extracted.keywords.map((item, index) => (
          <Tag key={index}>{item}</Tag>
        ))}</div>
      </Card>
    </Col>
    <Col>
      <Card title="Topics">
      <div className='flex gap-y-1 flex-wrap'>{extracted.topics.map((item, index) => (
          <Tag key={index}>{item}</Tag>
        ))}</div>
      </Card>
    </Col>
    <Col>
      <Card title="Question Suggestion">
      <div className='flex gap-y-1 flex-wrap'>{extracted.suggests.map((item, index) => (
          <Tag key={index}>
            <span>{item.question}</span>{' '}
            <span className='text-blue-800' title='topics'>{item.topic}</span>
          </Tag>
        ))}</div>
      </Card>
    </Col>
  </Row>
  )
}

export default BodyContent
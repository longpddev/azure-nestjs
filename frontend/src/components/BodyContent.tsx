import {useStore} from '../stores'
import {Card, Col, Row, Tag} from 'antd'

const BodyContent = () => {
  const extracted = useStore(state => state.docExtract)
  if(!extracted) return null
  return (
    <Row gutter={[16, 16]} className='p-6 '>
    <Col span={12}>
      <Card title="Summarize">
        {extracted.summarize}
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Explain">
        {extracted.explain}
      </Card>
    </Col>
    <Col >
      <Card title="General Takeaways">
        {extracted.generalTakeaways}
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Keywords" className=''>
        <div className='flex gap-y-1 flex-wrap'>{extracted.keywords.map((item, index) => (
          <Tag key={index}>{item}</Tag>
        ))}</div>
      </Card>
    </Col>
    <Col span={12}>
      <Card title="Topics">
      <div className='flex gap-y-1 flex-wrap'>{extracted.topics.map((item, index) => (
          <Tag key={index}>{item}</Tag>
        ))}</div>
      </Card>
    </Col>
    <Col span={12}>
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
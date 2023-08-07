import React from 'react';
import { Col, Input, Row } from 'antd';
import {useStore} from '../stores';
import {countWords} from '../utils';
const { TextArea } = Input;

const MainInput: React.FC = () => {
  const docs = useStore(state => state.docs)
  const setDocs = useStore(state => state.setDocs)
  const status = useStore(state => state.status)
  const extractDocs = useStore(state => state.extractDocs)
  const words = countWords(docs)
  const isReactToLimitWords = words > 1000
  return (
    <Row className='mt-10 px-6'>
      <Col span={24} >
        <TextArea 
          placeholder="Paste docs here" 
          disabled={status === 'loading'}
          autoSize={{ minRows: 5, maxRows: 10 }} 
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          onKeyDown={({ code }) => {
            if(code !== 'Enter') return
            if(isReactToLimitWords) return
            extractDocs()
          }}
        />
        <p className='text-right'>Words: {words} {isReactToLimitWords && (<span className='text-red-400'>max 1000 words</span>)}</p>
      </Col>
    </Row>
  );
};

export default MainInput;
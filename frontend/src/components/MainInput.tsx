import React from 'react';
import { Col, Input, Row } from 'antd';
import {useStore} from '../stores';
const { TextArea } = Input;

const MainInput: React.FC = () => {
  const docs = useStore(state => state.docs)
  const setDocs = useStore(state => state.setDocs)
  const status = useStore(state => state.status)
  const extractDocs = useStore(state => state.extractDocs)
  return (
    <Row className='mt-10'>
      <Col span={12} offset={6}>
        <TextArea 
          placeholder="Parse docs here" 
          disabled={status === 'loading'}
          autoSize={{ minRows: 3, maxRows: 6 }} 
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          onKeyDown={({ code }) => {
            if(code !== 'Enter') return
            extractDocs()
          }}
        />
      </Col>
    </Row>
  );
};

export default MainInput;
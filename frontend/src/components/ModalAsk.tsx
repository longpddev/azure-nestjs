import {
  LoadingOutlined,
  SearchOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Modal, Tooltip, Input, Card } from 'antd';
import { useEffect, useRef } from 'react';
import { TextAreaRef } from 'antd/es/input/TextArea';
import Markdown from './Markdown';
import useModalAsk from '../stores/useModalAsk';
const TextArea = Input.TextArea;

const ModalAsk = () => {
  const { open, status, ask, setAsk, setOpen, askAI } = useModalAsk();
  const answer = useModalAsk((state) => state.cache.get(state.ask));
  const ref = useRef<TextAreaRef>(null);
  useEffect(() => {
    const handle = (ev: KeyboardEvent) => {
      const code = ev.code;
      console.log('🚀 ~ file: ModalAsk.tsx:25 ~ handle ~ code:', code);
      // const command = ev.metaKey
      const ctrl = ev.ctrlKey;
      // const shift = ev.shiftKey
      // const alt = ev.altKey
      switch (code) {
        case 'Escape':
          setOpen(false);
          break;
        case 'Enter':
          if (ctrl) {
            ev.preventDefault();
            setOpen(true);
          }
          break;
      }
    };

    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const textArea = ref.current?.resizableTextArea?.textArea;
    if (!textArea) return;
    if (!open) {
      textArea.blur();
    } else {
      timer = setTimeout(() => {
        textArea.focus();
        textArea.select();
      }, 100);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [open]);
  return (
    <>
      <Modal open={open} onCancel={() => setOpen(false)} footer={[]}>
        <h2 className="text-center text-xl">Ask AI</h2>
        <div className="relative">
          {open && (
            <TextArea
              ref={ref}
              onKeyDown={({ code, shiftKey }) => {
                if (code === 'Enter' && !shiftKey) askAI();
              }}
              size="small"
              disabled={status === 'loading'}
              classNames={{ textarea: 'mt-2' }}
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              autoSize={{ minRows: 2, maxRows: 5 }}
            />
          )}
          <Button
            onClick={askAI}
            shape="circle"
            size="small"
            className="flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 bg-white z-10"
          >
            <SendOutlined rotate={-15} />
          </Button>
        </div>
        <Card className="mt-4">
          {status === 'loading' ? (
            <div className='flex justify-center'><LoadingOutlined className="text-2xl flex w-min h-min"></LoadingOutlined></div>
          ) : (
            <Markdown>{answer ?? ''}</Markdown>
          )}
        </Card>
      </Modal>
      <Tooltip
        title="Ask me (ctrl + enter)"
        className="fixed bottom-10 right-10 z-10 flex items-center justify-center"
      >
        <Button
          shape="circle"
          onClick={() => setOpen(!open)}
          icon={<SearchOutlined />}
        />
      </Tooltip>
    </>
  );
};

export default ModalAsk;

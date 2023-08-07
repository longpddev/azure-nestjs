import {SearchOutlined, SendOutlined} from "@ant-design/icons"
import {Button, Modal, Tooltip, Input, Card} from "antd"
import {useEffect} from "react"
import {create} from "zustand"
import {callAi} from "../api"
import {AppStatus} from "../constants"
import ReactMarkdown from 'react-markdown'
const TextArea = Input.TextArea
interface ModalAskStore {
  open: boolean,
  status: AppStatus
  cache: Map<string, string>
  ask: string,
  setAsk: (ask: string) => void,
  setOpen: (open: boolean) => void,
  askAI: () => Promise<void>
  getInCache: (ask: string) => Promise<string>
}

const useModalAsk = create<ModalAskStore>((set, get) => ({
  open: true,
  status: 'initialized',
  cache: new Map(),
  ask: 'What is LangChain?',
  getInCache: async (ask) => {
    const { cache } = get()
    if(cache.has(ask)) return cache.get(ask) as string;
    const result = await callAi('Answer the question below using the advanced markup format for list important points and highlight keywords. You must answer around 20 - 70 words.\n{input}', {input: ask});
    cache.set(ask, result);
    return result;
  },
  askAI: async () => {
    const { getInCache, ask } = get();
    set({ status: 'loading'})
    try {
      await getInCache(ask.trim())
      set({ status: 'loaded'})
    } catch (e) {
      console.error(e);
      set({status: 'error'})
    }
  },
  setAsk: (ask) => set({ ask }),
  setOpen: (open) =>  set({ open })
}))

const ModalAsk = () => {
  const { open, status, ask, setAsk, setOpen, askAI } = useModalAsk();
  const answer = useModalAsk(state => state.cache.get(state.ask))

  useEffect(() => {
    const handle = (ev: KeyboardEvent) => {
      const code = ev.code;
      console.log("🚀 ~ file: ModalAsk.tsx:25 ~ handle ~ code:", code)
      const command = ev.metaKey
      // const shift = ev.shiftKey
      // const alt = ev.altKey
      switch (code) {
        case "Escape":
          setOpen(false)
          break;
        case "Enter":
          if(command) {
            ev.preventDefault();
            setOpen(true)
          }
          break;
      }
    }

    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
    }
  }, [])
  return (
    <>
      <Modal open={open} onCancel={() => setOpen(false)} footer={[]}>
        <h2 className="text-center text-xl">Ask AI</h2>
        <div className="relative">
          <TextArea size="small" disabled={status === 'loading'} classNames={{textarea: 'mt-2'}} value={ask} onChange={e => setAsk(e.target.value)} />
          <Button onClick={askAI} shape="circle" size="small" className="flex items-center justify-center absolute top-1/2 right-2 -translate-y-1/2 bg-white z-10">
            <SendOutlined rotate={-15} />
          </Button>
        </div>
        <Card className="mt-4 markdown">
          <ReactMarkdown >
            {answer ?? ''}
            
          </ReactMarkdown>
        </Card>
      </Modal>
      <Tooltip title="search" className="fixed bottom-10 right-10 z-10 flex items-center justify-center">
        <Button shape="circle" onClick={() => setOpen(!open)} icon={<SearchOutlined />} />
      </Tooltip>
    </>
  )
}

export default ModalAsk
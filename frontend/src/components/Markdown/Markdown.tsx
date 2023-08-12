import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'
const Markdown = ({ children }: { children: string}) => {
  return (
    <div className="markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown></div>
  )
}

export default Markdown
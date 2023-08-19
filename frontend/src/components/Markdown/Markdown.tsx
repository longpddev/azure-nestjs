import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm'
function LinkRenderer(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}
const Markdown = ({ children }: { children: string}) => {
  return (
    <div className="markdown"><ReactMarkdown components={{a: LinkRenderer}} remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown></div>
  )
}

export default Markdown
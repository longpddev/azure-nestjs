import clsx from 'clsx';
import { useGlobalKeyBoard } from '../../stores/useGlobalKeyBoard';
import { copyTextToClipboard } from '../../utils';
import { message } from 'antd';
import useModalAsk from '../../stores/useModalAsk';


const CopyOrSearch = ({ children }: { children: string }) => {
  const shiftKey = useGlobalKeyBoard((state) => state.shiftKey);
  const altKey = useGlobalKeyBoard((state) => state.altKey);
  const fastAsk = useModalAsk((state) => state.fastAsk);
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <>
      {contextHolder}
      {shiftKey || altKey ? (
        <span
          className={clsx({
            'text-blue-600 cursor-pointer select-none': shiftKey,
            'text-purple-600 cursor-pointer select-none': altKey,
          })}
          onClick={() => {
            if (shiftKey) {
              copyTextToClipboard(children)
                .then(() => {
                  messageApi.success(`Copied: ${children}`);
                })
                .catch(() => {
                  messageApi.error(`Copy false: ${children}`);
                });
            } else if (altKey) {
              fastAsk(children);
            }
          }}
        >
          {children}
        </span>
      ) : (
        <a
          href={`https://www.google.com.vn/search?q=${encodeURIComponent(
            children,
          )}`}
          className='hover:underline'
          target="_blank"
        >
          {children}
        </a>
      )}
    </>
  );
};

export default CopyOrSearch;

import {create} from "zustand"
import {askAI} from "../api"
import {AppStatus} from "../constants"

interface ModalAskStore {
  open: boolean,
  status: AppStatus
  cache: Map<string, string>
  ask: string,
  setAsk: (ask: string) => void,
  setOpen: (open: boolean) => void,
  askAI: () => Promise<void>
  getInCache: (ask: string) => Promise<string>
  fastAsk: (ask: string) => Promise<void>
}

const useModalAsk = create<ModalAskStore>((set, get) => ({
  open: false,
  status: 'initialized',
  cache: new Map(),
  ask: 'What is LangChain?',
  getInCache: async (ask) => {
    const { cache } = get()
    if(!ask.length) return '';
    if(cache.has(ask)) return cache.get(ask) as string;
    const result = await askAI(`Answer the question below using the advanced markdown format for list important points, source link, highlight the keyword to make it stand out. You always search before answer.\nQuestion: ${ask}\n\nYour short answer (markdown format):`);
    cache.set(ask, result);
    set({ cache })
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
  setOpen: (open) =>  set({ open }),
  fastAsk(ask) {
    const state = get();
    state.setAsk(ask);
    state.setOpen(true);
    return state.askAI()
  },
}))

export default useModalAsk
import { create } from 'zustand'
import {AppStatus} from '../constants'
import {OpenAIExtractDocs} from '../api/interface'
import {extract, simpleExplain} from '../api'
import {persist} from 'zustand/middleware'

const FAKE_DATA = {
  "keywords": [
      "LangChain",
      "framework",
      "developing",
      "applications",
      "language models",
      "data-awareness",
      "agency",
      "components",
      "pre-built chains",
      "specific tasks"
  ],
  "summarize": "LangChain provides a framework for developing applications powered by language models, with a focus on data-awareness and agency. It offers components for working with language models and pre-built chains for specific tasks.",
  "explain": "LangChain provides a framework for developing applications powered by language models, with a focus on data-awareness and agency. It offers components for working with language models and pre-built chains for specific tasks.",
  "topics": [
      "LangChain",
      "framework",
      "applications",
      "language models",
      "data-awareness",
      "agency",
      "components",
      "pre-built chains",
      "specific tasks"
  ],
  "suggests": [
      {
          "question": "What is LangChain?",
          "topic": "LangChain"
      },
      {
          "question": "What does LangChain offer?",
          "topic": "LangChain"
      },
      {
          "question": "What is the focus of LangChain?",
          "topic": "LangChain"
      },
      {
          "question": "What are the components provided by LangChain?",
          "topic": "LangChain"
      },
      {
          "question": "What are pre-built chains in LangChain?",
          "topic": "LangChain"
      },
      {
          "question": "What tasks can be accomplished using LangChain?",
          "topic": "LangChain"
      }
  ],
  "generalTakeaways": "LangChain is a framework for developing applications powered by language models. It emphasizes data-awareness and agency, and provides components and pre-built chains for specific tasks."
}

const FAKE_DOCS = 'LangChain provides a framework for developing applications powered by language models, with a focus on data-awareness and agency. It offers components for working with language models and pre-built chains for specific tasks.'


interface DocExtract extends OpenAIExtractDocs {
  explain: string
}
interface Store {
  docs: string,
  status: AppStatus,
  docExtract?: DocExtract,
  setDocs: (str: string) => void,
  extractDocs: () => Promise<void>
}

export const useStore = create(persist<Store>((set, get) => ({
  docs: FAKE_DOCS,
  status: 'initialized',
  docExtract: FAKE_DATA,
  setDocs: (str: string) => set({ docs: str}),
  extractDocs: async () => {
    const { docs } = get();
    const docsTrim = docs.trim();
    if(docsTrim.length === 0) throw new Error('docs empty')
    set({ status: 'loading'})
    try {
      const [result, explain] = await Promise.all([
        extract(docsTrim),
        simpleExplain(docsTrim)
      ])
      
      set({ docExtract: {...result, explain}, status: 'loaded'})
    } catch(e) {
      console.error(e)
      set({ status: 'error'})
    }
  }
}), {
  name: 'main-store'
}))
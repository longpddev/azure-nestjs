import client from "./client";
import {OpenAIAskRes, OpenAIExtractDocs} from "./interface";

export async function ask(docs: string) {
  const result = await client.get<OpenAIAskRes>('/open-ai/ask', {
    params: {
      message: docs
    }
  })

  return result.data
}

export async function extract(docs: string) {
  const result = await client.post<OpenAIExtractDocs>('/open-ai/extract', {
    docs
  })

  return result.data
}

export async function callAi(template: string, data: Record<string, string>) {
  const result = await client.post<{ result: string }>('/open-ai/call-ai', {
    template,
    keyValuePair: Object.entries(data).map(([key, value]) => ({key, value}))
  })

  return result.data.result
}

export async function simpleExplain (docs: string) {
  const result = await client.post<{ result: string }>('/open-ai/simple-explain', {
    data: {
      docs
    }
  })

  return result.data.result
}
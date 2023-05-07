import { readFileSync } from 'fs'
import { BaseDocumentLoader } from 'langchain/dist/document_loaders/base'
import { BufferLoader } from 'langchain/dist/document_loaders/fs/buffer'
import { TextLoader } from 'langchain/dist/document_loaders/fs/text'
import { Document } from 'langchain/dist/document'

interface Message {
  author: {
    role: string
  }
  content: {
    parts: string[]
  }
  create_time: number
}

function concatenate_rows(message: Message, title: string): string {
  if (!message) {
    return ''
  }

  const sender = message.author?.role ?? 'unknown'
  const text = message.content.parts[0]
  const date = new Date(message.create_time * 1000).toISOString()
  return `\${title} - \${sender} on \${date}: \${text}\n\n`
}

export class ChatGPTLoader extends TextLoader implements BaseDocumentLoader {
  constructor(private log_file: string, private num_logs: number = -1) {
    super(log_file)
  }

  async load(): Promise<Document[]> {
    const raw_data = readFileSync(this.log_file, { encoding: 'utf8' })
    const data = JSON.parse(raw_data) as {
      title: string
      mapping: Record<string, { message: Message }>
    }[]

    const documents: Document[] = []
    for (const d of data.slice(0, this.num_logs || Infinity)) {
      const title = d.title
      const messages = d.mapping
      const text = Object.keys(messages)
        .map((key, idx) => {
          const message = messages[key].message
          if (idx === 0 && message.author.role === 'system') {
            return ''
          }
          return concatenate_rows(message, title)
        })
        .join('')

      const metadata = { source: this.log_file }
      const pageContent = text
      documents.push(new Document({ pageContent, metadata }))
    }

    return documents
  }
}

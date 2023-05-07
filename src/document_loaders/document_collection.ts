import { DocxLoader } from 'langchain/dist/document_loaders/fs/docx'
import { CSVLoader } from 'langchain/dist/document_loaders/fs/csv'
import { EPubLoader } from 'langchain/dist/document_loaders/fs/epub'
import {
  JSONLinesLoader,
  JSONLoader,
} from 'langchain/dist/document_loaders/fs/json'
import { NotionLoader } from 'langchain/dist/document_loaders/fs/notion'
import { PDFLoader } from 'langchain/dist/document_loaders/fs/pdf'
import { SRTLoader } from 'langchain/dist/document_loaders/fs/srt'
import { TextLoader } from 'langchain/dist/document_loaders/fs/text'
import { UnstructuredLoader } from 'langchain/dist/document_loaders/fs/unstructured'
import { lookup } from 'mime-types'
import { BaseDocumentLoader as DocumentLoader } from 'langchain/dist/document_loaders/base'

import type { LoadedDocument } from '../index'

import { SimpleGithubLoader } from './github'

import * as fs from 'fs'

export class MarkdownLoader extends TextLoader {
  constructor(private filePath: string) {
    super(filePath)
  }
}

export class DocumentCollection {
  private jsonLinesPointer = 'html'
  private unstructuredOptions: any = {}

  private resourcePaths: string[] = []
  private documents: LoadedDocument[] = []

  constructor(resourcePaths: string[], jsonLinesPointer = 'html') {
    this.resourcePaths = resourcePaths
    this.jsonLinesPointer = jsonLinesPointer
  }

  loadDocuments(): LoadedDocument[] {
    for (const resourcePath of this.resourcePaths) {
      const stat = fs.statSync(resourcePath)
      if (stat.isDirectory()) {
        const files = fs.readdirSync(resourcePath)
        for (const file of files) {
          const filePath = `${resourcePath}/${file}`
          const stat = fs.statSync(filePath)
          if (stat.isFile()) {
            this.loadDocument(filePath)
          }
        }
      }
      if (stat.isFile()) {
        this.loadDocument(resourcePath)
      }
    }
    return this.documents
  }

  async loadDocument(resourcePath: string): Promise<undefined> {
    const loader = this.getLoader(resourcePath)
    if (loader === undefined) {
      console.log('No loader found for ${resourcePath}, skipping')
      return undefined
    }
    const document: LoadedDocument = await loader.load()
    this.documents.push(document)
    return
  }

  getLoader(resourcePath: string) {
    // if is url use getWebLoader
    // if not url use getDocumentLoader
    const isUrl = resourcePath.startsWith('http')
    return isUrl
      ? this.getWebLoader(resourcePath)
      : this.getFileLoader(resourcePath)
  }

  getWebLoader(resourcePath: string): DocumentLoader | undefined {
    return resourcePath.includes('github.com')
      ? new SimpleGithubLoader(resourcePath)
      : // @todo ad support for other web / api loaders.
        undefined
  }
  getFileLoader(resourcePath: string): DocumentLoader | undefined {
    const useNotionMarkdown = resourcePath.includes('notion') ? true : false

    const mimeType = lookup(resourcePath)
    return mimeType === 'text/csv'
      ? new CSVLoader(resourcePath)
      : mimeType === 'text/markdown'
      ? useNotionMarkdown === true
        ? new NotionLoader(resourcePath)
        : new MarkdownLoader(resourcePath)
      : mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ? new DocxLoader(resourcePath)
      : mimeType === 'application/epub+zip'
      ? new EPubLoader(resourcePath)
      : mimeType === 'application/json'
      ? new JSONLoader(resourcePath)
      : mimeType === 'application/jsonlines'
      ? new JSONLinesLoader(resourcePath, this.jsonLinesPointer)
      : mimeType === 'application/octet-stream'
      ? new NotionLoader(resourcePath)
      : mimeType === 'application/pdf'
      ? new PDFLoader(resourcePath)
      : mimeType === 'application/x-subrip'
      ? new SRTLoader(resourcePath)
      : mimeType === 'text/plain'
      ? new TextLoader(resourcePath)
      : this.isUnstructuredEnabled()
      ? new UnstructuredLoader(resourcePath, this.unstructuredOptions)
      : undefined
  }
  // @todo implement this
  private isUnstructuredEnabled(): boolean {
    return false
  }

  private getMimeType(resourcePath: string): string {
    return lookup(resourcePath) || 'application/octet-stream'
  }

  private async isDirectory(path: string): Promise<boolean> {
    const stats = await fs.promises.stat(path)
    return stats.isDirectory()
  }

  private async isFile(path: string): Promise<boolean> {
    const stats = await fs.promises.stat(path)
    return stats.isFile()
  }
}

// Usage
const documentCollection = new DocumentCollection([
  'path/to/directory',
  'path/to/directory2/file.md',
])
// Should load up all the files in the directory, and the file.md
const documents: LoadedDocument[] = documentCollection.loadDocuments()

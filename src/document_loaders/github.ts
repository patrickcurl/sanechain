import binaryExtensions from 'binary-extensions'
import { Document } from 'langchain/dist/document'
import { BaseDocumentLoader } from 'langchain/dist/document_loaders/base'
import { UnknownHandling } from 'langchain/dist/document_loaders/fs/directory'
import { extname } from 'langchain/dist/util/extname'

const extensions = new Set(binaryExtensions)

function isBinaryPath(name: string) {
  return extensions.has(extname(name).slice(1).toLowerCase())
}

interface GithubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: string
  _links: {
    self: string
    git: string
    html: string
  }
}

export interface GithubRepoLoaderParams {
  branch?: string
  recursive?: boolean
  unknown?: UnknownHandling
  ignoreFiles?: (string | RegExp)[]
}

export class SimpleGithubLoader
  extends BaseDocumentLoader
  implements GithubRepoLoaderParams
{
  private readonly url: string

  private readonly initialPath: string

  public branch: string

  public recursive: boolean

  public unknown: UnknownHandling

  public ignoreFiles: (string | RegExp)[]

  constructor(
    githubUrl: string,
    {
      branch = 'main',
      recursive = true,
      unknown = UnknownHandling.Warn,
      ignoreFiles = [],
    }: GithubRepoLoaderParams = {}
  ) {
    super()
    this.url = githubUrl
    this.initialPath = ''
    this.branch = branch
    this.recursive = recursive
    this.unknown = unknown
    this.ignoreFiles = ignoreFiles
  }

  private extractOwnerAndRepoAndPath(url: string): {
    owner: string
    repo: string
    path: string
  } {
    const match = url.match(
      /https:\/\/github.com\/([^/]+)\/([^/]+)(\/tree\/[^/]+\/(.+))?/i
    )

    if (!match) {
      throw new Error('Invalid GitHub URL format.')
    }

    return { owner: match[1], repo: match[2], path: match[4] || '' }
  }

  public async load(): Promise<Document[]> {
    const documents: Document[] = []
    const { owner, repo } = this.extractOwnerAndRepoFromUrl(this.url)
    await this.processDirectory(owner, repo, this.initialPath, documents)
    return documents
  }

  private shouldIgnore(path: string): boolean {
    return this.ignoreFiles.some((pattern) => {
      if (typeof pattern === 'string') {
        return path === pattern
      }

      try {
        return pattern.test(path)
      } catch {
        throw new Error(`Unknown ignore file pattern: ${pattern}`)
      }
    })
  }

  private async processDirectory(
    owner: string,
    repo: string,
    path: string,
    documents: Document[]
  ): Promise<void> {
    try {
      const files = await this.fetchRepoFiles(owner, repo, path)

      for (const file of files) {
        if (file.type === 'dir') {
          if (this.recursive) {
            await this.processDirectory(owner, repo, file.path, documents)
          }
        } else {
          try {
            if (!isBinaryPath(file.name) && !this.shouldIgnore(file.path)) {
              const fileContent = await this.fetchFileContent(file)
              const metadata = { source: file.path }
              documents.push(
                new Document({ pageContent: fileContent, metadata })
              )
            }
          } catch (e) {
            this.handleError(`Failed to fetch file content: ${file.path}, ${e}`)
          }
        }
      }
    } catch (error) {
      this.handleError(`Failed to process directory: ${path}, ${error}`)
    }
  }
  private async fetchRepoFiles(
    owner: string,
    repo: string,
    path: string
  ): Promise<GithubFile[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${this.branch}`
    const response = await fetch(url)
    const data = await response.json()
    if (!response.ok) {
      throw new Error(
        `Unable to fetch repository files: ${response.status} ${JSON.stringify(
          data
        )}`
      )
    }
    if (!Array.isArray(data)) {
      throw new Error('Unable to fetch repository files.')
    }

    return data as GithubFile[]
  }

  private async fetchFileContent(file: GithubFile): Promise<string> {
    const response = await fetch(file.download_url)
    return response.text()
  }

  private handleError(message: string): void {
    switch (this.unknown) {
      case UnknownHandling.Ignore:
        break
      case UnknownHandling.Warn:
        console.warn(message)
        break
      case UnknownHandling.Error:
        throw new Error(message)
      default:
        throw new Error(`Unknown unknown handling: ${this.unknown}`)
    }
  }

  private extractOwnerAndRepoFromUrl(url: string): {
    owner: string
    repo: string
  } {
    const match = url.match(/https:\/\/github.com\/([^/]+)\/([^/]+)/i)
    if (!match) {
      throw new Error('Invalid GitHub URL format.')
    }

    return { owner: match[1], repo: match[2] }
  }
}

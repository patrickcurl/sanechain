# Sane Chain <!-- omit in toc -->

## An attempt to make langchainjs easier to work with <!-- omit in toc -->

WIP - ~~nothing works yet, just saving the name~~
Some things work, just um - not tested, no warranties :1st_place_medal:

Adds the following loaders:

1. [Utility Classes](#utility-classes)
   1. [DocumentLoader](#documentloader)
2. [Loaders](#loaders)
   1. [ChatGPT Loader](#chatgpt-loader)
   2. [Simpler GithubRepoLoader](#simpler-githubrepoloader)
   3. [Roadmap](#roadmap)

## Utility Classes

### DocumentLoader

This class essentially packages up all of langchainjs (plus sanechain) and creates a class:
DocumentLoader that can basically load up all your documents regardless of type.

Example:

```typescript
const filesAndDirectories = [
  'path/to/somefile.md',
  'path/to/somefile.pdf',
  'path/to/somefile.text',
  'path/to/somefile.html',
  'path/to/somedirectory',
  'https://github.com/some/repo',
  'https://github.com/some/other_repo',
  'path/to/chatgpt.json'
]

const documentLoader = new DocumentLoader(filesAndDirectories)
const documents = documentLoader.loadDocuments()
const splitDocuments = documentLoader.splitDocuments()
// Might take time, probably gonna implement a queue system to speed things up, already using async though.
// also @todo add full parity with all langchain python loaders.
```

## Loaders

### ChatGPT Loader

```typescript
import { ChatGPTLoader } from './chat_gpt_loader.js';

const loader = new ChatGPTLoader('path/to/chat/log.json', 10);
const documents = await loader.load();
```

### Simpler GithubRepoLoader

Insert github link, get repo documents.

```typescript
  import {GithubRepoLoader} from 'sanechain'
  const loader = new GithubRepoLoader("https://github.com/owner/repo", { /*params*/ });
  const documents = await loader.load();
```

### Roadmap

- [ ] Models
  - [ ] General
  - [ ] Chat
  - [ ] Embeddings
- [ ] Prompts
  - [ ] General Templates
  - [ ] Chat Template
  - [ ] Example Selectors
  - [ ] Output Parsers
- [ ] Indexes (Primary focus at first)
  - [ ] Document Loaders %%
    - [ ] Airbyte JSON
    - [ ] Apify Dataset
    - [ ] Arxiv
    - [ ] AWS S3
    - [ ] AZLyrics
    - [ ] Azure Blob Storage
    - [ ] Bilibili
    - [ ] Blackboard
    - [ ] Blockchain
    - [x] ChatGPT Data
    - [ ] Confluence
    - [ ] CoNLL-U
    - [ ] Copy / Paste
    - [x] CSV (langchainjs)
    - [ ] Diffbot
    - [ ] Discord
    - [ ] DuckDB
    - [ ] Email
    - [x] EPub (langchainjs)
    - [ ] EverNote
    - [ ] Facebook Chat
    - [ ] Figma
    - [x] File Directory (langchainjs)
    - [x] Git (langchainjs + custom url loader)
    - [ ] GitBook
    - [ ] Google BigQuery
    - [ ] Google Cloud Storage
    - [ ] Google Drive
    - [ ] Gutenberg
    - [ ] Hacker News
    - [ ] HTML
    - [ ] HuggingFace dataset
    - [ ] iFixit
    - [ ] Images
    - [ ] Image captions
    - [ ] IMDB
    - [ ] JSON Files (langchain)
    - [ ] Jupyter Notebook
    - [x] Markdown (sorta, just parses using TextLoader)
    - [ ] MediaWikiDump
    - [ ] Microsoft OneDrive
    - [ ] Microsoft PowerPoint
    - [x] Microsoft Word (langchainjs)
    - [ ] Modern Treasury
    - [ ] Notion DB 1/2
    - [ ] Notion DB 2/2
    - [ ] Obsidian
    - [ ] Pandas DataFrame
    - [x] PDF (langchain)
    - [ ] Using PyPDFium2
    - [ ] ReadTheDocs Documentation
    - [ ] Reddit
    - [ ] Roam
    - [ ] Sitemap
    - [ ] Slack
    - [ ] Spreedly
    - [ ] Stripe
    - [ ] Subtitle (langchain)
    - [ ] Telegram
    - [ ] TOML
    - [ ] Twitter
    - [ ] Unstructured File (half way)
    - [x] URL (langchainjs via puppetter, playwright, cheerio, etc)
    - [ ] Selenium URL Loader
    - [x] Playwright URL Loader (langchainjs)
    - [ ] WebBaseLoader
    - [ ] WhatsApp Chat
    - [ ] Wikipedia
    - [ ] YouTube transcripts
  [ Text Splitters ]
    - [ ] Character Text Splitter
    - [ ] HuggingFace Length Function
    - [ ] Latext Text SPlitter
    - [ ] Markdown Text Splitter
    - [ ] NLTK Text Splitter
    - [ ] RecursiveCharacterTextSplitter
    - [ ] Spacy Text Splitter
    - [ ] tiktoken (OpenAI) Length Function
    - [ ] TiktokenTextSplitter
  - [ ] Vector stores
  - [ ] Retrievers
- [ ] Memory (TBD)
- [ ] Chains (TBD)
- [ ] Agents
  - [ ] Tools (TBD)
  - [ ] Agents (TBD)
  - [ ] Toolkits (TBD)
  - [ ] AgentExecutors (TBD)

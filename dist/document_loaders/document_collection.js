"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentCollection = exports.MarkdownLoader = void 0;
const docx_1 = require("langchain/dist/document_loaders/fs/docx");
const csv_1 = require("langchain/dist/document_loaders/fs/csv");
const epub_1 = require("langchain/dist/document_loaders/fs/epub");
const json_1 = require("langchain/dist/document_loaders/fs/json");
const notion_1 = require("langchain/dist/document_loaders/fs/notion");
const pdf_1 = require("langchain/dist/document_loaders/fs/pdf");
const srt_1 = require("langchain/dist/document_loaders/fs/srt");
const text_1 = require("langchain/dist/document_loaders/fs/text");
const unstructured_1 = require("langchain/dist/document_loaders/fs/unstructured");
const mime_types_1 = require("mime-types");
const github_1 = require("./github");
const fs = __importStar(require("fs"));
class MarkdownLoader extends text_1.TextLoader {
    constructor(filePath) {
        super(filePath);
        this.filePath = filePath;
    }
}
exports.MarkdownLoader = MarkdownLoader;
class DocumentCollection {
    constructor(resourcePaths, jsonLinesPointer = 'html') {
        this.jsonLinesPointer = 'html';
        this.unstructuredOptions = {};
        this.resourcePaths = [];
        this.documents = [];
        this.resourcePaths = resourcePaths;
        this.jsonLinesPointer = jsonLinesPointer;
    }
    loadDocuments() {
        for (const resourcePath of this.resourcePaths) {
            const stat = fs.statSync(resourcePath);
            if (stat.isDirectory()) {
                const files = fs.readdirSync(resourcePath);
                for (const file of files) {
                    const filePath = `${resourcePath}/${file}`;
                    const stat = fs.statSync(filePath);
                    if (stat.isFile()) {
                        this.loadDocument(filePath);
                    }
                }
            }
            if (stat.isFile()) {
                this.loadDocument(resourcePath);
            }
        }
        return this.documents;
    }
    async loadDocument(resourcePath) {
        const loader = this.getLoader(resourcePath);
        if (loader === undefined) {
            console.log('No loader found for ${resourcePath}, skipping');
            return undefined;
        }
        const document = await loader.load();
        this.documents.push(document);
        return;
    }
    getLoader(resourcePath) {
        // if is url use getWebLoader
        // if not url use getDocumentLoader
        const isUrl = resourcePath.startsWith('http');
        return isUrl
            ? this.getWebLoader(resourcePath)
            : this.getFileLoader(resourcePath);
    }
    getWebLoader(resourcePath) {
        return resourcePath.includes('github.com')
            ? new github_1.SimpleGithubLoader(resourcePath)
            : // @todo ad support for other web / api loaders.
                undefined;
    }
    getFileLoader(resourcePath) {
        const useNotionMarkdown = resourcePath.includes('notion') ? true : false;
        const mimeType = (0, mime_types_1.lookup)(resourcePath);
        return mimeType === 'text/csv'
            ? new csv_1.CSVLoader(resourcePath)
            : mimeType === 'text/markdown'
                ? useNotionMarkdown === true
                    ? new notion_1.NotionLoader(resourcePath)
                    : new MarkdownLoader(resourcePath)
                : mimeType ===
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ? new docx_1.DocxLoader(resourcePath)
                    : mimeType === 'application/epub+zip'
                        ? new epub_1.EPubLoader(resourcePath)
                        : mimeType === 'application/json'
                            ? new json_1.JSONLoader(resourcePath)
                            : mimeType === 'application/jsonlines'
                                ? new json_1.JSONLinesLoader(resourcePath, this.jsonLinesPointer)
                                : mimeType === 'application/octet-stream'
                                    ? new notion_1.NotionLoader(resourcePath)
                                    : mimeType === 'application/pdf'
                                        ? new pdf_1.PDFLoader(resourcePath)
                                        : mimeType === 'application/x-subrip'
                                            ? new srt_1.SRTLoader(resourcePath)
                                            : mimeType === 'text/plain'
                                                ? new text_1.TextLoader(resourcePath)
                                                : this.isUnstructuredEnabled()
                                                    ? new unstructured_1.UnstructuredLoader(resourcePath, this.unstructuredOptions)
                                                    : undefined;
    }
    // @todo implement this
    isUnstructuredEnabled() {
        return false;
    }
    getMimeType(resourcePath) {
        return (0, mime_types_1.lookup)(resourcePath) || 'application/octet-stream';
    }
    async isDirectory(path) {
        const stats = await fs.promises.stat(path);
        return stats.isDirectory();
    }
    async isFile(path) {
        const stats = await fs.promises.stat(path);
        return stats.isFile();
    }
}
exports.DocumentCollection = DocumentCollection;
// Usage
const documentCollection = new DocumentCollection([
    'path/to/directory',
    'path/to/directory2/file.md',
]);
// Should load up all the files in the directory, and the file.md
const documents = documentCollection.loadDocuments();
//# sourceMappingURL=document_collection.js.map
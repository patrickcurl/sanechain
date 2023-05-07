import { TextLoader } from 'langchain/dist/document_loaders/fs/text';
import { BaseDocumentLoader as DocumentLoader } from 'langchain/dist/document_loaders/base';
import type { LoadedDocument } from '../index';
export declare class MarkdownLoader extends TextLoader {
    private filePath;
    constructor(filePath: string);
}
export declare class DocumentCollection {
    private jsonLinesPointer;
    private unstructuredOptions;
    private resourcePaths;
    private documents;
    constructor(resourcePaths: string[], jsonLinesPointer?: string);
    loadDocuments(): LoadedDocument[];
    loadDocument(resourcePath: string): Promise<undefined>;
    getLoader(resourcePath: string): DocumentLoader | undefined;
    getWebLoader(resourcePath: string): DocumentLoader | undefined;
    getFileLoader(resourcePath: string): DocumentLoader | undefined;
    private isUnstructuredEnabled;
    private getMimeType;
    private isDirectory;
    private isFile;
}

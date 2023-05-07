import { BaseDocumentLoader } from 'langchain/dist/document_loaders/base';
import { TextLoader } from 'langchain/dist/document_loaders/fs/text';
import { Document } from 'langchain/dist/document';
export declare class ChatGPTLoader extends TextLoader implements BaseDocumentLoader {
    private log_file;
    private num_logs;
    constructor(log_file: string, num_logs?: number);
    load(): Promise<Document[]>;
}

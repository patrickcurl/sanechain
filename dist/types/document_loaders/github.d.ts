import { Document } from 'langchain/dist/document';
import { BaseDocumentLoader } from 'langchain/dist/document_loaders/base';
import { UnknownHandling } from 'langchain/dist/document_loaders/fs/directory';
export interface GithubRepoLoaderParams {
    branch?: string;
    recursive?: boolean;
    unknown?: UnknownHandling;
    ignoreFiles?: (string | RegExp)[];
}
export declare class SimpleGithubLoader extends BaseDocumentLoader implements GithubRepoLoaderParams {
    private readonly url;
    private readonly initialPath;
    branch: string;
    recursive: boolean;
    unknown: UnknownHandling;
    ignoreFiles: (string | RegExp)[];
    constructor(githubUrl: string, { branch, recursive, unknown, ignoreFiles, }?: GithubRepoLoaderParams);
    private extractOwnerAndRepoAndPath;
    load(): Promise<Document[]>;
    private shouldIgnore;
    private processDirectory;
    private fetchRepoFiles;
    private fetchFileContent;
    private handleError;
    private extractOwnerAndRepoFromUrl;
}

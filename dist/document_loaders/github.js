"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGithubLoader = void 0;
const binary_extensions_1 = __importDefault(require("binary-extensions"));
const document_1 = require("langchain/dist/document");
const base_1 = require("langchain/dist/document_loaders/base");
const directory_1 = require("langchain/dist/document_loaders/fs/directory");
const extname_1 = require("langchain/dist/util/extname");
const extensions = new Set(binary_extensions_1.default);
function isBinaryPath(name) {
    return extensions.has((0, extname_1.extname)(name).slice(1).toLowerCase());
}
class SimpleGithubLoader extends base_1.BaseDocumentLoader {
    constructor(githubUrl, { branch = 'main', recursive = true, unknown = directory_1.UnknownHandling.Warn, ignoreFiles = [], } = {}) {
        super();
        this.url = githubUrl;
        this.initialPath = '';
        this.branch = branch;
        this.recursive = recursive;
        this.unknown = unknown;
        this.ignoreFiles = ignoreFiles;
    }
    extractOwnerAndRepoAndPath(url) {
        const match = url.match(/https:\/\/github.com\/([^/]+)\/([^/]+)(\/tree\/[^/]+\/(.+))?/i);
        if (!match) {
            throw new Error('Invalid GitHub URL format.');
        }
        return { owner: match[1], repo: match[2], path: match[4] || '' };
    }
    async load() {
        const documents = [];
        const { owner, repo } = this.extractOwnerAndRepoFromUrl(this.url);
        await this.processDirectory(owner, repo, this.initialPath, documents);
        return documents;
    }
    shouldIgnore(path) {
        return this.ignoreFiles.some((pattern) => {
            if (typeof pattern === 'string') {
                return path === pattern;
            }
            try {
                return pattern.test(path);
            }
            catch (_a) {
                throw new Error(`Unknown ignore file pattern: ${pattern}`);
            }
        });
    }
    async processDirectory(owner, repo, path, documents) {
        try {
            const files = await this.fetchRepoFiles(owner, repo, path);
            for (const file of files) {
                if (file.type === 'dir') {
                    if (this.recursive) {
                        await this.processDirectory(owner, repo, file.path, documents);
                    }
                }
                else {
                    try {
                        if (!isBinaryPath(file.name) && !this.shouldIgnore(file.path)) {
                            const fileContent = await this.fetchFileContent(file);
                            const metadata = { source: file.path };
                            documents.push(new document_1.Document({ pageContent: fileContent, metadata }));
                        }
                    }
                    catch (e) {
                        this.handleError(`Failed to fetch file content: ${file.path}, ${e}`);
                    }
                }
            }
        }
        catch (error) {
            this.handleError(`Failed to process directory: ${path}, ${error}`);
        }
    }
    async fetchRepoFiles(owner, repo, path) {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${this.branch}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Unable to fetch repository files: ${response.status} ${JSON.stringify(data)}`);
        }
        if (!Array.isArray(data)) {
            throw new Error('Unable to fetch repository files.');
        }
        return data;
    }
    async fetchFileContent(file) {
        const response = await fetch(file.download_url);
        return response.text();
    }
    handleError(message) {
        switch (this.unknown) {
            case directory_1.UnknownHandling.Ignore:
                break;
            case directory_1.UnknownHandling.Warn:
                console.warn(message);
                break;
            case directory_1.UnknownHandling.Error:
                throw new Error(message);
            default:
                throw new Error(`Unknown unknown handling: ${this.unknown}`);
        }
    }
    extractOwnerAndRepoFromUrl(url) {
        const match = url.match(/https:\/\/github.com\/([^/]+)\/([^/]+)/i);
        if (!match) {
            throw new Error('Invalid GitHub URL format.');
        }
        return { owner: match[1], repo: match[2] };
    }
}
exports.SimpleGithubLoader = SimpleGithubLoader;
//# sourceMappingURL=github.js.map
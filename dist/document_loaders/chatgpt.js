"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGPTLoader = void 0;
const fs_1 = require("fs");
const text_1 = require("langchain/dist/document_loaders/fs/text");
const document_1 = require("langchain/dist/document");
function concatenate_rows(message, title) {
    var _a, _b;
    if (!message) {
        return '';
    }
    const sender = (_b = (_a = message.author) === null || _a === void 0 ? void 0 : _a.role) !== null && _b !== void 0 ? _b : 'unknown';
    const text = message.content.parts[0];
    const date = new Date(message.create_time * 1000).toISOString();
    return `\${title} - \${sender} on \${date}: \${text}\n\n`;
}
class ChatGPTLoader extends text_1.TextLoader {
    constructor(log_file, num_logs = -1) {
        super(log_file);
        this.log_file = log_file;
        this.num_logs = num_logs;
    }
    async load() {
        const raw_data = (0, fs_1.readFileSync)(this.log_file, { encoding: 'utf8' });
        const data = JSON.parse(raw_data);
        const documents = [];
        for (const d of data.slice(0, this.num_logs || Infinity)) {
            const title = d.title;
            const messages = d.mapping;
            const text = Object.keys(messages)
                .map((key, idx) => {
                const message = messages[key].message;
                if (idx === 0 && message.author.role === 'system') {
                    return '';
                }
                return concatenate_rows(message, title);
            })
                .join('');
            const metadata = { source: this.log_file };
            const pageContent = text;
            documents.push(new document_1.Document({ pageContent, metadata }));
        }
        return documents;
    }
}
exports.ChatGPTLoader = ChatGPTLoader;
//# sourceMappingURL=chatgpt.js.map
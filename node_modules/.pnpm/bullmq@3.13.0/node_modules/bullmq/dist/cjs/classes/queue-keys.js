"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueKeys = void 0;
class QueueKeys {
    constructor(prefix = 'bull') {
        this.prefix = prefix;
    }
    getKeys(name) {
        const keys = {};
        [
            '',
            'active',
            'wait',
            'waiting',
            'paused',
            'resumed',
            'id',
            'delayed',
            'priority',
            'stalled-check',
            'completed',
            'failed',
            'stalled',
            'repeat',
            'limiter',
            'drained',
            'progress',
            'meta',
            'events',
            'delay',
        ].forEach(key => {
            keys[key] = this.toKey(name, key);
        });
        return keys;
    }
    toKey(name, type) {
        return `${this.getPrefixedQueueName(name)}:${type}`;
    }
    getPrefixedQueueName(name) {
        return `${this.prefix}:${name}`;
    }
}
exports.QueueKeys = QueueKeys;
//# sourceMappingURL=queue-keys.js.map
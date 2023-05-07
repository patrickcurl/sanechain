export type KeysMap = {
    [index in string]: string;
};
export declare class QueueKeys {
    readonly prefix: string;
    constructor(prefix?: string);
    getKeys(name: string): KeysMap;
    toKey(name: string, type: string): string;
    getPrefixedQueueName(name: string): string;
}

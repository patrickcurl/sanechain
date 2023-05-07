/// <reference types="node" />
import { EventEmitter } from 'events';
import { ConnectionOptions, RedisClient } from '../interfaces';
export interface RawCommand {
    content: string;
    name: string;
    keys: number;
}
export declare class RedisConnection extends EventEmitter {
    private readonly shared;
    private readonly blocking;
    static minimumVersion: string;
    static recommendedMinimumVersion: string;
    closing: boolean;
    protected _client: RedisClient;
    private readonly opts;
    private initializing;
    private version;
    private handleClientError;
    private handleClientClose;
    private handleClientReady;
    constructor(opts?: ConnectionOptions, shared?: boolean, blocking?: boolean);
    private checkBlockingOptions;
    /**
     * Waits for a redis client to be ready.
     * @param redis - client
     */
    static waitUntilReady(client: RedisClient): Promise<void>;
    get client(): Promise<RedisClient>;
    protected loadCommands(providedScripts?: Record<string, RawCommand>): void;
    private init;
    disconnect(): Promise<void>;
    reconnect(): Promise<void>;
    close(): Promise<void>;
    private getRedisVersion;
    get redisVersion(): string;
}

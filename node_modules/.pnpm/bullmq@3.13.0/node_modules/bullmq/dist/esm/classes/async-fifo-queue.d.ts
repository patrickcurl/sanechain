/**
 * AsyncFifoQueue
 *
 * A minimal FIFO queue for asynchronous operations. Allows adding asynchronous operations
 * and consume them in the order they are resolved.
 *
 *  TODO: Optimize using a linked list for the queue instead of an array.
 *  Current implementation requires memory copies when shifting the queue.
 *  For a linked linked implementation, we can exploit the fact that the
 *  maximum number of elements in the list will never exceen the concurrency factor
 *  of the worker, so the nodes of the list could be pre-allocated.
 */
export declare class AsyncFifoQueue<T> {
    private ignoreErrors;
    private queue;
    private nextPromise;
    private resolve;
    private reject;
    private pending;
    constructor(ignoreErrors?: boolean);
    add(promise: Promise<T>): void;
    waitAll(): Promise<void>;
    numTotal(): number;
    numPending(): number;
    numQueued(): number;
    private resolvePromise;
    private rejectPromise;
    private newPromise;
    private wait;
    fetch(): Promise<T | void>;
}

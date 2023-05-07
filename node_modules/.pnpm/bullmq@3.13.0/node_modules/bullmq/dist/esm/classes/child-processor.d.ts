import { JobJson } from '../interfaces';
declare enum ChildStatus {
    Idle = 0,
    Started = 1,
    Terminating = 2,
    Errored = 3
}
/**
 * ChildProcessor
 *
 * This class acts as the interface between a child process and it parent process
 * so that jobs can be processed in different processes.
 *
 */
export declare class ChildProcessor {
    private send;
    status?: ChildStatus;
    processor: any;
    currentJobPromise: Promise<unknown> | undefined;
    constructor(send: (msg: any) => Promise<void>);
    init(processorFile: string): Promise<void>;
    start(jobJson: JobJson): Promise<void>;
    stop(): Promise<void>;
    waitForCurrentJobAndExit(): Promise<void>;
}
export {};

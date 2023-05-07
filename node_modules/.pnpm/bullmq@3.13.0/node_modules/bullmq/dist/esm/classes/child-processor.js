import { promisify } from 'util';
import { ParentCommand } from '../interfaces';
import { errorToJSON } from '../utils';
var ChildStatus;
(function (ChildStatus) {
    ChildStatus[ChildStatus["Idle"] = 0] = "Idle";
    ChildStatus[ChildStatus["Started"] = 1] = "Started";
    ChildStatus[ChildStatus["Terminating"] = 2] = "Terminating";
    ChildStatus[ChildStatus["Errored"] = 3] = "Errored";
})(ChildStatus || (ChildStatus = {}));
/**
 * ChildProcessor
 *
 * This class acts as the interface between a child process and it parent process
 * so that jobs can be processed in different processes.
 *
 */
export class ChildProcessor {
    constructor(send) {
        this.send = send;
    }
    async init(processorFile) {
        let processor;
        try {
            processor = require(processorFile);
            if (processor.default) {
                // support es2015 module.
                processor = processor.default;
            }
            if (typeof processor !== 'function') {
                throw new Error('No function is exported in processor file');
            }
        }
        catch (err) {
            this.status = ChildStatus.Errored;
            return this.send({
                cmd: ParentCommand.InitFailed,
                err: errorToJSON(err),
            });
        }
        if (processor.length > 1) {
            processor = promisify(processor);
        }
        else {
            const origProcessor = processor;
            processor = function (...args) {
                try {
                    return Promise.resolve(origProcessor(...args));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            };
        }
        this.processor = processor;
        this.status = ChildStatus.Idle;
        await this.send({
            cmd: ParentCommand.InitCompleted,
        });
    }
    async start(jobJson) {
        if (this.status !== ChildStatus.Idle) {
            return this.send({
                cmd: ParentCommand.Error,
                err: errorToJSON(new Error('cannot start a not idling child process')),
            });
        }
        this.status = ChildStatus.Started;
        this.currentJobPromise = (async () => {
            try {
                const job = wrapJob(jobJson, this.send);
                const result = (await this.processor(job)) || {};
                await this.send({
                    cmd: ParentCommand.Completed,
                    value: result,
                });
            }
            catch (err) {
                await this.send({
                    cmd: ParentCommand.Failed,
                    value: errorToJSON(!err.message ? new Error(err) : err),
                });
            }
            finally {
                this.status = ChildStatus.Idle;
                this.currentJobPromise = undefined;
            }
        })();
    }
    async stop() { }
    async waitForCurrentJobAndExit() {
        this.status = ChildStatus.Terminating;
        try {
            await this.currentJobPromise;
        }
        finally {
            process.exit(process.exitCode || 0);
        }
    }
}
/**
 * Enhance the given job argument with some functions
 * that can be called from the sandboxed job processor.
 *
 * Note, the `job` argument is a JSON deserialized message
 * from the main node process to this forked child process,
 * the functions on the original job object are not in tact.
 * The wrapped job adds back some of those original functions.
 */
function wrapJob(job, send) {
    let progressValue = job.progress;
    const updateProgress = async (progress) => {
        // Locally store reference to new progress value
        // so that we can return it from this process synchronously.
        progressValue = progress;
        // Send message to update job progress.
        await send({
            cmd: ParentCommand.Progress,
            value: progress,
        });
    };
    return Object.assign(Object.assign({}, job), { data: JSON.parse(job.data || '{}'), opts: job.opts, returnValue: JSON.parse(job.returnvalue || '{}'), 
        /*
         * Emulate the real job `updateProgress` function, should works as `progress` function.
         */
        updateProgress, 
        /*
         * Emulate the real job `log` function.
         */
        log: async (row) => {
            send({
                cmd: ParentCommand.Log,
                value: row,
            });
        }, 
        /*
         * Emulate the real job `update` function.
         */
        update: async (data) => {
            send({
                cmd: ParentCommand.Update,
                value: data,
            });
        } });
}
//# sourceMappingURL=child-processor.js.map
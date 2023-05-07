"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const sandbox = (processFile, childPool) => {
    return async function process(job) {
        const child = await childPool.retain(processFile);
        let msgHandler;
        let exitHandler;
        await child.send({
            cmd: interfaces_1.ChildCommand.Start,
            job: job.asJSONSandbox(),
        });
        const done = new Promise((resolve, reject) => {
            msgHandler = async (msg) => {
                switch (msg.cmd) {
                    case interfaces_1.ParentCommand.Completed:
                        resolve(msg.value);
                        break;
                    case interfaces_1.ParentCommand.Failed:
                    case interfaces_1.ParentCommand.Error: {
                        const err = new Error();
                        Object.assign(err, msg.value);
                        reject(err);
                        break;
                    }
                    case interfaces_1.ParentCommand.Progress:
                        await job.updateProgress(msg.value);
                        break;
                    case interfaces_1.ParentCommand.Log:
                        await job.log(msg.value);
                        break;
                    case interfaces_1.ParentCommand.Update:
                        await job.update(msg.value);
                        break;
                }
            };
            exitHandler = (exitCode, signal) => {
                reject(new Error('Unexpected exit code: ' + exitCode + ' signal: ' + signal));
            };
            child.on('message', msgHandler);
            child.on('exit', exitHandler);
        });
        try {
            await done;
            return done;
        }
        finally {
            child.off('message', msgHandler);
            child.off('exit', exitHandler);
            if (child.exitCode !== null || /SIG.*/.test(`${child.signalCode}`)) {
                childPool.remove(child);
            }
            else {
                childPool.release(child);
            }
        }
    };
};
exports.default = sandbox;
//# sourceMappingURL=sandbox.js.map
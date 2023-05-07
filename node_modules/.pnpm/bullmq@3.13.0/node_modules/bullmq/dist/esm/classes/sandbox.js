import { ChildCommand, ParentCommand } from '../interfaces';
const sandbox = (processFile, childPool) => {
    return async function process(job) {
        const child = await childPool.retain(processFile);
        let msgHandler;
        let exitHandler;
        await child.send({
            cmd: ChildCommand.Start,
            job: job.asJSONSandbox(),
        });
        const done = new Promise((resolve, reject) => {
            msgHandler = async (msg) => {
                switch (msg.cmd) {
                    case ParentCommand.Completed:
                        resolve(msg.value);
                        break;
                    case ParentCommand.Failed:
                    case ParentCommand.Error: {
                        const err = new Error();
                        Object.assign(err, msg.value);
                        reject(err);
                        break;
                    }
                    case ParentCommand.Progress:
                        await job.updateProgress(msg.value);
                        break;
                    case ParentCommand.Log:
                        await job.log(msg.value);
                        break;
                    case ParentCommand.Update:
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
export default sandbox;
//# sourceMappingURL=sandbox.js.map
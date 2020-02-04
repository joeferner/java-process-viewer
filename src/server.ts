import express, { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import path from 'path';
import { jps, jstack } from 'java-process-information';

export interface StartOptions {
    port: number;
    jpsCommand: string;
    jstackCommand: string;
}

export function start(options: StartOptions) {
    const { port } = options;

    const app = express();

    app.use('/processes', getProcesses);
    app.use('/process/:pid/threads', getProcessThreads);
    app.use('/', express.static(path.resolve(__dirname, '..', 'public', 'resources')));
    app.use(express.static(path.resolve(__dirname, '..', 'public', 'target')));

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(`request failed: ${req.url}`, err);
        if (process.env.NODE_ENV === 'dev') {
            next(err);
        } else {
            res.status(500).send('Something broke!');
        }
    });

    app.listen(port, () => {
        console.log(`listening http://localhost:${port}`);
    });

    async function getProcesses(req: Request, res: Response, next: NextFunction) {
        try {
            const results = await jps({
                cmd: options.jpsCommand,
                outputFullPackageNames: true,
                outputArguments: true,
                outputJvmArguments: true
            });
            res.send(results);
        } catch (err) {
            next(err);
        }
    }

    async function getProcessThreads(req: Request, res: Response, next: NextFunction) {
        try {
            const { pid } = req.params;
            const results = await jstack({
                cmd: options.jstackCommand,
                pid: parseInt(pid)
            });
            res.send(results);
        } catch (err) {
            if (err.message.indexOf('No such process') >= 0) {
                res.sendStatus(404);
                res.send('');
                return;
            }
            next(err);
        }
    }
}

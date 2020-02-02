import express, { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { parseJps } from 'jps-parser/target';
import { parseJStack } from 'jstack-parser/target';
import path from 'path';
import { execPromise } from './utils';

export interface StartOptions {
    port: number;
    jpsCommand: string;
    jstackCommand: string;
}

export function start(options: StartOptions) {
    const { port } = options;

    const app = express();

    app.use('/processes', getProcesses);
    app.use('/process/:pid', getProcessDetails);
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
            const rawResults = await execPromise(options.jpsCommand);
            const results = parseJps(rawResults.stdout, rawResults.stderr);
            res.send(results);
        } catch (err) {
            next(err);
        }
    }

    async function getProcessDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { pid } = req.params;
            const cmd = options.jstackCommand.replace(/\$pid/, pid);
            const rawResults = await execPromise(cmd);
            const results = parseJStack(rawResults.stdout, rawResults.stderr);
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

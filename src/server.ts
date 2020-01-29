import express, {Request, Response} from 'express';
import path from 'path';
import {execPromise} from "./utils";
import {NextFunction} from "express-serve-static-core";
import {parseJps} from "jps-parser/target";


export interface StartOptions {
    port: number;
    jpsCommand: string;
}

export function start(options: StartOptions) {
    const {port} = options;

    const app = express();

    app.use('/processes', getProcesses);
    app.use('/', express.static(path.resolve(__dirname, '..', 'public', 'resources')));
    app.use(express.static(path.resolve(__dirname, '..', 'public', 'target')));

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
}

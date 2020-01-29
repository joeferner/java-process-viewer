import express, {Request, Response} from 'express';
import path from 'path';

export interface StartOptions {
    port: number;
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
}

function getProcesses(req: Request, res: Response) {
    res.send([]);
}
import * as child from "child_process";
import {ExecOptions} from "child_process";

export interface ExecResults {
    stdout: string;
    stderr: string;
}

export function execPromise(command: string, options?: ExecOptions): Promise<ExecResults> {
    return new Promise<ExecResults>((resolve, reject) => {
        child.exec(command, options, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve({
                stdout: stdout.toString(),
                stderr: stderr.toString()
            })
        });
    });
}
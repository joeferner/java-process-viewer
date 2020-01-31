import axios from 'axios';
import { ParseResults as JStackParseResults } from 'jstack-parser/src/index';
import { Process } from './models';

export interface ProcessListResults {
    processes: Process[];
}

export async function getProcessList(): Promise<ProcessListResults> {
    const ret = await axios.get('/processes');
    if (ret.status === 200) {
        return ret.data;
    }
    throw new Error(`Could not get processes: ${ret.status}`);
}

export async function getProcessDetails(pid: number): Promise<JStackParseResults> {
    const ret = await axios.get(`/process/${pid}`);
    if (ret.status === 200) {
        return ret.data;
    }
    throw new Error(`Could not get process details (pid: ${pid}): ${ret.status}`);
}

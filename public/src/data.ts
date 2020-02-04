import axios from 'axios';
import { JpsProcess, JStackParseResults } from 'java-process-information';

export interface ProcessListResults {
    processes: JpsProcess[];
}

export async function getProcessList(): Promise<ProcessListResults> {
    const ret = await axios.get('/processes');
    if (ret.status === 200) {
        return ret.data;
    }
    throw new Error(`Could not get processes: ${ret.status}`);
}

export async function getProcessThreads(pid: number): Promise<JStackParseResults> {
    const ret = await axios.get(`/process/${pid}/threads`);
    if (ret.status === 200) {
        return ret.data;
    }
    throw new Error(`Could not get process details (pid: ${pid}): ${ret.status}`);
}

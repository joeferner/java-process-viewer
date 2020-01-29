import {Process} from "./models";
import axios from "axios";

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

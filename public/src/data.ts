import {Process} from "./models";
import axios from "axios";

export async function getProcessList(): Promise<Process[]> {
    const ret = await axios.get('/processes');
    console.log('ret', ret);
    return [];
}
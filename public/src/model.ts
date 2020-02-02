import { Thread } from 'jstack-parser/target';

export interface SearchWorkerRequestMessage {
    searchString: string;
    threads: Thread[];
}

export interface SearchWorkerResponseMessage {
    searchString: string;
    threads: Thread[];
}

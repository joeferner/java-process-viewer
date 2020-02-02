import { Thread } from 'jstack-parser/target';

export interface SearchWorkerRequestMessage {
    searchString: string;
    threads: Thread[];
}

export interface SearchWorkerResponseBase {
    searchString: string;
}

export interface SearchWorkerResponseMessage extends SearchWorkerResponseBase {
    threads: Thread[];
}

export interface SearchWorkerErrorResponseMessage extends SearchWorkerResponseBase {
    errorMessage: string;
}

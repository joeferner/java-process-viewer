import { JStackThread } from 'java-process-information';

export interface SearchWorkerRequestMessage {
    searchString: string;
    threads: JStackThread[];
}

export interface SearchWorkerResponseBase {
    searchString: string;
}

export interface SearchWorkerResponseMessage extends SearchWorkerResponseBase {
    threads: JStackThread[];
}

export interface SearchWorkerErrorResponseMessage extends SearchWorkerResponseBase {
    errorMessage: string;
}

import { Thread } from 'jstack-parser/target';
import { SearchWorkerRequestMessage, SearchWorkerResponseMessage } from '../model';

onmessage = e => {
    const data: SearchWorkerRequestMessage = e.data;
    const threads: Thread[] = data.threads;
    const searchString: string = data.searchString;

    const filteredThreads = threads.filter(thread => {
        return (
            JSON.stringify(thread)
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) >= 0
        );
    });

    const results: SearchWorkerResponseMessage = {
        searchString,
        threads: filteredThreads
    };

    // @ts-ignore
    postMessage(results);
};

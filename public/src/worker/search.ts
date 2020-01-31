import { Thread } from 'jstack-parser/target';

onmessage = e => {
    const threads: Thread[] = e.data[0];
    const searchString: string = e.data[1];

    const results = threads.filter(thread => {
        return (
            JSON.stringify(thread)
                .toLowerCase()
                .indexOf(searchString.toLowerCase()) >= 0
        );
    });

    // @ts-ignore
    postMessage(results);
};

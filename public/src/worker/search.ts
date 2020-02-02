import { Thread } from 'jstack-parser/target';
import { SearchWorkerErrorResponseMessage, SearchWorkerRequestMessage, SearchWorkerResponseMessage } from '../model';

const searchParser = require('./search-parser');

interface ParseResult {
    op: '||' | '&&' | '<' | '>' | '=';
    args?: ParseResult[];
    left?: string;
    right?: string;
    value?: string;
}

const objectValuesAsString = (obj: any): string => {
    let str = '';
    if (typeof obj === 'string') {
        return obj as string;
    }
    for (const val of Object.values(obj)) {
        if (typeof val === 'object') {
            str += ` ${objectValuesAsString(val)}`;
        } else {
            str += ` ${val}`;
        }
    }
    return str;
};

const THREAD_KEYS: string[] = [
    'name',
    'daemon',
    'javaThreadId',
    'osPriority',
    'priority',
    'cpuTimeMillis',
    'elapsedTimeMillis',
    'tid',
    'nid',
    'stackMemoryRegion',
    'info',
    'state',
    'stackItems'
];

const isStringMatch = (match: string, value: string): boolean => {
    const str = match.toLowerCase();
    if (str === '*') {
        return true;
    }
    return value.indexOf(str) >= 0;
};

const isMatch = (threadValues: string, thread: Thread, parseResultOrString: ParseResult | string): boolean => {
    if ((parseResultOrString as ParseResult).op) {
        const parseResult = parseResultOrString as ParseResult;
        switch (parseResult.op) {
        case '||':
            if (!parseResult.args) {
                throw new Error('op "||" requires args');
            }
            for (const arg of parseResult.args) {
                if (isMatch(threadValues, thread, arg)) {
                    return true;
                }
            }
            return false;

        case '&&':
            if (!parseResult.args) {
                throw new Error('op "&&" requires args');
            }
            for (const arg of parseResult.args) {
                if (!isMatch(threadValues, thread, arg)) {
                    return false;
                }
            }
            return true;

        case '=':
        case '<':
        case '>': {
            if (!parseResult.left) {
                throw new Error(`op "${parseResult.op}" requires left`);
            }
            if (!parseResult.right) {
                throw new Error(`op "${parseResult.op}" requires right`);
            }
            if (THREAD_KEYS.indexOf(parseResult.left) < 0) {
                throw new Error(`left of "${parseResult.op}" must be one of ${THREAD_KEYS.join(', ')}`);
            }
            const v = (thread as any)[parseResult.left];
            switch (parseResult.op) {
            case '=':
                return isStringMatch(parseResult.right.toLowerCase(), objectValuesAsString(v).toLowerCase());
            case '<':
                return parseResult.right.toLowerCase() < objectValuesAsString(v).toLowerCase();
            case '>':
                return parseResult.right.toLowerCase() > objectValuesAsString(v).toLowerCase();
            default:
                throw new Error(`Unhandled op "${parseResult.op}"`);
            }
        }

        default:
            throw new Error(`Unhandled op "${parseResult.op}"`);
        }
    } else {
        return isStringMatch(parseResultOrString as string, threadValues);
    }
};

onmessage = e => {
    const data: SearchWorkerRequestMessage = e.data;
    const threads: Thread[] = data.threads;
    const searchString: string = data.searchString;

    try {
        const parseResult: ParseResult | string = searchParser.parse((searchString || '*').trim());

        const filteredThreads = threads.filter(thread => {
            return isMatch(objectValuesAsString(thread).toLowerCase(), thread, parseResult);
        });

        const results: SearchWorkerResponseMessage = {
            searchString,
            threads: filteredThreads
        };

        // @ts-ignore
        postMessage(results);
    } catch (err) {
        const results: SearchWorkerErrorResponseMessage = {
            searchString,
            errorMessage: err.message
        };

        // @ts-ignore
        postMessage(results);
    }
};

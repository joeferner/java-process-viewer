import { makeStyles, Paper, Typography } from '@material-ui/core';
import { ParseResults as JStackParseResults } from 'jstack-parser/src/index';
import React, { useEffect } from 'react';
// @ts-ignore
import SearchWorker from 'worker-loader!./worker/search';
import { Column } from './components/common/Column';
import { ConfigurableTable, SortDirection } from './components/common/ConfigurableTable';
import { SearchTextBox } from './components/SearchTextBox';
import { getProcessDetails } from './data';
import { ThreadDetails } from './ThreadDetails';
import { AppContext, AppContextData } from './AppContext';
import { debounce } from 'debounce';
import {
    SearchWorkerErrorResponseMessage,
    SearchWorkerRequestMessage,
    SearchWorkerResponseBase,
    SearchWorkerResponseMessage,
} from './model';

const searchWorker = SearchWorker();

const useStyles = makeStyles(theme => ({
    search: {
        margin: '16px',
        width: '400px',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    table: {
        flex: 1,
        display: 'flex',
    },
    tableContainer: {
        height: `calc(100vh - 135px)`,
    },
    error: {},
}));

const initialColumns: Column[] = [
    { id: 'javaThreadId', label: 'ID', minWidth: 20 },
    { id: 'state', label: 'State', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'osPriority', label: 'OS Priority', minWidth: 20, visible: false },
    { id: 'priority', label: 'Priority', minWidth: 20, visible: false },
    { id: 'tid', label: 'TID', minWidth: 150, visible: false },
    { id: 'nid', label: 'NID', minWidth: 20, visible: false },
    { id: 'stackMemoryRegion', label: 'Stack Memory Region', minWidth: 50, visible: false },
    { id: 'info', label: 'Info', minWidth: 170 },
];

export interface ProcessDetailsProps {
    match: {
        params: {
            pid: string;
        };
    };
}

const postSearch = debounce((details: JStackParseResults | undefined, searchString: string) => {
    if (details) {
        const req: SearchWorkerRequestMessage = {
            searchString,
            threads: details.threads,
        };
        searchWorker.postMessage(req);
    }
}, 200);

export function ProcessDetails(props: ProcessDetailsProps) {
    const classes = useStyles();
    const appContext = React.useContext<AppContextData>(AppContext);
    const pid = parseInt(props.match.params.pid, 10);
    const [columns, setColumns] = React.useState<Column[]>(initialColumns);
    const [details, setDetails] = React.useState<JStackParseResults | undefined>(undefined);
    const [rows, setRows] = React.useState<any[]>([]);
    const [sortColumnId, setSortColumnId] = React.useState<string>('javaThreadId');
    const [sortDirection, setSortDirection] = React.useState<SortDirection>(SortDirection.ASCENDING);
    const [search, setSearch] = React.useState<string>('');
    const [error, setError] = React.useState<string | undefined>(undefined);

    const refresh = React.useCallback(async () => {
        setError('');
        appContext.onLoadingChange(true);
        try {
            let newDetails: JStackParseResults;
            try {
                newDetails = await getProcessDetails(pid);
            } catch (err) {
                setError(err.message);
                throw err;
            }
            setDetails(newDetails);
            const newRows = newDetails.threads.map(thread => {
                return {
                    id: thread.tid,
                    ...thread,
                };
            });
            setRows(newRows);
        } finally {
            appContext.onLoadingChange(false);
        }
    }, [pid, appContext.onLoadingChange]);

    useEffect(() => {
        searchWorker.onmessage = (e: MessageEvent) => {
            const data: SearchWorkerResponseBase = e.data;
            if (data.searchString !== search) {
                return;
            }

            if ((data as SearchWorkerErrorResponseMessage).errorMessage) {
                const errorData = data as SearchWorkerErrorResponseMessage;
                setError(errorData.errorMessage);
            } else if ((data as SearchWorkerResponseMessage).threads) {
                const successData = data as SearchWorkerResponseMessage;
                setError(undefined);
                setRows(
                    successData.threads.map(thread => {
                        return {
                            id: thread.tid,
                            ...thread,
                        };
                    }),
                );
            }
        };
    }, [search]);

    const handleRenderDetails = React.useCallback(row => {
        return <ThreadDetails thread={row} />;
    }, []);

    const handleSearchChange = React.useCallback(
        (newSearchString: string) => {
            setSearch(newSearchString);
            postSearch.clear();
            postSearch(details, newSearchString);
        },
        [details],
    );

    const handleSetColumns = React.useCallback(newColumns => {
        setColumns(newColumns);
    }, []);

    const handleSortChange = React.useCallback((newSortColumnId, newSortDirection) => {
        setSortColumnId(newSortColumnId);
        setSortDirection(newSortDirection);
    }, []);

    React.useEffect(() => {
        refresh();
    }, [pid, appContext.refreshSignal]);

    return (
        <Paper>
            <Paper className={classes.header}>
                <SearchTextBox className={classes.search} value={search} onChange={handleSearchChange} />
                {error ? (
                    <Typography color="secondary" className={classes.error}>
                        {error}
                    </Typography>
                ) : null}
            </Paper>
            <ConfigurableTable
                className={classes.table}
                containerClassName={classes.tableContainer}
                rows={rows}
                columns={columns}
                sortColumnId={sortColumnId}
                sortDirection={sortDirection}
                onSetColumns={handleSetColumns}
                onSortChange={handleSortChange}
                renderDetails={handleRenderDetails}
            />
        </Paper>
    );
}

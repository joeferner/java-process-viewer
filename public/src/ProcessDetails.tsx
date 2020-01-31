import { Button, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Column } from './components/common/Column';
import { ConfigurableTable, SortDirection } from './components/common/ConfigurableTable';
import { getProcessDetails } from './data';
import { ThreadDetails } from './ThreadDetails';
import { SearchTextBox } from './components/SearchTextBox';
import { App } from './App';

const useStyles = makeStyles(theme => ({
    refreshButton: {
        margin: '16px',
    },
    search: {
        margin: '16px',
    },
    table: {
        flex: 1,
        display: 'flex',
    },
    tableContainer: {
        height: `calc(100vh - 135px)`,
    },
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

export function ProcessDetails(props: ProcessDetailsProps) {
    const classes = useStyles();
    const { pid } = props.match.params;
    const [columns, setColumns] = React.useState<Column[]>(initialColumns);
    const [rows, setRows] = React.useState<any[]>([]);
    const [sortColumnId, setSortColumnId] = React.useState<string>('javaThreadId');
    const [sortDirection, setSortDirection] = React.useState<SortDirection>(SortDirection.ASCENDING);
    const [search, setSearch] = React.useState<string>('');

    const refresh = async () => {
        const details = await getProcessDetails(parseInt(pid, 10));
        const newRows = details.threads.map(thread => {
            return {
                id: thread.tid,
                ...thread,
            };
        });
        setRows(newRows);
    };

    const handleRenderDetails = React.useCallback(row => {
        return <ThreadDetails thread={row}/>;
    }, []);

    const handleSearchChange = React.useCallback(value => {
        setSearch(value);
    }, []);

    const handleSetColumns = React.useCallback(newColumns => {
        setColumns(newColumns);
    }, []);

    const handleSortChange = React.useCallback((newSortColumnId, newSortDirection) => {
        setSortColumnId(newSortColumnId);
        setSortDirection(newSortDirection);
    }, []);

    useEffect(() => {
        refresh();
    }, [pid]);

    return (<Paper>
        <Button className={classes.refreshButton} onClick={() => refresh()}>Refresh</Button>
        <SearchTextBox className={classes.search} value={search} onChange={handleSearchChange}/>
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
    </Paper>);
}

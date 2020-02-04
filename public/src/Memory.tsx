import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Column, numberColumn } from './components/common/Column';
import { ConfigurableTable, SortDirection } from './components/common/ConfigurableTable';
import { AppContext, AppContextData } from './AppContext';
import { getProcessMemory } from './data';
import { JMapParseResults } from 'java-process-information';

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

const columns: Column[] = [
    {
        ...numberColumn,
        id: 'instances',
        label: 'Instances',
        minWidth: 20,
        align: 'right',
    },
    {
        ...numberColumn,
        id: 'bytes',
        label: 'Bytes',
        minWidth: 100,
        align: 'right',
    },
    { id: 'className', label: 'Class Name', minWidth: 200 },
];

export interface ProcessDetailsProps {
    match: {
        params: {
            pid: string;
        };
    };
}

export function Memory(props: ProcessDetailsProps) {
    const classes = useStyles();
    const appContext = React.useContext<AppContextData>(AppContext);
    const pid = parseInt(props.match.params.pid, 10);
    const [rows, setRows] = React.useState<any[]>([]);
    const [sortColumnId, setSortColumnId] = React.useState<string>('instances');
    const [sortDirection, setSortDirection] = React.useState<SortDirection>(SortDirection.DESCENDING);
    const [error, setError] = React.useState<string | undefined>(undefined);

    const refresh = React.useCallback(async () => {
        setError('');
        appContext.onLoadingChange(true);
        try {
            let results: JMapParseResults;
            try {
                results = await getProcessMemory(pid);
            } catch (err) {
                setError(err.message);
                throw err;
            }
            const newRows = results.objects.map((obj, index) => {
                return {
                    id: `${obj.className}-${index}`,
                    ...obj,
                };
            });
            setRows(newRows);
        } finally {
            appContext.onLoadingChange(false);
        }
    }, [pid, appContext.onLoadingChange]);

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
                onSortChange={handleSortChange}
            />
        </Paper>
    );
}

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { getProcessList } from './data';
import { center } from './styles';
import { AppContext, AppContextData } from './AppContext';
import { Process } from 'jps-parser';

const useStyles = makeStyles(theme => ({
    loading: {
        ...center({ width: 300, height: 300, centerContent: true }),
    },

    content: {
        ...center({ width: 300, height: 450 }),
        display: 'flex',
    },

    tableContainer: {
        flexGrow: 1,
    },

    table: {},

    tableHeaderCell: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },

    noProcessesFoundCell: {
        border: 0,
    },

    row: {
        cursor: 'pointer',
    },

    classNameLabel: {
        color: theme.palette.text.disabled,
    },
}));

export function ProcessList() {
    const classes = useStyles();
    const history = useHistory();
    const appContext = React.useContext<AppContextData>(AppContext);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const [processes, setProcesses] = React.useState<Process[] | undefined>(undefined);

    const refresh = React.useCallback(async () => {
        try {
            setError(false);
            setLoading(true);
            const processList = await getProcessList();
            const newProcesses = processList.processes
                .filter((p: Process) => {
                    return p.name.toLowerCase() !== 'jps';
                })
                .sort((a: Process, b: Process) => {
                    return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
                });
            setProcesses(newProcesses);
        } catch (err) {
            console.error('failed to load process list', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleClick = React.useCallback((row: Process) => {
        history.push(`/pid/${row.pid}`);
    }, []);

    React.useEffect(() => {
        refresh();
    }, [appContext.refreshSignal]);

    if (loading && !processes) {
        return (
            <Paper elevation={3} className={classes.loading}>
                Loading...
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper elevation={3} className={classes.loading}>
                Error Loading Processes
            </Paper>
        );
    }

    if (!processes) {
        return (
            <Paper elevation={3} className={classes.loading}>
                Could not find processes
            </Paper>
        );
    }

    return (
        <Paper elevation={3} className={classes.content}>
            <TableContainer className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                            <TableCell className={classes.tableHeaderCell} align="right">
                                PID
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className={classes.noProcessesFoundCell}>
                                    No Java Processes Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            processes.map(row => (
                                <TableRow
                                    className={classes.row}
                                    hover
                                    key={row.pid}
                                    role="checkbox"
                                    onClick={() => handleClick(row)}
                                >
                                    <TableCell component="th" scope="row">
                                        <Tooltip title={row.args ? row.args.join(' ') : ''} placement="bottom-start">
                                            <div>
                                                <div>{row.name}</div>
                                                <div className={classes.classNameLabel}>{row.className}</div>
                                            </div>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">{row.pid}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Process } from './models';
import { makeStyles } from '@material-ui/core/styles';
import { center } from './styles';
import { getProcessList } from './data';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
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
}));

export function ProcessList() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const [processes, setProcesses] = React.useState<Process[] | undefined>(undefined);

    const refresh = React.useCallback(async () => {
        try {
            setError(false);
            setLoading(true);
            const processList = await getProcessList();
            setProcesses(processList.processes);
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
    }, []);

    if (loading && !processes) {
        return (<Paper elevation={3} className={classes.loading}>Loading...</Paper>);
    }

    if (error) {
        return (<Paper elevation={3} className={classes.loading}>Error Loading Processes</Paper>);
    }

    if (!processes) {
        return (<Paper elevation={3} className={classes.loading}>Could not find processes</Paper>);
    }

    return (<Paper elevation={3} className={classes.content}>
        <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeaderCell}>Name</TableCell>
                        <TableCell className={classes.tableHeaderCell} align="right">PID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processes.length === 0
                        ? (<TableRow>
                            <TableCell colSpan={2} className={classes.noProcessesFoundCell}>No Java Processes
                                Found</TableCell>
                        </TableRow>)
                        : processes.map(row => (
                            <TableRow className={classes.row} hover key={row.pid} role="checkbox"
                                      onClick={() => handleClick(row)}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.pid}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>);
}

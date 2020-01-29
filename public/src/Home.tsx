import React from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import {Process} from './models';
import {makeStyles} from "@material-ui/core/styles";
import {center} from "./styles";
import {getProcessList} from "./data";

const useStyles = makeStyles({
    loading: {
        ...center({width: 300, height: 300, centerContent: true})
    },

    content: {
        ...center({width: 300, height: 450}),
        display: 'flex'
    },

    tableContainer: {
        flexGrow: 1
    },

    table: {},

    noProcessesFoundCell: {
        border: 0
    }
});

export function Home() {
    const classes = useStyles();
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<boolean>(false);
    const [processes, setProcesses] = React.useState<Process[] | undefined>(undefined);

    const refresh = React.useCallback(async () => {
        try {
            setError(false);
            setLoading(true);
            console.log('a');
            const processList = await getProcessList();
            console.log('b');
            setProcesses(processList);
        } catch (err) {
            console.error('failed to load process list', err);
            setError(true);
        } finally {
            setLoading(false);
        }
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
                        <TableCell>Name</TableCell>
                        <TableCell align="right">PID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processes.length === 0
                        ? (<TableRow>
                            <TableCell colSpan={2} className={classes.noProcessesFoundCell}>No Java Processes
                                Found</TableCell>
                        </TableRow>)
                        : processes.map(row => (
                            <TableRow key={row.name}>
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

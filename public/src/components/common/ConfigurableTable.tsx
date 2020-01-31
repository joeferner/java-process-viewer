import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { ColumnConfigDialog } from './ColumnConfigDialog';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import { Column } from './Column';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { ConfigurableTableRow } from './ConfigurableTableRow';
import { Row } from './Row';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
    },
    tableHeaderCell: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    tableHeaderCellConfigColumns: {
        width: '16px',
    },
    tableHeaderCellConfigColumnsButton: {
        padding: 0,
    },
}));

export enum SortDirection {
    ASCENDING = 'ASCENDING',
    DESCENDING = 'DESCENDING'
}

export interface ConfigurableTableProps {
    rows: Row[];
    columns: Column[];
    sortColumnId: string;
    sortDirection: SortDirection;
    onSortChange: (sortColumnId: string, sortDirection: SortDirection) => void;
    onSetColumns: (columns: Column[]) => void;
}

const defaultSort = (a: any, b: any) => {
    if (a > b) {
        return 1;
    }
    if (a < b) {
        return -1;
    }
    return 0;
};

export function ConfigurableTable(props: ConfigurableTableProps) {
    const classes = useStyles();
    const [showColumnsConfig, setShowColumnsConfig] = React.useState<boolean>(false);
    const [rows, setRows] = React.useState<Row[]>([]);

    useEffect(() => {
        const sortedColumn = props.columns.filter(c => c.id === props.sortColumnId)[0] || props.columns[0];
        const newRows = Array.from(props.rows);
        newRows.sort((a, b) => {
            const aVal = a[sortedColumn.id];
            const bVal = b[sortedColumn.id];
            const cmp = (sortedColumn.compare || defaultSort)(aVal, bVal);
            return (props.sortDirection === SortDirection.ASCENDING ? 1 : -1) * cmp;
        });
        setRows(newRows);
    }, [props.rows, props.columns, props.sortColumnId, props.sortDirection]);

    const handleColumnClick = React.useCallback((column: Column) => {
        if (props.sortColumnId === column.id) {
            doSetSortDirection(props.sortDirection === SortDirection.ASCENDING ? SortDirection.DESCENDING : SortDirection.ASCENDING);
        } else {
            doSetSort(column.id);
        }

        function doSetSortDirection(dir: SortDirection) {
            props.onSortChange(props.sortColumnId, dir);
        }

        function doSetSort(columnId: string) {
            props.onSortChange(columnId, props.sortDirection);
        }
    }, [props.sortColumnId, props.sortDirection, props.columns, props.onSortChange]);

    const filteredColumns = props.columns.filter(
        column => (('visible' in column) ? column.visible : true),
    );
    return (<Paper className={classes.root}>
        <ColumnConfigDialog
            onClose={() => setShowColumnsConfig(false)}
            open={showColumnsConfig}
            columns={props.columns}
            onColumnsChange={newColumns => props.onSetColumns(newColumns)}
        />

        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        {filteredColumns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                className={classes.tableHeaderCell}
                                onClick={() => handleColumnClick(column)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: column.align === 'right' ? 'end' : 'start',
                                    }}
                                >
                                    {column.label}
                                    {props.sortColumnId === column.id ? (
                                        props.sortDirection === SortDirection.ASCENDING ? (
                                            <ArrowDropDownIcon/>
                                        ) : (
                                            <ArrowDropUpIcon/>
                                        )
                                    ) : null}
                                </div>
                            </TableCell>
                        ))}
                        <TableCell
                            className={`${classes.tableHeaderCell} ${
                                classes.tableHeaderCellConfigColumns
                            }`}
                        >
                            <IconButton
                                color="primary"
                                className={classes.tableHeaderCellConfigColumnsButton}
                                onClick={() => setShowColumnsConfig(true)}
                            >
                                <ViewColumnIcon color="primary"/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        return (<ConfigurableTableRow key={row.id} row={row} columns={filteredColumns}/>);
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Paper>);
}

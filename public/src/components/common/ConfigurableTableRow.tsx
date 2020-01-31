import { TableCell, TableRow } from '@material-ui/core';
import React from 'react';
import { Column } from './Column';

export interface ConfigurableTableRowProps {
    row: any;
    columns: Column[];
}

export function ConfigurableTableRow(props: ConfigurableTableRowProps) {
    return (<TableRow hover role="checkbox" tabIndex={-1}>
        {props.columns.map((column) => {
            const value = props.row[column.id];
            return (
                <TableCell key={column.id} align={column.align}>
                    {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value}
                </TableCell>
            );
        })}
        <TableCell/>
    </TableRow>);
}
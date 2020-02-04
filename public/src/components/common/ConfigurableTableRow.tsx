import { Collapse, IconButton, TableCell, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import React from 'react';
import { Column } from './Column';

const useStyles = makeStyles(theme => ({
    detailsButton: {
        padding: 0,
    },
    detailsCell: {
        padding: 0,
    },
    detailsIcon: {
        transitionDuration: theme.transitions.duration.standard,
        transitionProperty: 'transform',
    } as any,
    detailsIconExpanded: {
        transform: 'rotate(90deg)',
    },
    detailsIconCollapsed: {
        transform: 'rotate(0deg)',
    },
}));

export interface ConfigurableTableRowProps {
    row: any;
    columns: Column[];
    renderDetails?: (row: any) => any;
    configurableColumns: boolean;
}

const mouseDownLocation = {
    clickCount: 0,
    screenX: 0,
    screenY: 0,
    time: 0,
};

export function ConfigurableTableRow(props: ConfigurableTableRowProps) {
    const classes = useStyles();
    const [showRowDetails, setShowRowDetails] = React.useState(false);
    const [hideRowDetails, setHideRowDetails] = React.useState(false);

    const toggleRowDetails = React.useCallback(() => {
        if (showRowDetails) {
            setHideRowDetails(true);
        } else {
            setHideRowDetails(false);
            setShowRowDetails(true);
        }
    }, [showRowDetails]);

    const handleRowDetailsButtonClick = React.useCallback(() => {
        mouseDownLocation.clickCount++;
        toggleRowDetails();
    }, [showRowDetails]);

    const handleCloseAnimationComplete = React.useCallback(() => {
        if (hideRowDetails) {
            setShowRowDetails(false);
            setHideRowDetails(false);
        }
    }, [hideRowDetails]);

    const handleRowMouseDown = (evt: any) => {
        if (Date.now() - mouseDownLocation.time > 1000) {
            mouseDownLocation.time = Date.now();
            mouseDownLocation.screenX = evt.screenX;
            mouseDownLocation.screenY = evt.screenY;
            mouseDownLocation.clickCount = 1;
        } else {
            mouseDownLocation.clickCount++;
        }
    };

    const handleRowMouseUp = (evt: any) => {
        const screenX = evt.screenX;
        const screenY = evt.screenY;
        setTimeout(() => {
            if (
                mouseDownLocation.clickCount === 1 &&
                Math.abs(screenX - mouseDownLocation.screenX) < 5 &&
                Math.abs(screenY - mouseDownLocation.screenY) < 5
            ) {
                toggleRowDetails();
            }
        }, 200);
    };

    const detailsIconClassName = clsx(
        classes.detailsIcon,
        !showRowDetails || hideRowDetails ? classes.detailsIconCollapsed : classes.detailsIconExpanded,
    );

    const results = [
        <TableRow
            key="summary"
            hover
            role="checkbox"
            tabIndex={-1}
            onMouseDown={handleRowMouseDown}
            onMouseUp={handleRowMouseUp}
        >
            {props.renderDetails ? (
                <TableCell>
                    <IconButton color="primary" className={classes.detailsButton} onClick={handleRowDetailsButtonClick}>
                        <ChevronRightIcon className={detailsIconClassName} />
                    </IconButton>
                </TableCell>
            ) : null}
            {props.columns.map(column => {
                const value = props.row[column.id];
                return (
                    <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                );
            })}
            {props.configurableColumns ? <TableCell /> : null}
        </TableRow>,
    ];

    if (showRowDetails && props.renderDetails) {
        results.push(
            <TableRow key="details">
                <TableCell className={classes.detailsCell} colSpan={props.columns.length + 2}>
                    <Collapse appear={true} in={!hideRowDetails} onExited={handleCloseAnimationComplete}>
                        {props.renderDetails(props.row)}
                    </Collapse>
                </TableCell>
            </TableRow>,
        );
    }

    return <React.Fragment>{results}</React.Fragment>;
}

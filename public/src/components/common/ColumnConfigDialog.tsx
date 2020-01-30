import React from 'react';
import { ColumnConfigList } from './ColumnConfigList';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import { Column } from './Column';

const useStyles = makeStyles(theme => ({
    dialogTitle: {
        display: 'flex',
        flexDirection: 'row',
    },
    dialogTitleText: {
        marginRight: '40px',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        marginLeft: '5px',
    },
}));

export interface ColumnConfigDialogProps {
    onClose: () => void;
    open: boolean;
    columns: Column[];
    onColumnsChange: (columns: Column[]) => void;
}

export function ColumnConfigDialog(props: ColumnConfigDialogProps) {
    const classes = useStyles();

    return (<Dialog
        onClose={() => props.onClose()}
        aria-labelledby="simple-dialog-title"
        open={props.open}
    >
        <DialogTitle disableTypography className={classes.dialogTitle}>
            <Typography variant="h6" className={classes.dialogTitleText}>
                Configure Columns
            </Typography>
            <IconButton
                aria-label="close"
                className={classes.closeButton}
                onClick={props.onClose}
            >
                <CloseIcon/>
            </IconButton>
        </DialogTitle>
        <DialogContent dividers>
            <ColumnConfigList
                columns={props.columns}
                onColumnsChange={columns => props.onColumnsChange(columns)}
            />
        </DialogContent>
    </Dialog>);
}

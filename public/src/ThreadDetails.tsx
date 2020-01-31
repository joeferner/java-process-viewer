import React from 'react';
import { Thread } from 'jstack-parser/src/index';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    details: {
        padding: '16px',
    },
}));

export interface ThreadDetailsProps {
    thread: Thread
}

export function ThreadDetails(props: ThreadDetailsProps) {
    const classes = useStyles();

    return (<div className={classes.details}>
        {props.thread.stackItems.map((item, index) => {
            return (<div key={index}>{item.line}</div>);
        })}
    </div>);
}
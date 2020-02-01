import { makeStyles } from '@material-ui/core';
import { Thread } from 'jstack-parser/src/index';
import React from 'react';

const useStyles = makeStyles(theme => ({
    details: {
        padding: '16px',
        fontFamily: 'monospace',
    },
}));

export interface ThreadDetailsProps {
    thread: Thread;
}

export function ThreadDetails(props: ThreadDetailsProps) {
    const classes = useStyles();

    return (
        <div className={classes.details}>
            {props.thread.stackItems.length === 0
                ? 'No stack trace'
                : props.thread.stackItems.map((item, index) => {
                      return <div key={index}>{item.line}</div>;
                  })}
        </div>
    );
}

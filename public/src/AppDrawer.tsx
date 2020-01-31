import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    drawerTitle: {
        margin: '8px',
    },
    drawerList: {
        width: 250,
    },
}));

export interface AppDrawerProps {
    drawerOpen: boolean;
    handleDrawerClose: () => void;
}

export function AppDrawer(props: AppDrawerProps) {
    const classes = useStyles();
    const history = useHistory();

    const handleProcessesClick = React.useCallback(() => {
        props.handleDrawerClose();
        history.push('/');
    }, [props.handleDrawerClose]);

    return (
        <Drawer open={props.drawerOpen} onClose={props.handleDrawerClose}>
            <div className={classes.drawerList} role="presentation">
                <Typography variant="h6" color="inherit" noWrap className={classes.drawerTitle}>
                    Java Process Viewer
                </Typography>
                <Divider />
                <List>
                    <ListItem button onClick={() => handleProcessesClick()}>
                        <ListItemIcon>
                            <ListIcon />
                        </ListItemIcon>
                        <ListItemText primary="Processes" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
}

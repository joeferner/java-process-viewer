import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { AppDrawer } from './AppDrawer';
import { ProcessDetails } from './ProcessDetails';
import { ProcessList } from './ProcessList';

const useStyles = makeStyles(theme => ({
    toolbar: {
        display: 'flex',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    drawerTitle: {
        margin: '8px',
    },
    drawerList: {
        width: 250,
    },
}));

export function App() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleDrawerOpen = React.useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const handleDrawerClose = React.useCallback(() => {
        setDrawerOpen(false);
    }, []);

    return (
        <HashRouter>
            <AppBar position="relative">
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        Java Process Viewer
                    </Typography>
                </Toolbar>
                <AppDrawer drawerOpen={drawerOpen} handleDrawerClose={handleDrawerClose} />
            </AppBar>

            <Route exact path="/" component={ProcessList} />
            <Route path="/pid/:pid" component={ProcessDetails} />
        </HashRouter>
    );
}

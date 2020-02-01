import { AppBar, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { AppDrawer } from './AppDrawer';
import { ProcessDetails } from './ProcessDetails';
import { ProcessList } from './ProcessList';
import { RefreshButton } from './components/navbar/RefreshButton';
import { AppContext } from './AppContext';

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

let refreshTimeout: any | undefined = undefined;

export function App() {
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [refreshInterval, setRefreshInterval] = React.useState(-1);
    const [refreshSignal, setRefreshSignal] = React.useState(0);

    const handleDrawerOpen = React.useCallback(() => {
        setDrawerOpen(true);
    }, []);

    const handleDrawerClose = React.useCallback(() => {
        setDrawerOpen(false);
    }, []);

    const refresh = React.useCallback((interval: number) => {
        setRefreshSignal(Date.now());
        if (interval > 0) {
            refreshTimeout = setTimeout(() => {
                refresh(interval);
            }, interval);
        }
    }, []);

    const handleRefreshIntervalChange = React.useCallback(
        newRefreshInterval => {
            if (refreshTimeout) {
                clearTimeout(refreshTimeout);
                refreshTimeout = 0;
            }
            setRefreshInterval(newRefreshInterval);
            if (newRefreshInterval > 0) {
                refreshTimeout = setTimeout(() => {
                    refresh(newRefreshInterval);
                }, newRefreshInterval);
            }
        },
        [refreshInterval],
    );

    const handleRefreshClick = React.useCallback(() => {
        if (refreshTimeout) {
            clearTimeout(refreshTimeout);
            refreshTimeout = 0;
        }
        refresh(refreshInterval);
    }, [refreshInterval]);

    const handleLoadingChange = React.useCallback(newLoading => {
        setLoading(newLoading);
    }, []);

    return (
        <HashRouter>
            <AppContext.Provider
                value={{
                    refreshSignal,
                    onLoadingChange: handleLoadingChange,
                }}
            >
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
                        <RefreshButton
                            onRefreshIntervalChanged={handleRefreshIntervalChange}
                            refreshInterval={refreshInterval}
                            onClick={handleRefreshClick}
                            loading={loading}
                        />
                    </Toolbar>
                    <AppDrawer drawerOpen={drawerOpen} handleDrawerClose={handleDrawerClose} />
                </AppBar>

                <Switch>
                    <Route path="/pid/:pid" component={ProcessDetails} />
                    <Route component={ProcessList} />
                </Switch>
            </AppContext.Provider>
        </HashRouter>
    );
}

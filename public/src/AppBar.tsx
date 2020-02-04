import { AppBar as MaterialAppBar, IconButton, makeStyles, Tab, Tabs, Toolbar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { RefreshButton } from './components/navbar/RefreshButton';
import React from 'react';
import { useHistory } from 'react-router-dom';

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
}));

export interface AppBarProps {
    handleRefreshIntervalChange: (newRefreshInterval: number) => void;
    refreshInterval: number;
    handleRefreshClick: () => void;
    loading: boolean;
}

export function AppBar(props: AppBarProps) {
    const history = useHistory();
    const classes = useStyles();

    const handleHomeClick = React.useCallback(() => {
        history.push('/');
    }, [history]);

    const handleTabChange = React.useCallback((event, newTab) => {
        switch (newTab) {
            case 'threads':
                break;
            default:
                throw new Error(`unhandled tab: ${newTab}`);
        }
    }, []);

    const locationPath = history.location.pathname;
    let currentTab: string | boolean;
    let tabsDisabled: boolean;

    if (locationPath.match(/pid\/([0-9]+)\/threads/)) {
        tabsDisabled = false;
        currentTab = 'threads';
    } else {
        tabsDisabled = true;
        currentTab = false;
    }

    return (
        <MaterialAppBar position="relative">
            <Toolbar className={classes.toolbar}>
                <IconButton color="inherit" onClick={handleHomeClick} edge="start" className={classes.menuButton}>
                    <HomeIcon />
                </IconButton>
                <div style={{ flexGrow: 1 }}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        <Tab value="threads" label="Threads" disabled={tabsDisabled} />
                    </Tabs>
                </div>
                <RefreshButton
                    onRefreshIntervalChanged={props.handleRefreshIntervalChange}
                    refreshInterval={props.refreshInterval}
                    onClick={props.handleRefreshClick}
                    loading={props.loading}
                />
            </Toolbar>
        </MaterialAppBar>
    );
}

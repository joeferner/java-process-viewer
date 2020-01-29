import {AppBar, makeStyles, Toolbar, Typography} from '@material-ui/core';
import React from 'react';
import {HashRouter, Route} from 'react-router-dom';
import {Home} from './Home';

const useStyles = makeStyles(theme => ({
    toolbar: {
        display: 'flex',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
}));

export function App() {
    const classes = useStyles();

    return (
        <HashRouter>
            <AppBar position="relative">
                <Toolbar className={classes.toolbar}>
                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                        Java Process Viewer
                    </Typography>
                </Toolbar>
            </AppBar>

            <main>
                <div>
                    <Route exact path="/" component={Home}/>
                </div>
            </main>
        </HashRouter>
    );
}

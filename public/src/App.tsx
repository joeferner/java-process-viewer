import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Threads } from './Threads';
import { ProcessList } from './ProcessList';
import { AppContext } from './AppContext';
import { AppBar } from './AppBar';

let refreshTimeout: any | undefined = undefined;

export function App() {
    const [loading, setLoading] = React.useState(false);
    const [refreshInterval, setRefreshInterval] = React.useState(-1);
    const [refreshSignal, setRefreshSignal] = React.useState(0);

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
                <AppBar
                    handleRefreshClick={handleRefreshClick}
                    handleRefreshIntervalChange={handleRefreshIntervalChange}
                    loading={loading}
                    refreshInterval={refreshInterval}
                />
                <Switch>
                    <Route path="/pid/:pid/threads" component={Threads} />
                    <Route component={ProcessList} />
                </Switch>
            </AppContext.Provider>
        </HashRouter>
    );
}

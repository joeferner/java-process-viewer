import React from 'react';

export interface AppContextData {
    refreshSignal: number;
    onLoadingChange: (loading: boolean) => void;
}

export const AppContext = React.createContext<AppContextData>({
    refreshSignal: 0,
    onLoadingChange: () => {},
});

import { InputAdornment, TextField, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

export interface SearchTextBoxProps {
    className: string;
    value: string;
    onChange: (str: string) => void;
}

export function SearchTextBox(props: SearchTextBoxProps) {
    return (<TextField
        className={props.className}
        type={'search'}
        value={props.value}
        placeholder={'Search'}
        onChange={(evt) => props.onChange(evt.target.value)}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <Tooltip title={'Search'}>
                        <SearchIcon/>
                    </Tooltip>
                </InputAdornment>
            ),
        }}
    />);
}
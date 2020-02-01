import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    buttonLoading: {
        backgroundColor: '#e0e0e0 !important', // TODO cannot find this color in theme
    },
    refreshTextContainer: {
        color: 'black',
        paddingBottom: '4px',
    },
}));

interface Option {
    value: number;
    label: string;
}

const options: Option[] = [
    { value: -1, label: 'Off' },
    { value: 1000, label: '1s' },
    { value: 5000, label: '5s' },
    { value: 10000, label: '10s' },
    { value: 30000, label: '30s' },
    { value: 60000, label: '1m' },
];

export interface RefreshButtonProps {
    onRefreshIntervalChanged: (interval: number) => void;
    refreshInterval: number;
    onClick: () => void;
    loading: boolean;
}

export function RefreshButton(props: RefreshButtonProps) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<any>(null);

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleMenuItemClick = React.useCallback(
        (option: Option) => {
            props.onRefreshIntervalChanged(option.value);
            setOpen(false);
        },
        [props.onRefreshIntervalChanged],
    );

    const handleClose = React.useCallback(
        (event: any) => {
            if (anchorRef.current?.contains(event.target)) {
                return;
            }
            setOpen(false);
        },
        [anchorRef],
    );

    return (
        <div className={classes.root}>
            <ButtonGroup variant="contained" color="default" ref={anchorRef} aria-label="split button">
                <Button
                    onClick={props.onClick}
                    className={props.loading ? classes.buttonLoading : undefined}
                    disabled={props.loading}
                >
                    <div className={classes.refreshTextContainer}>
                        Refresh
                        <LinearProgress
                            style={{
                                visibility: props.loading ? 'visible' : 'hidden',
                                height: '1px',
                                marginTop: '-5px',
                            }}
                            variant="query"
                            color="primary"
                        />
                    </div>
                </Button>
                <Button
                    color="inherit"
                    size="small"
                    style={{ textTransform: 'none', color: 'black' }}
                    onClick={handleToggle}
                >
                    {options.filter(opt => opt.value === props.refreshInterval).map(opt => opt.label)}
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu">
                                    {options.map((option, index) => (
                                        <MenuItem
                                            key={option.value}
                                            selected={props.refreshInterval === option.value}
                                            onClick={() => handleMenuItemClick(option)}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}

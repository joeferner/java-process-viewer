import React from 'react';
import {
    Checkbox,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    RootRef,
} from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import ReorderIcon from '@material-ui/icons/Reorder';
import { Column } from './Column';

function reorder(list: any[], startIndex: number, endIndex: number): any[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

export interface ColumnConfigListProps {
    columns: Column[];
    onColumnsChange: (columns: Column[]) => void;
}

export function ColumnConfigList(props: ColumnConfigListProps) {
    const columns = props.columns;

    const handleColumnCheck = React.useCallback((columnId, checked) => {
        props.onColumnsChange(setColumn(checked));

        function setColumn(val: boolean): Column[] {
            return props.columns.map((column) => {
                return {
                    ...column,
                    visible: (column.id === columnId ? val : ('visible' in column ? column.visible : true)),
                };
            });
        }
    }, [props.columns, props.onColumnsChange]);

    const onDragEnd = React.useCallback((result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newList = reorder(
            columns,
            result.source.index,
            result.destination.index,
        );
        props.onColumnsChange(newList);
    }, []);

    return (<DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
            {(droppableProvided) => (
                <RootRef rootRef={droppableProvided.innerRef}>
                    <List>
                        {columns.map((column, index) => (
                            <Draggable
                                key={column.id}
                                draggableId={column.id}
                                index={index}
                            >
                                {(provided) => (
                                    <ListItem
                                        key={column.id}
                                        ContainerComponent="li"
                                        ContainerProps={{
                                            ref: provided.innerRef,
                                            ...provided.draggableProps,
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                checked={'visible' in column ? column.visible : true}
                                                onChange={evt => handleColumnCheck(column.id, evt.target.checked)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText>{column.label}</ListItemText>
                                        <ListItemSecondaryAction {...provided.dragHandleProps}>
                                            <ReorderIcon color="disabled"/>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                            </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                    </List>
                </RootRef>
            )}
        </Droppable>
    </DragDropContext>);
}

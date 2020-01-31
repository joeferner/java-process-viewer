import React, { useEffect } from 'react';
import { ConfigurableTable, SortDirection } from './components/common/ConfigurableTable';
import { Column } from './components/common/Column';
import { getProcessDetails } from './data';

const initialColumns: Column[] = [
    { id: 'javaThreadId', label: 'ID', minWidth: 20 },
    { id: 'state', label: 'State', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'osPriority', label: 'OS Priority', minWidth: 20, visible: false },
    { id: 'priority', label: 'Priority', minWidth: 20, visible: false },
    { id: 'tid', label: 'TID', minWidth: 150, visible: false },
    { id: 'nid', label: 'NID', minWidth: 20, visible: false },
    { id: 'stackMemoryRegion', label: 'Stack Memory Region', minWidth: 50, visible: false },
    { id: 'info', label: 'Info', minWidth: 170 },
];

export interface ProcessDetailsProps {
    match: {
        params: {
            pid: string
        }
    }
}

export function ProcessDetails(props: ProcessDetailsProps) {
    const { pid } = props.match.params;
    const [columns, setColumns] = React.useState<Column[]>(initialColumns);
    const [rows, setRows] = React.useState<any[]>([]);
    const [sortColumnId, setSortColumnId] = React.useState<string>('javaThreadId');
    const [sortDirection, setSortDirection] = React.useState<SortDirection>(SortDirection.ASCENDING);

    const refresh = async () => {
        const details = await getProcessDetails(parseInt(pid, 10));
        const newRows = details.threads.map(thread => {
            return {
                id: thread.tid,
                ...thread,
            };
        });
        setRows(newRows);
    };

    useEffect(() => {
        refresh();
    }, [pid]);

    return (<div>
        <ConfigurableTable
            rows={rows}
            columns={columns}
            sortColumnId={sortColumnId}
            sortDirection={sortDirection}
            onSetColumns={(newColumns) => setColumns(newColumns)}
            onSortChange={(newSortColumnId, newSortDirection) => {
                setSortColumnId(newSortColumnId);
                setSortDirection(newSortDirection);
            }}
        />
    </div>);
}
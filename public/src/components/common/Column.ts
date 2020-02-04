export interface Column {
    id: string;
    visible?: boolean;
    label: string;
    format?: (value: any) => string;
    minWidth: number;
    align?: 'right' | 'left';
    compare?: (a: any, b: any) => number;
}

export const numberColumn = {
    format: (value: any) => {
        return (value as Number).toLocaleString();
    },
    compare: (a: any, b: any) => {
        if (a === b) {
            return 0;
        }
        if (!a) {
            return 1;
        }
        if (!b) {
            return -1;
        }
        return a > b ? 1 : -1;
    },
};

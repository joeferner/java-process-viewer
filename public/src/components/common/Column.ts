export interface Column {
    id: string;
    visible?: boolean;
    label: string;
    format?: (value: any) => string;
    minWidth: number;
    align?: 'right' | 'left';
    compare?: (a: any, b: any) => number;
}

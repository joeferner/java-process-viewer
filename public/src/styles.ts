import {CSSProperties} from "@material-ui/styles/withStyles/withStyles";

export interface CenterOptions {
    width?: number;
    height?: number;
    centerContent?: boolean;
}

export function center(options?: CenterOptions): CSSProperties {
    options = {
        width: 500,
        height: 500,
        ...(options || {})
    };
    const results: CSSProperties = {
        width: `${options.width}px`,
        height: `${options.height}px`,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'auto'
    };
    if (options.centerContent) {
        results.display = 'flex';
        results.justifyContent = 'center';
        results.alignItems = 'center';
    }
    return results;
}
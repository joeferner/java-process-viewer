import yargs from 'yargs';
import {start} from './server';

const argv = yargs.options({
    port: {type: 'number', alias: 'p', default: 8080},
    jps: {type: 'string', default: 'jps'}
}).argv;

async function begin() {
    start({
        port: argv.port,
        jpsCommand: argv.jps
    });
}

begin().catch(err => {
    console.error('Failed to initialize', err);
});

import yargs from 'yargs';
import {start} from './server';

const argv = yargs.options({
    port: {type: 'number', alias: 'p', default: 8080}
}).argv;

async function begin() {
    start({
        port: argv.port
    });
}

begin().catch(err => {
    console.error('Failed to initialize', err);
});

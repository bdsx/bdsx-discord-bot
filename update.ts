
import * as child_process from 'child_process';
import { botlog } from './botlog';
import { client } from './client';

function shell(cmd:string):void {
    child_process.execSync(cmd, {stdio:'inherit'});
}

export async function updateBot():Promise<void> {
    await botlog('git pull');
    shell('git pull');
    await botlog('npm i');
    shell('npm i');
    await botlog('npm run build');
    shell('npm run build');
    await botlog('Closing');
    client.destroy();
}

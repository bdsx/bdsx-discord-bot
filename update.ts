
import * as child_process from 'child_process';
import { botlog } from './botlog';
import { client } from './client';

function shell(cmd:string):void {
    child_process.execSync(cmd, {stdio:'inherit'});
}

export async function updateBot():Promise<void> {
    shell('git pull');
    shell('npm i');
    shell('npm run build');
    await botlog('Stopped');
    client.destroy();
}

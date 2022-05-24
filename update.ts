
import * as child_process from 'child_process';
import { BotConsole } from './botlog';

function shell(cmd:string, console:BotConsole):Promise<number|null> {
    console.log('> ' + cmd);
    return new Promise(resolve=>{
        const cp = child_process.exec(cmd);
        cp.stdout!.on('data', data=>{
            console.write(data);
        });
        cp.stderr!.on('data', data=>{
            console.write(data);
        });
        cp.on('exit', code=>{
            resolve(code);
        })
    });
}

export async function updateBot():Promise<void> {
    const console = new BotConsole;
    await shell('git pull', console);
    await shell('npm i', console);
    await shell('npm run build', console);
    console.log('Closing');
    await console.flush();
    process.exit(0);
}

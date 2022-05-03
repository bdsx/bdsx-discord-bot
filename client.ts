import { Client } from "discord.js";

export const client = new Client({
    intents: [32767]
});

let readyListeners:(()=>void)[]|null = [];

export function onReady(cb:()=>void):void {
    if (readyListeners === null) cb();
    else readyListeners.push(cb);
}

client.on('ready', ()=>{
    for (const listener of readyListeners!) {
        listener();
    }
    readyListeners = null;
});

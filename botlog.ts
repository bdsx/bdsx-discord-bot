import { Message, MessageEmbed, TextChannel } from "discord.js";
import { client } from "./client";
import * as util from 'util';

const TARGET_CHANNEL_NAME = 'bot-log';

export async function botlog(message:string):Promise<void> {
    message = '```\n'+message+'\n```';
    const list = await client.guilds.fetch();

    const promises = list.map(guildAuth=>(async()=>{
        const guild = await guildAuth.fetch();
        const channels = await guild.channels.fetch();
        const botChannel = channels.find(channel=>channel.name === TARGET_CHANNEL_NAME);
        if (botChannel instanceof TextChannel) {
            await botChannel.send(message);
        }
    })());
    await Promise.all(promises);
}

export class BotConsole {
    private message = '```\n';
    private msgs:Message[]|null = null;
    private updated = false;
    private updating:Promise<void>|null = null;

    private async _update():Promise<void> {
        if (this.updating !== null) {
            this.updated = true;
            return;
        }

        let updatingResolver:(()=>void)|null = null;
        this.updating = new Promise(resolve=>{
            updatingResolver = resolve;
        });

        for (;;) {
            const out = this.message+'```';
            if (this.msgs === null) {
                const list = await client.guilds.fetch();
                const proms = list.map(guildAuth=>(async()=>{
                    const guild = await guildAuth.fetch();
                    const channels = await guild.channels.fetch();
                    const botChannel = channels.find(channel=>channel.name === TARGET_CHANNEL_NAME);
                    if (botChannel instanceof TextChannel) {
                        return await botChannel.send(out);
                    }
                    return null;
                })());
                this.msgs = (await Promise.all(proms)).filter(msg=>msg !== null) as Message[];
            } else {
                this.msgs = await Promise.all(this.msgs.map(item=>item.edit(out)));
            }
            await new Promise(resolve=>setTimeout(resolve, 1000));
            if (!this.updated) break;
            else this.updated = false;
        }

        this.updating = null;
        updatingResolver!();
    }

    write(message:string):void {
        this.message += message;
        this._update();
    }

    log(...message:unknown[]):void {
        for (const msg of message) {
            if (typeof msg === 'string')  {
                this.message += msg;
            } else {
                this.message += util.inspect(msg);
            }
            this.message += '\n';
            this._update();
        }
    }

    flush():Promise<void> {
        return this.updating ?? Promise.resolve();
    }
}

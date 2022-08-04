import { DMChannel, Message, PartialDMChannel, PartialMessage, TextChannel } from "discord.js";
import { botlog } from "./botlog";
import { client } from "./client";

type DMMessage = Message&{channel:DMChannel|PartialDMChannel};
type ChannelMessage = Message&{channel:TextChannel};

const dmListeners:((message:DMMessage)=>void)[] = [];
const targets = new Map<string, ChannelTarget<ChannelMessage>>();

export class ChannelTarget<ChannelType> {
    private readonly messageListeners:((msg:Message&{channel:ChannelType})=>void)[] = [];
    private readonly deleteListeners:((msg:(Message|PartialMessage)&{channel:ChannelType})=>void)[] = [];

    fire(event:string, param:any):void {
        let list:((param:any)=>void)[];
        switch (event) {
        case 'message':
            list = this.messageListeners;
            break;
        case 'delete':
            list = this.deleteListeners;
            break;
        default:
            return;
        }
        for (const cb of list) {
            try {
                cb(param);
            } catch (err) {
                botlog((err instanceof Error ? err.stack : err)+'');
            }
        }
    }

    on(event:'message', cb:(param:Message&{channel:ChannelType})=>void):void;
    on(event:'delete', cb:(param:(Message|PartialMessage)&{channel:ChannelType})=>void):void;

    on(event:string, cb:(param:any)=>void):void {
        switch (event) {
        case 'message':
            this.messageListeners.push(cb);
            break;
        case 'delete':
            this.deleteListeners.push(cb);
            break;
        }
    }

    static getInstance(name:string):ChannelTarget<ChannelMessage> {
        let target = targets.get(name);
        if (target == null) targets.set(name, target = new ChannelTarget);
        return target;
    }
}

export function onDmEvent(cb:(message:DMMessage)=>void):void {
    dmListeners.push(cb);
}

client.on('messageDelete', msg=>{
    switch (msg.channel.type) {
    case 'DM':
        break;
    case 'GUILD_TEXT':
        const target = targets.get(msg.channel.name);
        if (target != null) {
            target.fire('delete', msg);
        }
        break;
    }
});

client.on('messageCreate', msg=>{
    switch (msg.channel.type) {
    case 'DM':
        for (const listener of dmListeners) {
            listener(msg as DMMessage);
        }
        break;
    case 'GUILD_TEXT':
        const target = targets.get(msg.channel.name);
        if (target != null) {
            target.fire('message', msg);
        }
        break;
    }
});

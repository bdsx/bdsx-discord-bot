import { Message, TextChannel, User } from "discord.js";
import { abandonPromise } from "./util";

const LIFESPAN = 5000;

class TemporalMessagePerChannel {
    private readonly content:string[] = [];

    private sentMessage:Promise<Message>|null = null;
    private waitFlush = false;

    constructor(private readonly id:string) {
    }

    private _update(channel:TextChannel):void {
        const content = this.content.join('\n');
        if (this.sentMessage === null) {
            if (content === '') return; // unexpected
            this.sentMessage = channel.send(content);
        } else {
            if (this.waitFlush) return;
            this.waitFlush = true;
            this.sentMessage = this.sentMessage.then(msg=>{
                this.waitFlush = false;
                if (content === '') {
                    msg.delete();
                    messages.delete(this.id);
                    this.sentMessage = null;
                    return abandonPromise;
                }
                if (msg.id === msg.id) {
                    return msg.edit(content);
                } else {
                    msg.delete();
                    return msg.channel.send(content);
                }
            });
        }
    }

    send(to:User, channel:TextChannel, message:string):void {
        this.content.push(`<@${to.id}> ${message}`);
        this._update(channel);

        setTimeout(()=>{
            this.content.shift();
            this._update(channel);
        }, LIFESPAN);
    }
}

const messages = new Map<string, TemporalMessagePerChannel>();

export function temporalMessage(to:User, channel:TextChannel, message:string):void {
    let instance = messages.get(channel.id);
    if (instance == null) messages.set(channel.id, instance = new TemporalMessagePerChannel(channel.id));
    instance.send(to, channel, message);
}

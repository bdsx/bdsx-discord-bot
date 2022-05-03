import { MessageEmbed, TextChannel } from "discord.js";
import { client } from "./client";

const TARGET_CHANNEL_NAME = 'bot-log';

export async function botlog(message:string|MessageEmbed):Promise<void> {
    if (typeof message === 'string') {
        message = new MessageEmbed()
            .setTimestamp()
            .setDescription(message);
    }
    const list = await client.guilds.fetch();

    const promises = list.map(guildAuth=>(async()=>{
        const guild = await guildAuth.fetch();
        const channels = await guild.channels.fetch();
        const botChannel = channels.find(channel=>channel.name === TARGET_CHANNEL_NAME);
        if (botChannel instanceof TextChannel) {
            await botChannel.send({embeds: [message as MessageEmbed]});
        }
    })());
    await Promise.all(promises);
}

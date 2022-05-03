
import { SlashCommandBuilder } from '@discordjs/builders';
import { botlog } from './botlog';
import { ChannelTarget } from './channelevent';
import { client, onReady } from './client';
import { registerCommand } from './command';
import { checkRole } from './role';
import { updateBot } from './update';
import data = require('./discord.json');

// Invitation Link: https://discord.com/api/oauth2/authorize?client_id=970738927638052915&permissions=8&scope=bot%20applications.commands
onReady(async()=>{
    botlog('Started');
});

// auto thread
const helpChannel = ChannelTarget.getInstance('help');
helpChannel.on('message', async(msg)=>{
    const author = msg.author;
    switch (msg.type) {
    case 'DEFAULT':
        await msg.startThread({
            name: `[${author.username}] ${msg.content.split('\n', 1)[0]}`,
        });
        break;
    default:
        await msg.delete();
        break;
    }
});
helpChannel.on('delete', async(msg)=>{
    if (msg.thread !== null) {
        await msg.thread.delete();
    }
});

// commmands
registerCommand(
    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('alive test'),
    null,
    async(interaction)=>{
        await interaction.reply('pong');
    }
);
registerCommand(
    new SlashCommandBuilder()
    .setName('update')
    .setDescription('update it from git'),
    null,
    async(interaction)=>{
        if (!checkRole(interaction, 'test')) {
            await interaction.reply('permission denied');
            return;
        }
        await interaction.reply('updating...');
        await updateBot();
    }
);

// login
client.login(data.token);


import { SlashCommandBuilder } from '@discordjs/builders';
import { botlog } from './botlog';
import { ChannelTarget } from './channelevent';
import { client, onReady } from './client';
import { registerCommand } from './command';
import { checkRole } from './role';
import { updateBot } from './update';
import data = require('./discord.json');

// set cwd to the project directory
process.chdir(__dirname);

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
        const firstLine = msg.content.split('\n', 1)[0];
        let name = `${firstLine.replace(/[^a-zA-Z0-9'() ]/g, ' ').replace(/ +/g, ' ')}`;
        if (name.length > 100) {
            name = name.substring(0, 97) + '...';
        }
        await msg.startThread({
            name,
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

// catch global error
const errorIgnores = new Set<string>([
    'WebSocket was closed before the connection was established',
]);
process.on('uncaughtException', err=>{
    if (errorIgnores.has(err.message)) return;
    botlog('```\n'+err.stack!+'\n```');
    console.error(err.stack);
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
        if (!checkRole(interaction, 'GitHub Member')) {
            await interaction.reply('```\npermission denied\n```');
            return;
        }
        await interaction.reply('```\nupdating...\n```');
        await updateBot();
    }
);

// login
client.login(data.token);

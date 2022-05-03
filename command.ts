
import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import { ApplicationCommandPermissionData, CacheType, CommandInteraction } from 'discord.js';
import { client, onReady } from './client';
import data = require('./discord.json');

const rest = new REST({ version: '9' }).setToken(data.token);
let commandJsons:RESTPostAPIApplicationCommandsJSONBody[]|null = null;

const commands = new Map<string, (interaction:CommandInteraction<CacheType>)=>Promise<void>|void>();
let commandPermissions:(ApplicationCommandPermissionData[]|null)[]|null = null;

export function registerCommand(
    builder:{toJSON():RESTPostAPIApplicationCommandsJSONBody},
    permissions:ApplicationCommandPermissionData[]|null,
    cb:(interaction:CommandInteraction<CacheType>)=>Promise<void>|void):void {
    const body = builder.toJSON();

    commands.set(body.name, cb);
    if (commandJsons === null) {
        commandJsons = [body];
        commandPermissions = [permissions];
        process.nextTick(async()=>{
            const cmdinfos = commandJsons!;
            const cmdpermissions = commandPermissions!;
            commandJsons = null;
            commandPermissions = null;

            for (const guildId of data.guilds) {
                await rest.put(
                    Routes.applicationGuildCommands(data.applicationId, guildId),
                    { body: cmdinfos }
                );
            }
            onReady(async()=>{
                for (const guildId of data.guilds) {
                    const guild = await client.guilds.fetch(guildId);
                    const commands = await guild.commands.fetch();
                    // let i=0;
                    // for (const [id, cmd] of commands) {
                    //     const permissions = cmdpermissions[i++];
                    //     if (permissions !== null) {
                    //         cmd.permissions.add({ permissions }); // ERROR: Bots cannot use this endpoint
                    //     }
                    // }
                }
            });
        });
    } else {
        commandJsons.push(body);
        commandPermissions!.push(permissions);
    }
}


client.on('interactionCreate', async(interaction) => {
	if (!interaction.isCommand()) return;
    const cb = commands.get(interaction.commandName);
    if (cb != null) await cb(interaction);
});

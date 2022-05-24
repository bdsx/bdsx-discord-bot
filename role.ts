import { APIInteractionGuildMember } from "discord-api-types";
import { Guild, GuildMember } from "discord.js";
import data = require('./discord.json');

const trusted = new Set(data.guilds);
export function checkRole(message:{guild:Guild|null, member:GuildMember|APIInteractionGuildMember|null}, roleName:string):boolean {
    const {guild, member} = message;
    if (member === null) return false;
    if (guild === null) return false;
    if (!trusted.has(guild.id)) return false;

    if (member instanceof GuildMember) {
        if (member.roles.cache.some(r=>r.name === roleName)) {
            return true;
        }
    } else {
        return false;
    }
    return false;
}

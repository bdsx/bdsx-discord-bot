import { APIInteractionGuildMember } from "discord-api-types";
import { Guild, GuildMember } from "discord.js";

export function checkRole(message:{guild:Guild|null, member:GuildMember|APIInteractionGuildMember|null}, roleName:string):boolean {
    const {guild, member} = message;
    if (member === null) return false;
    if (member instanceof GuildMember) {
        if (member.roles.cache.some(r=>r.name === roleName)) {
            return true;
        }
    } else {
        console.log(member.roles);
    }
    return false;
}

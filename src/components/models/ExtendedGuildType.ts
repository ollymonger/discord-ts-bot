import { Role } from "discord.js";

export interface ExtendedGuildType {
    guildId: string;
    guildName: string;
    guildRoles: Array<Role>;
}

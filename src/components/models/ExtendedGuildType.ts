import { Role } from "discord.js";

export interface ExtendedGuildType {
    guildId: `${bigint}`;
    guildName: string;
    guildRoles: Array<Role>;
}

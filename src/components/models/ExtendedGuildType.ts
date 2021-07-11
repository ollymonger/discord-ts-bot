import { Role } from "@typeit/discord/node_modules/discord.js";

export interface ExtendedGuildType {
    guildId: `${bigint}`;
    guildName: string
    guildRoles: Array<Role>;
}

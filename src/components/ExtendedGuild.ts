import { Role } from "discord.js";
import { ExtendedGuildType } from "./models/ExtendedGuildType";


export class ExtendedGuild {
    public readonly guildId: string;
    public readonly guildName: string;
    public readonly guildRoles: Array<Role>;

    constructor(data: ExtendedGuildType) {
        const {
            guildId, guildName, guildRoles
        } = data;
        this.guildId = guildId;
        this.guildName = guildName;
        this.guildRoles = guildRoles;
    }

}

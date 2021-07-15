import { PrismaClient } from "@prisma/client";
import { Index } from "../..";
import { ExtendedGuild } from "../ExtendedGuild";
import { GuildType } from "../models/GuildType";

const prisma = new PrismaClient();

export async function onJoin(guild: GuildType) {
    console.log(`[I] Bot join guild: ${guild[0].id}`);
    const query = await prisma.guilds.findFirst({
        where: {
            guildId: guild[0].id
        }
    })

    if (query !== null) {
        // Guild already exists
        return;
    }

    console.log("[I] Guild does not exist in database.");
    let newGuild = new ExtendedGuild({ guildId: guild[0].id, guildName: guild[0].name, guildRoles: guild[0].guildRoles });

    const insert = async (): Promise<void> => {
        try {
            await prisma.guilds.create({
                data: {
                    guildId: newGuild.guildId,
                    guildName: newGuild.guildName,
                    guildRoles: newGuild.guildRoles.toString()
                }
            })
            await Index.inGuilds.push({
                guildId: this.guildId,
                guildName: this.guildName,
                guildRoles: this.guildRoles
            });
            return;
        } catch (e) {
            console.error(e.message);
            return;
        }
    }

    insert();
    return;
}

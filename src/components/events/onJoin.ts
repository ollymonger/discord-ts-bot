import { PrismaClient } from "@prisma/client";
import { Role } from "discord.js";
import { Index } from "../..";
import { ExtendedGuild } from "../ExtendedGuild";
import { GuildType } from "../models/GuildType";

import * as JSONBigint from 'json-bigint';

const prisma = new PrismaClient();

export async function onJoin(guild: GuildType) {
    console.log(guild);

    const query = await prisma.guilds.findFirst({
        where: {
            guildId: guild.id
        }
    })

    if (query !== null) {
        // Guild already exists
        return;
    }

    console.log("[I] Guild does not exist in database.");
    let roles = await guild.roles.cache.map(r => r);

    let newGuild = new ExtendedGuild({ guildId: guild.id, guildName: guild.name, guildRoles: roles });
    const insert = async (): Promise<void> => {
        try {
            await prisma.guilds.create({
                data: {
                    guildId: newGuild.guildId,
                    guildName: newGuild.guildName,
                    guildRoles: JSONBigint.stringify(newGuild.guildRoles)
                }
            })
            await Index.inGuilds.push({
                guildId: newGuild.guildId,
                guildName: newGuild.guildName,
                guildRoles: newGuild.guildRoles
            });
            await console.log("[R] Inserted guild to database");
            await Index.updateStatus();
            return;
        } catch (e) {
            console.error(e.message);
            return;
        }
    }

    insert();
    return;
}

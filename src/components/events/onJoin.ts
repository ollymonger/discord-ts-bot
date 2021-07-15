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

    // Check to see whether query returns an object 
    if (query !== null) {
        // Guild already exists
        console.log("[I] Guild does exist in database.");
        // check to see if there is difference between cache/database & update DB if needed
        let roles = await guild.roles.cache.map(r => r);
        let joinedGuild = new ExtendedGuild({ guildId: guild.id, guildName: guild.name, guildRoles: roles });
        let detectChange = 0; // not detected change
        if (joinedGuild.guildName !== query.guildName) {
            detectChange = 1;
        }
        if (JSONBigint.stringify(joinedGuild.guildRoles) !== query.guildRoles) {
            detectChange = 1;
        }

        if (detectChange === 1) {
            // update DB
            console.log("[R] Change detected, updating DB and ExtendedGuild array");
            try {
                await prisma.guilds.update({
                    where: {
                        guildId: joinedGuild.guildId
                    },
                    data: { guildName: joinedGuild.guildName, guildRoles: JSONBigint.stringify(joinedGuild.guildRoles) }
                });
                await Index.inGuilds.push({
                    guildId: joinedGuild.guildId,
                    guildName: joinedGuild.guildName,
                    guildRoles: joinedGuild.guildRoles
                });
                await Index.updateStatus();
            } catch (e) {
                console.error(e.message);
            }
            return;
        }

        console.log("[R] No change detected, adding Guild to ExtendedGuild array");
        try {
            await Index.inGuilds.push({
                guildId: joinedGuild.guildId,
                guildName: joinedGuild.guildName,
                guildRoles: joinedGuild.guildRoles
            });
            await Index.updateStatus();
        } catch (e) {
            console.error(e.message);
        }
        return;
    }

    // Query is null
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

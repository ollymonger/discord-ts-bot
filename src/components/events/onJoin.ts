import { PrismaClient } from "@prisma/client";
import { Role } from "discord.js";
import { Index } from "../..";
import { ExtendedGuild } from "../ExtendedGuild";
import { GuildType } from "../models/GuildType";

const prisma = new PrismaClient();

export async function onJoin(guild: GuildType) {
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

        try {
            await prisma.guilds.update({
                where: {
                    guildId: joinedGuild.guildId
                },
                data: { guildName: joinedGuild.guildName, updatedAt: new Date() }
            });
            await prisma.guildRoles.deleteMany({
                where: { guildId: joinedGuild.guildId }
            });
            await joinedGuild.guildRoles.map(async r => {
                await prisma.guildRoles.create({
                    data: {
                        roleid: r.id,
                        guildId: r.guild.id,
                        name: r.name,
                        color: r.color,
                        hoist: r.hoist,
                        rawPosition: r.rawPosition,
                        permissions: r.permissions.bitfield,
                        managed: r.managed,
                        mentionable: r.mentionable,
                        deleted: r.deleted,
                        tags: JSON.stringify(r.tags),
                        createdTimestamp: r.createdAt
                    }
                });
            })
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
                    guildName: newGuild.guildName
                }
            })
            await newGuild.guildRoles.map(async r => {
                try {
                    await prisma.guildRoles.create({
                        data: {
                            roleid: r.id,
                            guildId: r.guild.id,
                            name: r.name,
                            color: r.color,
                            hoist: r.hoist,
                            rawPosition: r.rawPosition,
                            permissions: r.permissions.bitfield,
                            managed: r.managed,
                            mentionable: r.mentionable,
                            deleted: r.deleted,
                            tags: JSON.stringify(r.tags),
                            createdTimestamp: r.createdAt
                        }
                    })
                } catch (e) { console.error(e.message) }
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

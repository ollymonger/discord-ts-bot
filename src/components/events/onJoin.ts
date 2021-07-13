import { PrismaClient } from "@prisma/client";
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

    console.log("[I] Guild does not exist.");
    return;
}

import { PrismaClient } from "@prisma/client";
import { Discord, Guild, Option, Slash } from "@typeit/discord";
import { CommandInteraction } from "discord.js";

const prisma = new PrismaClient();

@Discord()
@Guild()
export abstract class Commands {
    @Slash("addword")
    async addword(@Option("word") word: string, interaction: CommandInteraction) {
        try {
            const date = new Date();
            let check = await prisma.wordVote.findFirst({
                where: {
                    createdAt: {
                        gte: new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000))
                    },
                    word: word
                }
            });

            if (check === null) {
                await prisma.wordVote.create({
                    data: {
                        word: word,
                        byGuild: interaction.guildId,
                        votesFor: 1,
                        votesAgainst: 0
                    }
                })
                await interaction.reply(`Word: ${word} does not exist`);
                return;
            }
            // Send embed with information like: Word, createdonguild, total votes for and against
            // send buttons to vote for, or against

            interaction.reply(`${check.word} was created on guild: ${check.byGuild}`);
            return;
        } catch (e) {
            console.error(e.message);
        }
    }
}

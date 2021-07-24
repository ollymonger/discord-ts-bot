import { Discord, Guild, Option, Slash } from "@typeit/discord";
import { CommandInteraction } from "discord.js";

@Discord()
@Guild()
abstract class Commands {
    @Slash("addword")
    async addword(@Option("word") word: string, interaction: CommandInteraction) {
        try {
            await interaction.reply(word);
        } catch (e) {
            console.error(e.message);
        }
    }
}

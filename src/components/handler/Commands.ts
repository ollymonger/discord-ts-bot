import { Discord, Guild, Option, Slash } from "@typeit/discord";
import { CommandInteraction } from "@typeit/discord/node_modules/discord.js";


@Discord()
@Guild()
export abstract class Commands {
    @Slash("addword")
    async addword(@Option("word") word: string, interaction: CommandInteraction) {
        console.log(word);
    }
}

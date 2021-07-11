import "reflect-metadata";
import { Client } from "@typeit/discord";
import { Intents } from "discord.js";


export class Index {
    // Initialise client
    public static client: Client;

    static get Client(): Client {
        return this.client;
    }

    static async start(): Promise<void> {
        this.client = new Client({
            intents: [
                // Bot permissions
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.DIRECT_MESSAGES,
                //Intents.FLAGS.GUILD_BANS - Grants ban permission.
            ],
            requiredByDefault: true
        });

        // Call login function
        await this.login();
    }

}

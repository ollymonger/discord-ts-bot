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

    //Login function
    static async login(): Promise<void> {
        console.log("[RUN] Login function");
        try {
            await this.client.login(
                process.env.TOKEN,
                //If there is an error with the token, it will catch the error and stop here and not run the ready function.
                `${__dirname}/components/*.ts`, // Directory route as string to load classes in npm run start
                `${__dirname}/components/*.js` // If you compile your bot, the file extension will be .js
            );

            await this.client.once("ready", async () => {
                //Called if login was successful.
                this.onReady();
            })
        } catch (e) {
            return console.error(e);
        }
        return;
    }

    //OnReady function
    static async onReady(): Promise<void> {
        console.log(`[I] Bot client is ready & logged in!`);
        return;
    }
}

Index.start();

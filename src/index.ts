import "reflect-metadata";
import { Client } from "@typeit/discord";
import { Intents } from "discord.js";

import * as dotenv from "dotenv";
import { ExtendedGuildType } from "./components/models/ExtendedGuildType";
import { ExtendedGuild } from "./components/ExtendedGuild";
dotenv.config({ path: __dirname + '/.env' });

export class Index {
    // Initialise client
    public static client: Client;

    // Initialise empty array of ExtendedGuildType
    public static inGuilds: Array<ExtendedGuildType> = [];

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
        console.log("[R] Login function");
        try {
            await this.client.login(
                process.env.TOKEN,
                //If there is an error with the token, it will catch the error and stop here and not run the ready function.
                `${__dirname}/components/*.ts`, // Directory route as string to load classes in npm run start
                `${__dirname}/components/*/*.ts`, // Directory route as string to load classes in npm run start
                `${__dirname}/components/*/*.js`, // If you compile your bot, the file extension will be .js
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
        // Try catch to get the botGuilds & log error if error
        try {
            await this.initialiseGuilds();
        } catch (e) {
            console.error(e.message);
            return;
        }
        return;
    }

    //getBotGuilds function
    static async getBotGuilds(): Promise<void> {
        console.log(`[I] Updating Guild array`);
        // Ensure that Guild array is empty.
        this.inGuilds = [];

        // Gather bot guilds 
        this.client.guilds.cache.map(guild => {
            const newGuild: ExtendedGuildType = {
                guildId: guild.id,
                guildName: guild.name,
                guildRoles: guild.roles.cache.map(role => role)
            };

            console.log(`[I] Added guild: ${guild.id} to array!`);
            this.inGuilds.push(new ExtendedGuild(newGuild));
        });

        return;
    }

    static async initialiseGuilds(): Promise<void> {
        console.log(`[I] Initialising guilds`)
        try { await this.getBotGuilds(); } catch (e) { console.error(e) }
        try { await this.client.clearSlashes(); } catch (e) { console.error(e) }

        await this.inGuilds.map(async guild => {
            try {
                console.log(`[I] Clearing guild slashes on: ${guild.guildId}`)
                await this.client.clearSlashes(guild.guildId);
                console.log(`[R] Cleared guild slashes on: ${guild.guildId}`);
            } catch (e) {
                console.error(`[E] ${e.message}`);
                return;
            }
        });

        await this.client.initSlashes();
        return;
    }
}

Index.start();

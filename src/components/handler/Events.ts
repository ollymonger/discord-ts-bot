import { Discord, On, Guild, Client, ArgsOf } from "@typeit/discord";
import { GuildType } from "../models/GuildType";
import { onJoin } from '../events/onJoin';
import { onMessage } from "../events/onMessage";
import { Index } from "../..";

@Discord()
@Guild()
export abstract class Events {
    @On("guildCreate")
    async join(guild: GuildType): Promise<void> {
        try {
            await onJoin(guild[0]);
        } catch (e) {
            return console.log(e.message);
        }
    }

    @On("messageCreate")
    async message(message: ArgsOf<"message">, client: Client): Promise<void> {
        try {
            if (message[0].channel.type === "DM" && message[0].author.id !== client.user.id) {
                let botOwner = await client.users.cache.find(m => m.id === "215499294130700298");
                let dm = botOwner.createDM();
                (await dm).send(`${message[0].author}(@${message[0].author.tag}) - ${message[0].content} @ ${new Date(message[0].createdTimestamp)}`);
                return;
            }
            await onMessage(message, client);
        } catch (e) {
            return console.log(e.message);
        }
    }

    @On("interactionCreate")
    async onclick(interaction: ArgsOf<"interactionCreate">, client: Client): Promise<void> {
        if (interaction[0].type === "MESSAGE_COMPONENT") {
            try {
                let dm = await interaction[0].user.createDM();
                dm.send(`**Ollbot Issue Reporter**\nPlease leave a detailed report of the error you've experienced.
            \nFor example:\n`+ '`' + `Issue: Word unavailable.\nWord attempted: exampleword` + '`');
            } catch (e) {
                return console.log(e.message);
            }
        }

        if (interaction[0].type === "APPLICATION_COMMAND") {
            Index.client.executeSlash(interaction[0]);
            return;
        }
    }
}

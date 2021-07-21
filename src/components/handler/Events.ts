import { Discord, On, Guild, Client, ArgsOf } from "@typeit/discord";
import { GuildType } from "../models/GuildType";
import { onJoin } from '../events/onJoin';
import { ExtendedGuildType } from "../models/ExtendedGuildType";
import { onMessage } from "../events/onMessage";

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
            await onMessage(message, client);
        } catch (e) {
            return console.log(e.message);
        }
    }
}

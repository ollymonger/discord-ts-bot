import { Discord, On, Guild } from "@typeit/discord";
import { GuildType } from "../models/GuildType";
import { onJoin } from '../events/onJoin';
import { ExtendedGuildType } from "../models/ExtendedGuildType";

@Discord()
@Guild()
export abstract class Events {
    @On("guildCreate")
    async join(guild: GuildType): Promise<void> {
        try {
            await onJoin(guild);
        } catch (e) {
            return console.log(e.message);
        }
    }
}

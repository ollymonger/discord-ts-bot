import { ArgsOf, Client } from '@typeit/discord';
import { ClientUser, MessageEmbed } from 'discord.js';
import * as spellchecker from 'simple-spellchecker';
import { Index } from '../..';


export async function onMessage(message: ArgsOf<"message">, client: Client) {
    if (message[0].author !== client.user) {
        let embed: MessageEmbed[] = [new MessageEmbed()];
        embed[0].setTitle("Spelling Corrected");
        embed[0].setDescription(`${message[0].content}`);
        message[0].channel.send({ embeds: embed });
        return;
    }
}

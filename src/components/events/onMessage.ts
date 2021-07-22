import { ArgsOf, Client, Discord } from '@typeit/discord';
import { MessageEmbed, MessageComponent, MessageActionRow } from 'discord.js';
import { Nodehun } from 'nodehun';
import * as fs from 'fs';

const affix = fs.readFileSync('src/components/events/dictionary/en-US.aff');
const dictionary = fs.readFileSync('src/components/events/dictionary/en-US.dic');

const nodehun = new Nodehun(affix, dictionary);

export async function onMessage(message: ArgsOf<"message">, client: Client) {
    if (message[0].author !== client.user) {

        const messageSplit = message[0].content.split(" ");
        let str = "";
        let int = 0;
        try {
            for (const mes of messageSplit) {
                let nopunc = mes.replace(/[.,\/#!?$%\^&\*;:{}=\-_`~()0-9]/g, "");
                const spelledCorrectly = await nodehun.spell(nopunc);
                if (spelledCorrectly && !message[0].content.includes("@")) {
                    str += ` ${nopunc}`;
                } else if (!spelledCorrectly && !message[0].content.includes("@")) {
                    const suggestion = await nodehun.suggest(nopunc);
                    str += ` ${suggestion[0]}`;
                    int++;
                }
            }
            if (int !== 0) {
                let embed: MessageEmbed[] = [new MessageEmbed()];
                embed[0].setTitle("Ollbot - spell check");
                embed[0].setDescription("Loading...");
                let data = { type: 1, label: "hi" }
                let component: MessageActionRow = new MessageActionRow();
                component.addComponents({ type: "BUTTON", style: "DANGER", customId: `${message[0].author}`, label: "Report an issue" });
                let reply = await message[0].channel.send({ embeds: embed, components: [component] });



                embed[0].setTitle("Ollbot - spell check");
                embed[0].setDescription("A spelling mistake was detected.");
                embed[0].setThumbnail(message[0].author.displayAvatarURL());
                embed[0].addFields([{
                    name: "Corrected spelling",
                    value: `${message[0].author}:${str}\n\n`,
                    inline: true
                }])
                embed[0].setColor(1687562);
                embed[0].setFooter("© Ollbot", client.user.displayAvatarURL());
                embed[0].setTimestamp();
                await reply.edit({ embeds: embed });

                message[0].delete();
                return;
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}

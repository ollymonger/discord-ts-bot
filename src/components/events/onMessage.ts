import { ArgsOf, Client } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import { Nodehun } from 'nodehun';
import * as fs from 'fs';

const affix = fs.readFileSync('src/components/events/dictionary/en-US.aff');
const dictionary = fs.readFileSync('src/components/events/dictionary/en-US.dic');

const nodehun = new Nodehun(affix, dictionary);


export async function onMessage(message: ArgsOf<"message">, client: Client) {
    if (message[0].author !== client.user) {
        const messageSplit = message[0].content.split(" ");
        let incorrect = 0;

        messageSplit.map(async m => {
            const spell = await nodehun.spell(m);
        })
    }
}

/*
const sendEmbed = async (messageSplit, message) => {
    let str = "";

    messageSplit.map(async m => {
        if (str == "") {
            if (await nodehun.spell(m)) {
                str = m;
                return;
            }
            let array = await nodehun.suggest(m)
            str = await array[0];
        }
        if (await nodehun.spell(m)) {
            str += ` ${m}`;
            return;
        }
        let array = await nodehun.suggest(m)
        str += ` ${await array[0]}`;
    })

    let embed: MessageEmbed[] = [new MessageEmbed()];
    embed[0].setTitle("Ollbot - spell check");
    embed[0].setDescription("Loading...");

    let reply = await message[0].channel.send({ embeds: embed });

    embed[0].setTitle("Ollbot - spell check");
    embed[0].setDescription(`${str}`);
    await reply.edit({ embeds: embed });

    return;
}
*/

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
        let str = "";
        let int = 0;
        try {
            for(const mes of messageSplit){
                const spelledCorrectly = await nodehun.spell(mes);
                if(spelledCorrectly && !message[0].content.includes("@")) {
                    str += ` ${mes}`;
                } else if(!spelledCorrectly && !message[0].content.includes("@")) {
                    const suggestion = await nodehun.suggest(mes);
                    str += ` ${suggestion[0]}`;
                    int++;
                }
            }
            if(int !== 0){
                let embed: MessageEmbed[] = [new MessageEmbed()];
                embed[0].setTitle("Ollbot - spell check");
                embed[0].setDescription("Loading...");
    
                let reply = await message[0].channel.send({ embeds: embed });
    
                embed[0].setTitle("Ollbot - spell check");
                embed[0].setDescription(`${message[0].author}:${str}`);
                await reply.edit({ embeds: embed });
                message[0].delete();
                return;
            }
        } catch (e) {
            console.error(e.message);
        }
    }
}
import fs from 'node:fs';
import { createRequire } from "node:module";
import Discord from "discord.js";

const require = createRequire(import.meta.url);

const client = new Discord.Client({
    partials: [Discord.Partials.Channel],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
    ],
});

/**
 * start & login to the bot and other stuff
 */
async function init()
{
    const { token } = require(`./config.json`);
    if (token.length < 50)
        console.error(`invalid token`);

    const eventFiles = fs.readdirSync(`./events`).filter((file) => file.endsWith(`.js`));
    for (const file of eventFiles)
    {
        let event = await import(`./events/${ file }`);
        event = event.default || event;
        if (event.once)
            client.once(event.name, (...ourArguments) => event.execute(...ourArguments, Discord, client));
        else
            client.on(event.name, (...ourArguments) => event.execute(...ourArguments, Discord, client));
    }

    client.login(token);

    // catch everything if not workflow AND not dev env
    process.on(`unhandledRejection`, (error) =>
    {
        // eslint-disable-next-line no-restricted-syntax
        console.log(error);
    });

    process.on(`uncaughtException`, (error) =>
    {
        // eslint-disable-next-line no-restricted-syntax
        console.log(error);
    });
}

await init();

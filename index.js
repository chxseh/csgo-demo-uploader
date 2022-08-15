import fs from 'node:fs';
import { createRequire } from "node:module";
import Discord from "discord.js";

const require = createRequire(import.meta.url);

const client = new Discord.Client({
    partials: [Discord.Partials.Channel],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
    ],
});

/**
 * start & login to the bot and other stuff
 */
async function init()
{
    const { token, demoDir, uploadChannelId } = require(`./config.json`);
    if (token.length < 50)
        console.error(`Invalid token specified.`);
    else if (!fs.existsSync(demoDir))
        console.error(`Invalid demo directory specified.`);
    else if (uploadChannelId.length < 8)
        console.error(`Invalid uploadChannelId specified.`);

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

    // catch everything so bot keeps running
    process.on(`unhandledRejection`, (error) =>
    {
        console.log(error);
    });

    process.on(`uncaughtException`, (error) =>
    {
        console.log(error);
    });
}

await init();

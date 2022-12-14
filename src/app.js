import fs from 'node:fs';
import { createRequire } from "node:module";
import Discord from "discord.js";
import chalk from 'chalk';

const require = createRequire(import.meta.url);
var readlineSync = require(`readline-sync`);

const client = new Discord.Client({
    partials: [Discord.Partials.Channel],
    intents: [
        Discord.GatewayIntentBits.Guilds,
    ],
});

process.title = `CSGO Demo Uploader`;

/**
 * start & login to the bot and other stuff
 */
async function init()
{
    await configCheck();

    const { token, demoDir, uploadChannelId } = require(`./config.json`);
    if (token.length < 50)
    {
        console.error(chalk.bold.red(`Invalid token specified.`));
        readlineSync.question(`\nPress Enter to exit...\n`);
        process.exit(1);
    }
    else if (!fs.existsSync(demoDir))
    {
        console.error(chalk.bold.red(`Invalid demo directory specified.`));
        readlineSync.question(`\nPress Enter to exit...\n`);
        process.exit(1);
    }
    else if (uploadChannelId.length < 8)
    {
        console.error(chalk.bold.red(`Invalid uploadChannelId specified.`));
        readlineSync.question(`\nPress Enter to exit...\n`);
        process.exit(1);
    }

    /* eslint-disable unicorn/empty-brace-spaces */
    // catch everything so bot keeps running
    process.on(`unhandledRejection`, () => { });
    process.on(`uncaughtException`, () => { });
    /* eslint-enable unicorn/empty-brace-spaces */

    const eventFiles = fs.readdirSync(`./src/events`).filter((file) => file.endsWith(`.js`));
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
}

await init();

/**
 *
 */
async function configCheck()
{
    if (fs.existsSync(`./src/config.json`))
    {
        const rawConfig = fs.readFileSync(`./src/config.json`);
        const config = JSON.parse(rawConfig);
        const rawDefaultConfig = fs.readFileSync(`./src/config.json.example`);
        const defaultConfig = JSON.parse(rawDefaultConfig);
        for (const key in defaultConfig)
        { // If we already have a config, check and see if everything from defaultConfig is set.
            if (!(key in config))
                config[key] = defaultConfig[key];
        }
        for (const key in config)
        { // Clean Legacy Config Options. (If something in config is not in defaultConfig, remove it from config).
            if (!(key in defaultConfig))
                delete config[key];
        }
        fs.writeFileSync(`./src/config.json`, JSON.stringify(config, undefined, 4));
        return;
    }

    fs.copyFileSync(`./src/config.json.example`, `./src/config.json`);

    let token = ``;
    do
    {
        token = readlineSync.question(`Please enter your Discord Bot Token: `, {
            hideEchoBack: true,
        });
    }
    while (token.length < 50);

    let uploadChannelId = ``;
    do
        uploadChannelId = readlineSync.question(`Please enter the Channel ID you want to upload to: `);
    while (uploadChannelId.length < 8);

    let demoDirectory = readlineSync.questionPath(`Please enter the path to your CSGO Server's "csgo" Folder (i.e. C:\\CSGO\\csgo): `, {
        isDirectory: true,
        exists: true
    });

    // Remove trailing slash
    if (demoDirectory.endsWith(`\\`) || demoDirectory.endsWith(`/`))
        demoDirectory = demoDirectory.slice(0, -1);

    const deleteAfterUpload = readlineSync.keyInYNStrict(`Do you want to delete the demo after it has been uploaded? `);

    const config = require(`./config.json`);
    config.token = token.trim();
    config.demoDir = demoDirectory.trim();
    config.uploadChannelId = uploadChannelId.trim();
    config.deleteAfterUpload = deleteAfterUpload;
    fs.writeFileSync(`./src/config.json`, JSON.stringify(config, undefined, 4)); // save settings to config
}

import fs from 'node:fs';
import { createRequire } from "node:module";
import Catbox from "catbox.moe";

const require = createRequire(import.meta.url);
const { demoDir, uploadChannelId, deleteAfterUpload } = require(`../config.json`);

/**
 * @name ready
 * @description Event that fires when the bot is ready.
 */
export default {
    name: `ready`,
    once: true,
    /**
     * @param {*} client The Client Object.
     * @param {*} Discord The Discord Object.
     */
    async execute(client, Discord)
    {
        await client.guilds.fetch();

        if (client.guilds.cache.size === 0)
        {
            console.log(`Invite me to a server before starting:\nhttps://discord.com/api/oauth2/authorize?client_id=${ client.user.id }&permissions=8&scope=bot%20applications.commands`);
            process.exit(1);
        }
        else if (client.guilds.cache.size > 1)
        {
            console.log(`This bot only works in one server. Please kick it from other servers and try again.`);
            process.exit(1);
        }

        var actionDone = {};
        console.log(`Watching for existing demos...`);
        const files = fs.readdirSync(demoDir);
        for (const filename of files)
        {
            if (filename.endsWith(`.dem`))
                await doDemos(actionDone, filename, client, Discord);
        }

        console.log(`Watching for new demos...`);
        fs.watch(demoDir, async (eventType, filename) =>
        {
            if (eventType === `change` && filename.endsWith(`.dem`))
                await doDemos(actionDone, filename, client, Discord);
        });
    }
};

/**
 *
 * @param {object} actionDone Hack to prevent duplicate messages.
 * @param {string} filename The filename of the demo.
 * @param {*} client The Client Object.
 * @param {*} Discord The Discord Object.
 */
async function doDemos(actionDone, filename, client, Discord)
{
    const file = fs.readFileSync(`${ demoDir }/${ filename }`);
    const filePath = `${ demoDir }/${ filename }`;

    // Prevent duplicate uploads.
    var stats = fs.statSync(filePath);
    var seconds = +stats.mtime;
    if (actionDone[filename] === seconds) return;
    actionDone[filename] = seconds;

    if (file.length < 2) return; // Ignore empty files.
    if (file.length < 8_000_000)
    { // If < 8MB, upload as Discord Attachment.
        const attachment = new Discord.AttachmentBuilder(file, { name: filename });
        await client.channels.cache.get(uploadChannelId).send({
            files: [attachment]
        });
    }
    else if (file.length < 200_000_000)
    { // If < 2GB, upload to Catbox.
        const catbox = new Catbox.Catbox(undefined);
        const potUrl = await catbox.upload(filePath);
        if (!potUrl || potUrl === undefined || potUrl === `undefined` || potUrl.includes(`<body>`))
            return client.channels.cache.get(uploadChannelId).send(`Catbox was down, please ask the bot owner to upload \`${ filename }\`.`);
        await client.channels.cache.get(uploadChannelId).send(`<${ potUrl }>\nOriginal File Name: \`${ filename }\``);
    }
    else
    {
        // Too big to handle, bail.
        await client.channels.cache.get(uploadChannelId).send(`\`${ filename }\` is too big to upload.\nPlease ask the bot owner to upload it.`);
    }

    // Delete demo from local disk after upload. (Can potentially miss some demos if Catbox is down, or demo is > 2GB.)
    if (deleteAfterUpload)
        await fs.unlinkSync(`${ demoDir }/${ filename }`);
}

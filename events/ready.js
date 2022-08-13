import fs from 'node:fs';
import { createRequire } from "node:module";
import Catbox from "catbox.moe";

const require = createRequire(import.meta.url);
const { demoDir, uploadChannelId } = require(`../config.json`);
const message = `New Demo:`;

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
            console.warn(`${ global.locale[global.gLocale].inviteLink }:\nhttps://discord.com/api/oauth2/authorize?client_id=${ client.user.id }&permissions=8&scope=bot%20applications.commands`);
        else if (client.guilds.cache.size > 1)
        {
            // eslint-disable-next-line no-restricted-syntax
            console.log(`This bot only works in one server. Please kick it from other servers and try again.`);
            process.exit(1);
        }

        // eslint-disable-next-line no-restricted-syntax
        console.log(`Watching demo folder.`);
        var actionDone = {};
        fs.watch(demoDir, async (eventType, filename) =>
        {
            if (eventType === `change` && filename.endsWith(`.dem`))
            {
                const file = fs.readFileSync(`${ demoDir }/${ filename }`);
                const filePath = `${ demoDir }/${ filename }`;
                var stats = fs.statSync(filePath);
                var seconds = +stats.mtime;
                if (actionDone[filename] === seconds) return;
                actionDone[filename] = seconds;

                if (file.length < 2) return; // Ignore empty files.
                // If file is less than 8 mb upload as attachment.
                if (file.length < 8_000_000)
                {
                    const attachment = new Discord.AttachmentBuilder(file, { name: filename });
                    await client.channels.cache.get(uploadChannelId).send({
                        content: message,
                        files: [attachment]
                    });
                    await fs.unlinkSync(`${ demoDir }/${ filename }`);
                }
                else if (file.length < 200_000_000)
                {
                    // upload to catbox
                    const catbox = new Catbox.Catbox(undefined);
                    const potUrl = await catbox.upload(filePath);
                    await client.channels.cache.get(uploadChannelId).send(`${ message } ${ potUrl }`);
                    await fs.unlinkSync(`${ demoDir }/${ filename }`);
                }
                else
                    await client.channels.cache.get(uploadChannelId).send(`${ filename } is too big to upload. Please ask the bot owner to upload it.`);
            }
        });
    }
};

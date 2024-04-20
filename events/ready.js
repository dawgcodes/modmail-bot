const { eventshandler, commandshandler, db } = require("..");
const config = require("../config");
module.exports = new eventshandler.event({
    event: 'ready',
    once: true,
    run: async (_, client) => {

        const loginTimestamp = new Date().toLocaleString();
        console.log(`[${loginTimestamp}] Logged in as: ${client.user.displayName}`);
        

        await commandshandler.deploy(client, {
            REST: {
                version: '10'
            }
        });

        const guild = client.guilds.cache.get(config.modmail.guildId);

        if (!guild) {
            console.log('Invalid guild ID provided in .env file.');
            process.exit(1);
        };

        const category = guild.channels.cache.find((v) => v.id === config.modmail.categoryId || v.name === 'ModMail');

        if (!category) {
            console.log('Invalid category ID provided in .env file and unable to find a category named \'ModMail\'.');
            process.exit(1);
        };

        const timestamp = new Date().toLocaleString();
        console.log(`[${timestamp}] Started checking the JSON files database...`);
        

        const mails = await db.select('mails', { guildId: guild.id });

        let found = 0;

        for (const mail of mails) {
            const channel = guild.channels.cache.get(mail.channelId);

            if (!channel) {
                found++;

                db.delete('mails', { channelId: mail.channelId });
            };
        };

        console.log(`[${loginTimestamp}] Total invalid mails found and deleted: ${found}`);
        
    }
});
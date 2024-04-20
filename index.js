const { SQLiteDatabase } = require('mewwme-sqlite');
const { CommandsHandler, EventsHandler } = require('horizon-handler');
const {
    Client,
    GatewayIntentBits,
    Partials,
    WebhookClient,
    Constants
} = require('discord.js');
require('colors');
require('dotenv').config();
const config = require("./config.js");
const projectVersion = require('./package.json').version || "v0.0.0";

const client = new Client({
    intents: Object.values(GatewayIntentBits),
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
    presence: {
        activities: [],
    },
    shards: "auto"
});

const activities = [
    `${config.setPresence.activity1}`,
    `${config.setPresence.activity2}`,
    `${config.setPresence.activity3}`,
    `${config.setPresence.customStatus}`
];

setInterval(() => {
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const activityObj = {
        name: randomActivity,
        type: config.setPresence.type,
        url: `${config.setPresence.url}`
    };

    if (config.setPresence.type === 4) {
        activityObj.state = `${config.setPresence.customStatus}`;
    }

    client.user.setPresence({
        activities: [activityObj],
        status: config.setPresence.status
    });
}, 5000);

const webhookClient = (config.logs.webhookURL || process.env.WEBHOOK_URL )
    ? new WebhookClient({ url: config.logs.webhookURL || process.env.WEBHOOK_URL })
    : null;

const db = new SQLiteDatabase('./database/main.db');

(async () => {
    await db.create(
        {
            name: 'bans',
            overwrite: true,
            keys: {
                id: ['INTEGER', { primary: true, autoincrement: true }],
                userId: ['TEXT'],
                guildId: ['TEXT'],
                reason: ['TEXT', { nullable: true }]
            }
        },
        {
            name: 'mails',
            overwrite: true,
            keys: {
                id: ['INTEGER', { primary: true, autoincrement: true }],
                authorId: ['TEXT'],
                guildId: ['TEXT'],
                channelId: ['TEXT'],
                closed: ['BOOLEAN', { nullable: true }]
            }
        }
    );
})();

console.log(`
`.underline.white + `version ${projectVersion}, Made by tragic in Bogor.
`.underline.white);

client.login(config.client.token || process.env.CLIENT_TOKEN).catch((e) => {
    console.error('Unable to connect to the bot, this might be an invalid token or missing required intents!\n'.red, e);
});

const commandshandler = new CommandsHandler('./commands/', false);
const eventshandler = new EventsHandler('./events/', false);

commandshandler.on('fileLoad', (command) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Loaded new command: ${command.name}`);
});

eventshandler.on('fileLoad', (event) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Loaded new event: ${event}`);
});


module.exports = {
    client,
    webhookClient,
    db,
    commandshandler,
    eventshandler
};

(async () => {
    await commandshandler.load();

    await eventshandler.load(client);
})();

process.on('unhandledRejection', (reason, promise) => {
    console.error("[ANTI-CRASH: unhandledRejection] An error has occured and been successfully handled:".yellow);

    console.error(promise, reason);
});

process.on("uncaughtException", (err, origin) => {
    console.error("[ANTI-CRASH: uncaughtException] An error has occured and been successfully handled:".yellow);

    console.error(err, origin);
});

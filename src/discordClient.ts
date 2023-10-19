import Discord, { GatewayIntentBits, Partials } from 'discord.js';

class DiscordClient extends Discord.Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            partials: [Partials.Channel],
        });
    }

    // Override the login method with the correct signature
    login(): Promise<string> {
        return super.login(process.env.DISCORD_SECRET);
    }
}

export default DiscordClient;

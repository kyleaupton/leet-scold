import { Client, Events, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import { logger } from './logger.js'
import { envPath } from './utils.js'

config({ path: envPath() })

let client: Client | undefined

export const initializeDiscord = async (): Promise<Client> => {
  const requiredEnv = ['DISCORD_BOT_ID', 'DISCORD_BOT_KEY', 'DISCORD_BOT_GUILD', 'DISCORD_BOT_CHANNEL']
  for (const env of requiredEnv) {
    if (!process.env[env]) {
      throw new Error(`${env} is not set`)
    }
  }

  await new Promise<void>((resolve) => {
    client = new Client({ intents: [GatewayIntentBits.Guilds] })

    client.once(Events.ClientReady, (readyClient) => {
      logger.info(`Discord client logged in as ${readyClient.user.tag}`)
      resolve()
    })

    void client.login(process.env.DISCORD_BOT_KEY)
  })

  if (!client) {
    throw new Error('Client not initialized')
  }

  return client
}

export { client }
